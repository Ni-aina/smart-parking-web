"use server";

import { getServerAuth } from "./authServer.action";
import { normalizeData } from "@/utils/normalizeData";
import { PaymentInterface } from "@/types/payment";
import { rejectTimeout } from "@/utils/rejectTimeout";
import { isUUID } from "@/utils/isUUID";

export async function getPaymentByReservationId(reservationId: string)
    : Promise<PaymentInterface | null> {
    try {
        if (!reservationId) throw new Error("Reservation id is required");

        const request = (async () => {
            const { supabase, userId } = await getServerAuth();

            if (!isUUID(userId)) throw new Error("Invalid user ID");

            const { data: payment, error } = await supabase
                .from("payments")
                .select(`
                    *,
                    reservation: reservation_id!inner(
                        *,
                        driver: driver_id(*),
                        lot: lot_id!inner(
                            *,
                            lot_type:type_id(*)
                        ),
                        vehicle: vehicle_id(*)
                    )
                `)
                .eq("reservation_id", reservationId)
                .eq("reservation.lot.owner_id", userId)
                .maybeSingle();

            if (error) throw new Error(`Payment fetching error, ${error.message}`);
            if (!payment) return null;

            return normalizeData(payment) as PaymentInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getPaymentsForOwner(
    page = 1,
    limit = 20,
    searchTerm = ""
): Promise<PaymentInterface[] & { count: number }> {
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
                { data: payments, error }
            ] = await Promise.all([
                supabase.from("payments")
                    .select(
                        "*, reservation:reservation_id!inner(*, lot:lot_id!inner(owner_id))",
                        { count: "exact" }
                    )
                    .eq("reservation.lot.owner_id", userId),
                supabase.from("payments")
                    .select(`
                        *,
                        reservation:reservation_id!inner(
                            *,
                            driver:driver_id(*),
                            lot:lot_id!inner(
                                *,
                                lot_type:type_id(*)
                            ),
                            vehicle:vehicle_id(*)
                        )
                    `)
                    .eq("reservation.lot.owner_id", userId)
                    .order("created_at", {
                        ascending: false
                    })
                    .range(from, to)
            ])

            if (!payments) throw new Error(`Payment fetching error, ${error.message}`);

            const normalized = payments.map((item: any) => normalizeData(item));
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
