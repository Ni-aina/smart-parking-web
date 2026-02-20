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
               
                const paymentRequest = supabaseAdmin
                    .from("payments")
                    .update({
                        status: "succeeded",
                        method: intent.payment_method_types[0],
                    })
                    .eq("transaction_id", intent.id)

                const reservationRequest = supabaseAdmin
                    .from("reservations")
                    .update({ status: "active" })
                    .eq("id", intent.metadata.reservationId);

                const [
                    { error: paymentError },
                    { error: reservationError }
                ] = await Promise.all([
                    paymentRequest,
                    reservationRequest,
                ])

                if (paymentError) {
                    throw paymentError;
                }

                if (reservationError) {
                    throw reservationError;
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

            default: throw new Error(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true })
    } catch (error: any) {
        return NextResponse.json({ received: true })
    }
}