"use client";

import { Check, Crown } from "lucide-react";
import { SubscriptionPlanInterface } from "@/types/subscription";

interface StepPlanProps {
    plans: SubscriptionPlanInterface[];
    selectedPlan: string;
    setSelectedPlan: (id: string) => void;
}

const StepPlan = ({
    plans,
    selectedPlan,
    setSelectedPlan
}: StepPlanProps) => {
    return (
        <div className="flex flex-col gap-3">
            {
                plans.map(plan => (
                    <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`relative p-4 rounded-sm border cursor-pointer 
                    transition-all ${selectedPlan === plan.id
                                ? "border-white bg-white/10"
                                : "border-white/20 hover:border-white/50"
                            }`}
                    >
                        {
                            plan.popular &&
                            <span
                                className="absolute -top-2.5 right-3 bg-white text-black 
                            text-[10px] font-semibold px-2 py-0.5 rounded-sm 
                            flex items-center gap-1"
                            >
                                <Crown size={10} /> Popular
                            </span>
                        }
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold text-sm">{plan.name}</h2>
                            <span className="text-sm font-semibold">
                                ${plan.price}
                                <span className="text-white/40 text-xs font-normal">/mo</span>
                            </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                            {
                                plan.features.map(f =>
                                    <span
                                        key={f}
                                        className="text-xs text-white/50 flex items-center gap-1"
                                    >
                                        <Check size={10} /> {f}
                                    </span>
                                )}
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default StepPlan;
