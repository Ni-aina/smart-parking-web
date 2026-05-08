import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { isUUID } from "@/utils/isUUID";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
        const { 
            amount,
            name,
            email,
            phone,
            password,
            planId
        } = await request.json();

        if (
            !isUUID(planId) ||
            !amount || amount <= 0 ||
            !name || 
            !email || 
            !phone ||
            !password
        ) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createClient();

        const [
            customer,
            { data: { user }, error }
        ] = await Promise.all([
            stripe.customers.create({
                email,
                name
            }),
            supabase.auth.signUp({
                email,
                password
            })
        ])

        if (!customer) throw new Error("Failed to create customer");

        if (!user || error) throw new Error(`Failed to create user ${error?.message}`);

        const {
            id: userId
        } = user;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ["card"],
            metadata: {
                customerId: customer.id,
                userId,
                planId,
                name,
                email,
                phone
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