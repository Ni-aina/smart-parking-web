"use client";

import { SubscriptionPlanInterface } from "@/types/subscription";
import ComingSoon from "../Subscription/ComingSoon";

interface StepPaymentProps {
    plan: SubscriptionPlanInterface;
}

const StepPayment = ({
    plan
}: StepPaymentProps) => {

    const {
        name,
        price,
        isActive
    } = plan;

    if (!isActive) return (
        <ComingSoon 
            name={name} 
            price={price} 
        />
    )

    return (
        <div className="mt-3 flex flex-col gap-4">
            <div className="p-4 rounded-sm border border-white/20">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-sm">
                            {name} Plan
                        </h2>
                        <p className="text-xs text-white/40 mt-1">Billed monthly</p>
                    </div>
                    <span className="text-lg font-semibold">
                        ${price}
                        <span className="text-white/40 text-xs font-normal">/mo</span>
                    </span>
                </div>
            </div>
            <button
                className="w-full py-3 rounded-sm bg-blue-950 text-white 
                font-bold flex items-center justify-center gap-1 
                cursor-pointer hover:opacity-90 transition-opacity"
            >
                <span className="text-sm">Pay with</span>
                <span className="font-extrabold italic text-sm">
                    Stripe
                </span>
            </button>
            <p className="text-[10px] text-white/30 text-center">
                Powered by Stripe — Secure payment processing
            </p>
        </div>
    )
}

export default StepPayment;
