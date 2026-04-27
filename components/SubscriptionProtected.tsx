"use client";

import { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { SubscriptionInterface } from "@/types/subscription";

const SubscriptionProtected = ({
    children,
    currentSubscription
}: {
    children: ReactNode,
    currentSubscription: SubscriptionInterface | null
}) => {

    const { status } = currentSubscription!;

    if (status !== "active") return (
        <div className="flex flex-col justify-center items-center gap-4 w-full h-full text-white/80">
            <Sparkles size={32} className="text-white/30" />
            <div className="text-center">
                <h2 className="text-lg font-semibold">
                    {
                        status === "expired" ?
                            "Your subscription has expired" :
                            "No active subscription"
                    }
                </h2>
                <p className="text-sm text-white/40 mt-1">
                    Manage your subscription to continue
                </p>
            </div>
            <Link
                href="/owner/settings/account"
                className="px-4 py-2 flex justify-center items-center gap-2
                bg-white text-neutral-900 rounded-sm hover:opacity-80"
            >
                <Sparkles size={16} />
                Go to subscription
            </Link>
        </div>
    )

    return (
        <>
            {
                children
            }
        </>
    )
}

export default SubscriptionProtected;
