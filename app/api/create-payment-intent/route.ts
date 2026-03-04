import { stripe } from "@/lib/stripe/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
        const { amount } = await request.json();

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ["card"]
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret })

   } catch (err) {
        return NextResponse.json(
            { error: `Internal server error ${err}`},
            { status: 500 }
        )
   }
}