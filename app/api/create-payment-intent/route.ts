import { getProfileByEmail } from "@/actions/profile.action";
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
            !name || 
            !email || 
            !phone ||
            !password
        ) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let [
            supabase,
            user
        ] = await Promise.all([
            createClient(),
            getProfileByEmail(email)
        ])

        if (!user) {
            const { data: { user: signUpUser }, error } = await supabase.auth.signUp({
                email,
                password
            })
            
            if (error) throw new Error(`Failed to create user ${error?.message}`);
            
            user = signUpUser;
        }

        if (!user) {
            throw new Error("Failed to get user");
        }

        const {
            id: userId
        } = user;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ["card"],
            metadata: {
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