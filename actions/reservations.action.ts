"use server"

import { getServerAuth } from "./authServer.action"
import { normalizeData } from "@/utils/normalizeData"
import { ReservationInterface } from "@/types/reservation"
import { rejectTimeout } from "@/utils/rejectTimeout"
import { isUUID } from "@/utils/isUUID"

export async function getReservationsForOwner()
    : Promise<ReservationInterface[]> {
    try {
        const { supabase, userId } = await getServerAuth();

        if (!isUUID(userId)) {
            throw new Error("Invalid user ID");
        }

        const d = new Date();
        d.setMonth(d.getMonth() - 6);

        const request = (async () => {
            const { data: reservations, error } = await supabase.from("reservations")
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
                .gte("created_at", d.toISOString())
                .order("created_at", {
                    ascending: false
                })

            if (!reservations) throw new Error(`Reservation fetching error, ${error.message}`);

            const normalizedData = reservations.map((item: any) => normalizeData(item));
            return normalizedData as ReservationInterface[];
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}