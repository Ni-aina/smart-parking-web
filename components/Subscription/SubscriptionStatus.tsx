"use client";

import {
    Check,
    CreditCard,
    Calendar,
    XCircle,
    Loader2,
    Crown
} from "lucide-react";
import { SubscriptionInterface, SubscriptionPlanInterface } from "@/types/subscription";

interface SubscriptionStatusProps {
    subscription: SubscriptionInterface;
    plans: SubscriptionPlanInterface[];
    onCancel: () => void;
    onNewSubscription: () => void;
    isCancelling: boolean;
}

const SubscriptionStatus = ({
    subscription,
    plans,
    onCancel,
    onNewSubscription,
    isCancelling
}: SubscriptionStatusProps) => {

    const plan = plans.find(p => p.id === subscription.planId) || subscription.plan;
    const isActive = subscription.status === "active";
    const endDate = new Date(subscription.endDate);
    const startDate = new Date(subscription.startDate);

    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return (
        <div className="flex flex-col gap-5">
            <div className="p-5 rounded-sm border border-white/10">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-lg">{plan?.name} Plan</h2>
                            <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm
                                ${isActive
                                        ? "bg-green-500/10 text-green-500"
                                        : "bg-red-500/10 text-red-500"
                                    }`}
                            >
                                {subscription.status}
                            </span>
                        </div>
                        <span className="text-2xl font-bold">
                            ${plan?.price}
                            <span className="text-white/40 text-sm font-normal">/mo</span>
                        </span>
                    </div>
                    {
                        plan?.popular &&
                        <span
                            className="bg-white text-black text-[10px] font-semibold px-2 py-0.5 
                            rounded-sm flex items-center gap-1"
                        >
                            <Crown size={10} /> Popular
                        </span>
                    }
                </div>

                {
                    plan?.features &&
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
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
                }
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-sm border border-white/10">
                    <CreditCard size={16} className="text-white/50" />
                    <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Card</p>
                        <p className="text-sm font-semibold">•••• {subscription.cardLastFour}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-sm border border-white/10">
                    <Calendar size={16} className="text-white/50" />
                    <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Started</p>
                        <p className="text-sm font-semibold">{formatDate(startDate)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-sm border border-white/10">
                    <Calendar size={16} className="text-white/50" />
                    <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">
                            {isActive ? "Renews" : "Ended"}
                        </p>
                        <p className="text-sm font-semibold">{formatDate(endDate)}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
                {
                    !isActive &&
                    <button
                        type="button"    
                        onClick={onNewSubscription}
                        className="px-4 py-2 flex justify-center items-center gap-2
                        bg-white text-neutral-900 rounded-sm cursor-pointer hover:opacity-80
                        disabled:cursor-not-allowed disabled:opacity-80"
                    >
                        New subscription
                    </button>
                }
                {
                    isActive &&
                    <button
                        type="button"    
                        onClick={onCancel}
                        disabled={isCancelling}
                        className="px-4 py-2 rounded-sm border border-white/10
                        text-sm flex items-center gap-2
                        cursor-pointer hover:opacity-80
                        disabled:cursor-not-allowed disabled:opacity-80"
                    >
                        {
                            isCancelling ?
                                <Loader2 size={14} className="animate-spin" /> :
                                <XCircle size={14} />
                        }
                        Cancel subscription
                    </button>
                }
            </div>
        </div>
    )
}

export default SubscriptionStatus;
