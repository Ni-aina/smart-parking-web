"use server";

import { getServerAuth } from "./authServer.action";
import { normalizeData } from "@/utils/normalizeData";
import { ReservationInterface } from "@/types/reservation";
import { rejectTimeout } from "@/utils/rejectTimeout";
import { isUUID } from "@/utils/isUUID";
import { revalidatePath } from "next/cache";

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