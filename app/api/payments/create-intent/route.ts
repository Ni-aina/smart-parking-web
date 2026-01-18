import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  const { amount, currency } = await req.json()

  if (!amount) {
    return NextResponse.json(
      { error: "Amount is required" },
      { status: 400 }
    )
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: currency || "usd",
    automatic_payment_methods: {
      enabled: true
    }
  })

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret
  })
}
