"use server";

import { getServerAuth } from "./authServer.action";
import { isUUID } from "@/utils/isUUID";
import { normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";
import { validateCardNumber, validateExpiredDate } from "@/utils/checkBankInfo";
import {
    SubscriptionPlanInterface,
    SubscriptionInterface,
    SubscriptionStateInterface
} from "@/types/subscription";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";

export async function getSubscriptionPlans(): Promise<SubscriptionPlanInterface[]> {
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

export async function getCurrentSubscription(): Promise<SubscriptionInterface | null> {
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

export async function subscribe(
    _previousState: SubscriptionStateInterface,
    payload: {
        planId: string;
        cardNumber: string;
        expiredDate: string;
    }
): Promise<SubscriptionStateInterface> {

    const { planId, cardNumber, expiredDate } = payload;

    if (!planId || !cardNumber || !expiredDate) {
        return {
            error: "All fields are required",
            success: null
        }
    }

    if (!isUUID(planId)) {
        return {
            error: "Invalid plan selected",
            success: null
        }
    }

    const cleanCard = cardNumber.replace(/\s/g, "");

    if (!validateCardNumber(cleanCard)) {
        return {
            error: "Invalid card number. Please enter a valid Visa card.",
            success: null
        }
    }

    if (!validateExpiredDate(expiredDate)) {
        return {
            error: "Card is expired or invalid date format",
            success: null
        }
    }

    const { supabase, userId } = await getServerAuth();

    if (!supabase || !isUUID(userId)) {
        return {
            error: "Unauthorized",
            success: null
        }
    }

    const { data: plan, error: planError } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("id", planId)
        .single();

    if (planError || !plan) {
        return {
            error: "Plan not found",
            success: null
        }
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const cardLastFour = cleanCard.slice(-4);

    const { error } = await supabase
        .from("subscriptions")
        .upsert({
            owner_id: userId,
            plan_id: planId,
            card_last_four: cardLastFour,
            status: "active",
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString()
        }, { onConflict: "owner_id" });

    if (error) {
        return {
            error: error.message,
            success: null
        }
    }

    revalidatePath("/owner/settings/account");

    return {
        error: null,
        success: `Successfully subscribed to ${plan.name} plan`
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

    return {
        error: null,
        success: "Subscription cancelled successfully"
    }
}
