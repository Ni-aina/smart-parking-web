"use server";

import { getServerAuth } from "./authServer.action";
import { normalizeData } from "@/utils/normalizeData";
import { ReservationInterface } from "@/types/reservation";
import { rejectTimeout } from "@/utils/rejectTimeout";
import { isUUID } from "@/utils/isUUID";
import { revalidatePath } from "next/cache";
import { keyFilter } from "@/types/global";
import { getFilterDates } from "@/utils/DateTimeFilter";

export async function deleteRerservation(reservationId: string) {
    try {

        const request = (async () => {
            const { supabase } = await getServerAuth();

            const { error } = await supabase.from("reservations")
                .delete()
                .eq("id", reservationId)
                .single();

            if (error) return;
            revalidatePath("/owner/reservations");
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

            const firstDayLastWeek = new Date(firstDay);
            firstDayLastWeek.setDate(firstDay.getDate() - 7);

            const { data: reservations, error } = await supabase
                .from("reservations")
                .select("created_at, lot:lot_id!inner(owner_id)")
                .eq("lot.owner_id", userId)
                .gte("created_at", firstDayLastWeek.toISOString());

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
    limit = 20
)
    : Promise<ReservationInterface[] & { count: number }> {
    try {
        const { supabase, userId } = await getServerAuth();

        if (!isUUID(userId)) {
            throw new Error("Invalid user ID");
        }

        const from = (page - 1) * limit;
        const to = from + (limit - 1);

        const request = (async () => {
            const [
                { count },
                { data: reservations, error }
            ] = await Promise.all([
                supabase.from("reservations")
                    .select("*, lot:lot_id!inner(owner_id)", { count: "exact" })
                    .eq("lot.owner_id", userId),
                supabase.from("reservations")
                    .select(`
                    *,
                    driver: driver_id(*),
                    lot: lot_id!inner(
                        *,
                        lot_type:type_id(*)
                    ),
                    vehicle: vehicle_id(*)
                `)
                    .eq("lot.owner_id", userId)
                    .order("created_at", {
                        ascending: false
                    })
                    .range(from, to)
            ])

            if (!reservations) throw new Error(`Reservation fetching error, ${error.message}`);

            const normalized = reservations.map((item: any) => normalizeData(item));
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