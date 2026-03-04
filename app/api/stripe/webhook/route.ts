import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createProfile } from "@/actions/profile.action";

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

                const {
                    id: transactionId,
                    metadata: {
                        // Reservation payment
                        reservationId,
                        // Subscription payment
                        planId,
                        userId,
                        name,
                        email,
                        phone
                    }
                } = intent;

                if (transactionId && reservationId) {
                    
                    const paymentRequest = supabaseAdmin
                        .from("payments")
                        .update({
                            status: "succeeded",
                            method: intent.payment_method_types[0],
                        })
                        .eq("transaction_id", transactionId)

                    const reservationRequest = supabaseAdmin
                        .from("reservations")
                        .update({ status: "active" })
                        .eq("id", reservationId);

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
                }

                if (
                    transactionId && 
                    userId && 
                    planId && 
                    name && 
                    email && 
                    phone
                ) {

                    const charge = await stripe.charges.retrieve(intent.latest_charge as string, {
                        expand: ["payment_method_details"]
                    })

                    const cardLastFour = charge.payment_method_details?.card?.last4 ?? "****";

                    const startDate = new Date();
                    const endDate = new Date(startDate);
                    endDate.setMonth(endDate.getMonth() + 1);

                    const [
                        _profile,
                        {
                            error: subscriptionError
                        }
                    ] = await Promise.all([
                        createProfile({
                            id: userId,
                            roles: ["owner"],
                            fullName: name,
                            emailAddress: email,
                            phoneNumber: phone
                        }),
                        supabaseAdmin
                        .from("subscriptions")
                        .upsert({
                            owner_id: userId,
                            plan_id: planId,
                            transaction_id: transactionId,
                            card_last_four: cardLastFour,
                            status: "active",
                            start_date: startDate.toISOString(),
                            end_date: endDate.toISOString()
                        }, { onConflict: "owner_id" })
                        .select("id")
                        .single()
                    ])
                    
                    if (subscriptionError) {
                        throw subscriptionError;
                    }
                }
                
                break;
            }

            case "payment_intent.payment_failed": {
                const intent = event.data.object;
                const { id: transactionId } = intent;

                await supabaseAdmin
                    .from("payments")
                    .update({ status: "failed" })
                    .eq("transaction_id", transactionId);
                break;
            }

            default: throw new Error(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true })
    } catch (error: any) {
        return NextResponse.json({ received: true })
    }
}