import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const {
      amount,
      currency,
      userId,
      reservationId
    } = await req.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      )
    }

    if (!userId || !reservationId) {
      return NextResponse.json(
        { error: "User ID and Reservation ID are required" },
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId,
        reservationId
      }
    })

    const payment = await supabaseAdmin
      .from("payments")
      .insert({
        transaction_id: paymentIntent.id,
        amount: amount / 100,
        reservation_id: reservationId,
        status: "pending"
      })
      .select()
      .single()

    if (payment.error) {
      throw payment.error;
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}