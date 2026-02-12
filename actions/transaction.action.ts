"use server";

import { keyFilter } from "@/types/global";
import { getServerAuth } from "./authServer.action";
import { getFilterDates } from "@/utils/DateTimeFilter";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function getRevevueForOwnerByTime(filter: keyFilter)
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