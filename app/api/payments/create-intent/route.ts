import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isUUID } from "@/utils/isUUID";

export async function POST(req: Request) {
  try {
    const {
      amount,
      currency,
      customerId,
      userId,
      reservationId
    } = await req.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      )
    }

    if (!isUUID(userId) || !isUUID(customerId) || !reservationId) {
      return NextResponse.json(
        { error: "User ID, Customer ID and Reservation ID are required" },
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency || "usd",
      automatic_payment_methods: { enabled: true },
      customer: customerId,
      metadata: {
        userId,
        reservationId
      }
    })

    const payment = await supabaseAdmin
      .from("payments")
      .insert({
        transaction_id: paymentIntent.id,
        amount: amount,
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