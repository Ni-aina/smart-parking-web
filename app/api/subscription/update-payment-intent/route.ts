import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { isUUID } from "@/utils/isUUID";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const {
            planId,
            amount
        } = await request.json();

        if (!isUUID(planId) || !amount || amount <= 0) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, phone_number, customer_id")
            .eq("id", user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            )
        }

        let customer = profile.customer_id ? 
            await stripe.customers.retrieve(profile.customer_id) : 
            await stripe.customers.create({
                email: user.email,
                name: profile.full_name
            })

        if (!customer) throw new Error("Failed to retrieve customer");

        if (!profile.customer_id) {
            await supabase
                .from("profiles")
                .update({ customer_id: customer.id })
                .eq("id", user.id);
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ["card"],
            customer: customer.id,
            metadata: {
                customerId: customer.id,
                userId: user.id,
                planId
            }
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret })

    } catch (error) {
        return NextResponse.json(
            { error },
            { status: 500 }
        )
    }
}
