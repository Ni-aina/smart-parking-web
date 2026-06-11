"use client";

import { SubscriptionPlanInterface } from "@/types/subscription";
import ComingSoon from "../Subscription/ComingSoon";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "@/lib/stripe/client";
import SubmitPayment from "./SubmitPayment";
import { useState } from "react";
import { Modal } from "../ui/modal";
import { SignUpForm } from "@/types/auth";
import { useTranslation } from "@/context/LanguageContext";

interface StepPaymentProps {
    plan: SubscriptionPlanInterface
    form: SignUpForm
}

const StepPayment = ({
    plan,
    form
}: StepPaymentProps) => {
    const [showStripeElement, setShowStripeElement] = useState<boolean>(false)
    const { t } = useTranslation()

    const handleShowStripeElement = () => {
        setShowStripeElement(prev => !prev)
    }

    const {
        id: planId,
        name,
        price,
        isActive
    } = plan

    if (!isActive) return (
        <ComingSoon
            name={name}
            price={price}
        />
    )

    return (
        <>
            <div className="mt-3 flex flex-col gap-4">
                <div className="p-4 rounded-sm border border-white/20">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="font-semibold text-sm">
                                {name} {t("payment.planSuffix")}
                            </h2>
                            <p className="text-xs text-white/40 mt-1">
                                {
                                    t("payment.billedMonthly")
                                }
                            </p>
                        </div>
                        <span className="text-lg font-semibold">
                            ${price}
                            <span className="text-white/40 text-xs font-normal">
                                {
                                    t("payment.mo")
                                }
                            </span>
                        </span>
                    </div>
                </div>
                <button
                    className="w-full py-3 rounded-sm bg-blue-950 text-white font-bold flex items-center justify-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={handleShowStripeElement}
                >
                    <span>
                        {
                            t("payment.payWith")
                        }
                    </span>
                    <span className="italic font-semibold">Stripe</span>
                </button>
                <p className="text-[10px] text-white/30 text-center">
                    {
                        t("payment.poweredBy")
                    }
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
                        <SubmitPayment
                            planId={planId}
                            amount={price}
                            form={form}
                            handleShowStripeElement={handleShowStripeElement}
                        />
                    </Elements>
                </div>
            </Modal>
        </>
    )
}

export default StepPayment
