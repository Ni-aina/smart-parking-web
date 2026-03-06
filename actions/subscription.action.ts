"use server";

import { getServerAuth } from "./authServer.action";
import { isUUID } from "@/utils/isUUID";
import { normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";
import {
    SubscriptionPlanInterface,
    SubscriptionInterface,
    SubscriptionStateInterface
} from "@/types/subscription";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";

export async function revalidateAuthSubscriptionPlans(): Promise<void> {
    revalidatePath("/auth/sign-up");
}

export async function revalidateAuthSubscription(): Promise<void> {
    revalidatePath("/owner/settings/account");
    revalidatePath("/owner");
}

export async function getSubscriptionPlans()
    : Promise<SubscriptionPlanInterface[]> {
    try {
        const request = (async () => {
            const { data: plans, error } = await supabase
                .from("subscription_plans")
                .select("*")
                .order("price", { ascending: true });

            if (!plans || error) throw new Error(`Plans fetching error, ${error?.message}`);

            return plans.map((item: any) => normalizeData(item)) as SubscriptionPlanInterface[];
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getCurrentSubscription()
    : Promise<SubscriptionInterface | null> {
    try {
        const request = (async () => {
            const { supabase, userId } = await getServerAuth();

            if (!isUUID(userId)) throw new Error("Unauthorized");

            const { data, error } = await supabase
                .from("subscriptions")
                .select(`
                    *,
                    plan: plan_id(*)
                `)
                .eq("owner_id", userId)
                .maybeSingle();

            if (error) throw new Error(`Subscription fetching error, ${error.message}`);

            if (!data) return null;

            const isExpired = data?.status === "active"
                && new Date(data.endDate) < new Date();

            if (isExpired) {
                await expireSubscription();
            }

            return normalizeData(data) as SubscriptionInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function expireSubscription(): Promise<void> {
    try {
        const request = (async () => {
            const { supabase, userId } = await getServerAuth();

            if (!isUUID(userId)) throw new Error("Unauthorized");

            const { error } = await supabase
                .from("subscriptions")
                .update({ status: "expired" })
                .eq("owner_id", userId)
                .eq("status", "active")
                .lt("end_date", new Date().toISOString());

            if (error) throw new Error(`Expire subscription error, ${error.message}`);

            revalidatePath("/owner/settings/account");
            revalidatePath("/owner");
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function cancelSubscription(
    _previousState: SubscriptionStateInterface
): Promise<SubscriptionStateInterface> {

    const { supabase, userId } = await getServerAuth();

    if (!supabase || !isUUID(userId)) {
        return {
            error: "Unauthorized",
            success: null
        }
    }

    const { error } = await supabase
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("owner_id", userId)
        .eq("status", "active");

    if (error) {
        return {
            error: error.message,
            success: null
        }
    }

    revalidatePath("/owner/settings/account");
    revalidatePath("/owner");
    return {
        error: null,
        success: "Subscription cancelled successfully"
    }
}
