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

export async function getOccupancyForOwnerByTime(filter: keyFilter)
    : Promise<{
        occupancy: number
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
                    count: currentActive,
                    error: currentError
                },
                {
                    count: previousActive,
                    error: previousError
                }
            ] = await Promise.all([
                supabase
                    .from("reservations")
                    .select("lot:lot_id!inner(owner_id)", { count: "exact" })
                    .eq("lot.owner_id", userId)
                    .eq("status", "active")
                    .gte("created_at", firstDay.toISOString()),
                supabase
                    .from("reservations")
                    .select("lot:lot_id!inner(owner_id)", { count: "exact" })
                    .eq("lot.owner_id", userId)
                    .eq("status", "active")
                    .gte("created_at", previousFirstDay.toISOString())
                    .lt("created_at", firstDay.toISOString())
            ])

            if (currentError) throw currentError;
            if (previousError) throw previousError;

            const rate = previousActive === 0
                ? (currentActive > 0 ? 100 : 0)
                : ((currentActive - previousActive) / previousActive) * 100;

            const isGrowing = rate > 0;

            return {
                occupancy: currentActive,
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