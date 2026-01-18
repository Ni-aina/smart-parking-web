import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {

    const body = await req.text();
    const headersResponse = await headers();
    const sig = headersResponse.get("stripe-signature");

    if (!sig) {
        return new NextResponse("Missing stripe signature", { status: 400 })
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const intent = event.data.object;

                const { data: payment, error: paymentError } = await supabaseAdmin
                    .from("payments")
                    .update({
                        status: "succeeded",
                        amount: intent.amount_received
                    })
                    .eq("transaction_id", intent.id)
                    .select()
                    .single();

                if (paymentError || !payment) {
                    break;
                }

                const { error: reservationError } = await supabaseAdmin
                    .from("reservations")
                    .update({ status: "active" })
                    .eq("id", payment.reservation_id);

                if (reservationError) {
                    console.error("Failed to update reservation:", reservationError);
                }
                break;
            }

            case "payment_intent.payment_failed": {
                const intent = event.data.object;

                await supabaseAdmin
                    .from("payments")
                    .update({ status: "failed" })
                    .eq("transaction_id", intent.id);
                break;
            }

            default: console.error(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true })
    } catch (error: any) {
        return NextResponse.json({ received: true })
    }
}