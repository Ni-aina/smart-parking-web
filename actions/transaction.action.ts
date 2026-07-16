"use server";

import { keyFilter } from "@/types/global";
import { getServerAuth } from "./authServer.action";
import { getFilterDates } from "@/utils/dates/DateTimeFilter";
import { rejectTimeout } from "@/utils/rejectTimeout";
import { normalizeData } from "@/utils/normalizeData";
import PaymentInterface from "@/types/payment";
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

        const request = (async () => {
            const { data, error } = await supabase.rpc("get_payments_for_owner", {
                p_owner_id: userId,
                p_search_term: searchTerm,
                p_limit: limit,
                p_offset: (page - 1) * limit,
            })

            if (error) throw new Error(`Payment fetching error: ${error.message}`);
            if (!data?.length) return Object.assign([], { count: 0 });

            const count = Number(data.at(0)?.total_count || 0);
            const normalized = data.map((row: any) => normalizeData(row.payment_data));

            return Object.assign(normalized, { count });
        })()

        return Promise.race([request, rejectTimeout()]);
    } catch (error) {
        throw error;
    }
}

export async function getRevenueForOwnerByTime(filter: keyFilter)
    : Promise<{
        revenue: number;
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
                    data: currentRevenue,
                    error: currentError
                },
                {
                    data: previousRevenue,
                    error: previousError
                }
            ] = await Promise.all([
                supabase.rpc("sum_revenue_for_owner", {
                    owner: userId,
                    start_date: firstDay.toISOString(),
                    end_date: new Date().toISOString()
                }),
                supabase.rpc("sum_revenue_for_owner", {
                    owner: userId,
                    start_date: previousFirstDay.toISOString(),
                    end_date: firstDay.toISOString()
                })
            ])

            if (currentError) throw currentError;
            if (previousError) throw previousError;

            const rate = previousRevenue === 0
                ? (currentRevenue > 0 ? 100 : 0)
                : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

            const isGrowing = rate > 0;

            return {
                revenue: currentRevenue ?? 0,
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