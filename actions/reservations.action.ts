"use server";

import { getServerAuth } from "./authServer.action";
import { normalizeData } from "@/utils/normalizeData";
import { ReservationFormInterface, ReservationInterface } from "@/types/reservation";
import { rejectTimeout } from "@/utils/rejectTimeout";
import { isUUID } from "@/utils/isUUID";
import { revalidatePath } from "next/cache";
import { keyFilter } from "@/types/global";
import { getFilterDates } from "@/utils/DateTimeFilter";
import { checkLotByTime } from "./parkingLots.action";
import { checkVehicleSpace } from "./type.action";

export async function revalidateLotsReservations() {
    revalidatePath("/owner/reservations");
    revalidatePath("/owner/parking-lots");
}

export async function createReservation(reservation: ReservationFormInterface)
    : Promise<ReservationInterface> {
    try {
        const request = (async () => {
            const { supabase, userId } = await getServerAuth();

            if (!isUUID(userId)) throw new Error("Invalid user ID");

            const {
                lotId: lot_id,
                driverId: driver_id,
                vehicleId: vehicle_id,
                startTime: start_time,
                endTime: end_time,
                amount
            } = reservation;

            if (!lot_id || !driver_id || !vehicle_id) {
                throw new Error("Lot, driver and vehicle are required");
            }

            if (new Date(start_time) >= new Date(end_time)) {
                throw new Error("Start time must be before end time");
            }

            const startTime = new Date(start_time);
            const endTime = new Date(end_time);

            const [
                availableSpots,
                isValidVehicle
            ] = await Promise.all([
                checkLotByTime(lot_id, startTime, endTime),
                checkVehicleSpace(lot_id, vehicle_id)
            ])

            if (availableSpots <= 0) {
                throw new Error("No available spots for the selected time");
            }

            if (!isValidVehicle) {
                throw new Error("Vehicle does not fit in the selected spot");
            }

            const { data: newReservation, error } = await supabase
                .from("reservations")
                .insert([{
                    lot_id,
                    driver_id,
                    vehicle_id,
                    start_time,
                    end_time,
                    status: "active"
                }])
                .select(`
                    *,
                    driver: driver_id(*),
                    lot: lot_id!inner(
                        *,
                        lot_type:type_id(*)
                    ),
                    vehicle: vehicle_id(*)
                `)
                .single();

            if (!newReservation || error) {
                throw new Error(`Reservation creation error, ${error?.message}`);
            }

            const transactionUUID = `txn_${crypto.randomUUID()}`;

            await supabase
                .from("payments")
                .insert([{
                    reservation_id: newReservation.id,
                    amount: Number(amount),
                    method: "cash",
                    status: "succeeded",
                    transaction_id: transactionUUID
                }])

            revalidatePath("/owner/reservations");

            return normalizeData(newReservation) as ReservationInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getReservationByIdForOwner(reservationId: string)
    : Promise<ReservationInterface> {
    try {
        if (!reservationId) throw new Error("Reservation id is required");

        const request = (async () => {
            const { supabase, userId } = await getServerAuth();

            const { data: reservation, error } = await supabase.from("reservations")
                .select(`
                    *,
                    driver: driver_id(*),
                    lot: lot_id!inner(
                        *,
                        lot_type:type_id(*)
                    ),
                    vehicle: vehicle_id(*)
                `)
                .eq("id", reservationId)
                .eq("lot.owner_id", userId)
                .single();

            if (!reservation || error) throw new Error(`Reservation fetching error, ${error?.message}`);
            return normalizeData(reservation) as ReservationInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function cancelReservation(reservationId: string)
    : Promise<ReservationInterface> {
    try {
        if (!reservationId) throw new Error("Reservation id is required");

        const request = (async () => {
            const { supabase, userId } = await getServerAuth();

            if (!isUUID(userId)) throw new Error("Invalid user ID");

            const { data: currentReservation, error: fetchError } = await supabase
                .from("reservations")
                .select("status, lot:lot_id!inner(owner_id)")
                .eq("id", reservationId)
                .eq("lot.owner_id", userId)
                .single();

            if (fetchError || !currentReservation) {
                throw new Error("Reservation not found");
            }

            if (
                currentReservation.status !== "pending" &&
                currentReservation.status !== "active"
            ) throw new Error("Only pending or active reservations can be cancelled");

            const { data, error } = await supabase.from("reservations")
                .update({ status: "cancelled" })
                .eq("id", reservationId)
                .select(`
                    *,
                    driver: driver_id(*),
                    lot: lot_id!inner(
                        *,
                        lot_type:type_id(*)
                    ),
                    vehicle: vehicle_id(*)
                `)
                .single();

            if (error) throw new Error(`Reservation cancellation error, ${error.message}`);

            revalidatePath("/owner/reservations");
            revalidatePath(`/owner/reservations/${reservationId}`);

            return normalizeData(data) as ReservationInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getTotalReservationsForOwnerByTime(filter: keyFilter)
    : Promise<{
        count: number;
        rate: number;
        isGrowing: boolean;
    }> {
    try {
        const { supabase, userId } = await getServerAuth();

        const request = (async () => {
            const {
                firstDay,
                previousFirstDay
            } = getFilterDates(filter);

            const { count: currentCount } = await supabase.from("reservations")
                .select("lot:lot_id!inner(owner_id)", { count: "exact" })
                .eq("lot.owner_id", userId)
                .gte("created_at", firstDay.toISOString());

            const { count: previousCount } = await supabase.from("reservations")
                .select("lot:lot_id!inner(owner_id)", { count: "exact" })
                .eq("lot.owner_id", userId)
                .gte("created_at", previousFirstDay.toISOString())
                .lt("created_at", firstDay.toISOString());

            const rate = previousCount === 0
                ? (currentCount > 0 ? 100 : 0)
                : ((currentCount - previousCount) / previousCount) * 100;

            const isGrowing = rate > 0;

            return {
                count: currentCount ?? 0,
                rate,
                isGrowing
            }
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getCompletedForOwnerByTime(filter: keyFilter)
    : Promise<{
        completed: number
        rate: number
        isGrowing: boolean
    }> {
    try {
        const { supabase, userId } = await getServerAuth();
        const {
            firstDay,
            previousFirstDay
        } = getFilterDates(filter);

        const request = (async () => {
            const [
                {
                    count: currentCompleted,
                    error: currentError
                },
                {
                    count: previousCompleted,
                    error: previousError
                }
            ] = await Promise.all([
                supabase
                    .from("reservations")
                    .select("lot:lot_id!inner(owner_id)", { count: "exact" })
                    .eq("lot.owner_id", userId)
                    .eq("status", "completed")
                    .gte("created_at", firstDay.toISOString()),
                supabase
                    .from("reservations")
                    .select("lot:lot_id!inner(owner_id)", { count: "exact" })
                    .eq("lot.owner_id", userId)
                    .eq("status", "completed")
                    .gte("created_at", previousFirstDay.toISOString())
                    .lt("created_at", firstDay.toISOString())
            ])

            if (currentError) throw currentError;
            if (previousError) throw previousError;

            const rate = previousCompleted === 0
                ? (currentCompleted > 0 ? 100 : 0)
                : ((currentCompleted - previousCompleted) / previousCompleted) * 100;

            const isGrowing = rate > 0;

            return {
                completed: currentCompleted,
                rate,
                isGrowing
            }
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getCancelledReservationsForOwnerByTime(filter: keyFilter)
    : Promise<{
        count: number;
        rate: number;
        isGrowing: boolean;
    }> {
    try {
        const { supabase, userId } = await getServerAuth();

        const {
            firstDay,
            previousFirstDay
        } = getFilterDates(filter);

        const request = (async () => {
            const [
                {
                    count: currentCount,
                    error: currentError
                },
                {
                    count: previousCount,
                    error: previousError
                }
            ] = await Promise.all([
                supabase
                    .from("reservations")
                    .select("lot:lot_id!inner(owner_id)", { count: "exact" })
                    .eq("lot.owner_id", userId)
                    .eq("status", "cancelled")
                    .gte("created_at", firstDay.toISOString()),
                supabase
                    .from("reservations")
                    .select("lot:lot_id!inner(owner_id)", { count: "exact" })
                    .eq("lot.owner_id", userId)
                    .eq("status", "cancelled")
                    .gte("created_at", previousFirstDay.toISOString())
                    .lt("created_at", firstDay.toISOString())
            ]);

            if (currentError) throw currentError;
            if (previousError) throw previousError;

            let rate = previousCount === 0
                ? (currentCount > 0 ? 100 : 0)
                : ((currentCount - previousCount) / previousCount) * 100;

            rate *= -1;
            const isGrowing = rate > 0;

            return {
                count: currentCount ?? 0,
                rate,
                isGrowing
            }
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getBokingsLastWeekForOwner()
    : Promise<{ day: string; booking: number }[]> {
    try {
        const { supabase, userId } = await getServerAuth();

        const request = (async () => {
            const { firstDay } = getFilterDates("this-week");

            const { data: reservations, error } = await supabase
                .from("reservations")
                .select("created_at, lot:lot_id!inner(owner_id)")
                .eq("lot.owner_id", userId)
                .gte("created_at", firstDay.toISOString());

            if (error) throw error;

            const bookingsByDay = [
                { day: "Sunday", booking: 0 },
                { day: "Monday", booking: 0 },
                { day: "Tuesday", booking: 0 },
                { day: "Wednesday", booking: 0 },
                { day: "Thursday", booking: 0 },
                { day: "Friday", booking: 0 },
                { day: "Saturday", booking: 0 }
            ].reduce((acc, value) => {
                acc[value.day] = value.booking;
                return acc;
            }, {} as Record<string, number>);

            reservations.forEach((reservation: any) => {
                const day = new Date(reservation.created_at).toLocaleDateString("en-US",
                    { weekday: "long" });
                bookingsByDay[day] = (bookingsByDay[day] || 0) + 1;
            })

            return Object.entries(bookingsByDay).map(([day, booking]) => ({ day, booking }));
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getReservationsForOwner(
    page = 1,
    limit = 20,
    searchTerm = ""
): Promise<ReservationInterface[] & { count: number }> {
    try {
        const { supabase, userId } = await getServerAuth();

        if (!isUUID(userId)) {
            throw new Error("Invalid user ID");
        }

        const request = (async () => {
            const { data, error } = await supabase.rpc("get_reservations_for_owner", {
                p_owner_id: userId,
                p_search_term: searchTerm,
                p_limit: limit,
                p_offset: (page - 1) * limit
            });

            if (error) throw new Error(`Reservation fetching error, ${error.message}`);
            if (!data?.length) return Object.assign([], { count: 0 });

            const count = Number(data.at(0)?.total_count || 0);
            const normalized = data.map((row: any) => normalizeData(row.reservation_data));

            return Object.assign(normalized, { count });
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}