"use client";

import { SubscriptionPlanInterface } from "@/types/subscription";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "@/lib/stripe/client";
import SubmitSubscription from "./SubmitSubscription";
import { useState } from "react";
import { Modal } from "../ui/modal";
import ComingSoon from "./ComingSoon";
import { useTranslation } from "@/context/LanguageContext";

interface StepCardProps {
    activePlan: SubscriptionPlanInterface;
    onSuccess: () => void;
}

const StepCard = ({
    activePlan,
    onSuccess
}: StepCardProps) => {
    const { t } = useTranslation();
    const [showStripeElement, setShowStripeElement] = useState<boolean>(false);

    const handleShowStripeElement = () => {
        setShowStripeElement(prev => !prev);
    }

    const handleSuccess = () => {
        handleShowStripeElement();
        onSuccess();
    }

    const {
        id: planId,
        name,
        price,
        isActive
    } = activePlan;

    if (!isActive) return (
        <ComingSoon
            name={name}
            price={price}
        />
    )

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="p-4 rounded-sm border border-white/10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="font-semibold text-sm">
                                {name}{t("payment.planSuffix")}
                            </h2>
                            <p className="text-xs text-white/40 mt-1">
                                {t("payment.billedMonthly")}
                            </p>
                        </div>
                        <span className="text-lg font-semibold">
                            ${price}
                            <span className="text-white/40 text-xs font-normal">
                                {t("payment.mo")}
                            </span>
                        </span>
                    </div>
                </div>
                <button
                    className="w-full py-3 rounded-sm bg-blue-950 text-white 
                    font-bold flex items-center justify-center gap-1 
                    cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={handleShowStripeElement}
                >
                    <span>{t("payment.payWith")}</span>
                    <span className="italic font-semibold">Stripe</span>
                </button>
                <p className="text-[10px] text-white/30 text-center">
                    {t("payment.poweredBy")}
                </p>
            </div>
            <Modal
                isOpen={showStripeElement}
                onClose={handleShowStripeElement}
                title={t("payment.title")}
            >
                <div className="max-h-[60dvh] overflow-x-hidden overflow-y-scroll">
                    <Elements
                        stripe={stripePromise}
                        options={{
                            mode: "payment",
                            currency: "usd",
                            amount: price * 100,
                            payment_method_types: ["card"],
                            appearance: {
                                theme: "night"
                            }
                        }}
                    >
                        <SubmitSubscription
                            planId={planId}
                            amount={price}
                            onSuccess={handleSuccess}
                        />
                    </Elements>
                </div>
            </Modal>
        </>
    )
}

export default StepCard;
