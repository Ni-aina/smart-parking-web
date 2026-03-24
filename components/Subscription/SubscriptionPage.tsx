"use client";

import {
    Check,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Sparkles
} from "lucide-react";
import useSubscription from "@/hooks/useSubscription";
import StepCard from "./StepCard";
import SubscriptionStatus from "./SubscriptionStatus";
import {
    SubscriptionPlanInterface,
    SubscriptionInterface
} from "@/types/subscription";
import { useState } from "react";
import DeleteConfirm from "../ui/deleteConfirm";
import StepPlan from "./StepPlan";
import { revalidateAuthSubscription } from "@/actions/subscription.action";

interface SubscriptionPageProps {
    plans: SubscriptionPlanInterface[];
    currentSubscription: SubscriptionInterface | null;
}

const steps = ["Plan", "Payment"];

const SubscriptionPage = ({
    plans,
    currentSubscription
}: SubscriptionPageProps) => {
    const {
        step,
        selectedPlan,
        setSelectedPlan,
        activePlan,
        isCancelling,
        handleNext,
        handleBack,
        handleCancel,
        handleNewSubscription,
        handleSubscriptionComplete
    } = useSubscription(plans, currentSubscription);

    const [isConfirmCancel, setIsConfirmCancel] = useState<boolean>(false);

    const showStatus = step === -1 && currentSubscription;
    const showStepper = step >= 0;

    const handleSetConfirm = () => {
        setIsConfirmCancel(true);
    }

    const handleConfirm = () => {
        setIsConfirmCancel(false);
        handleCancel();
    }

    const handlePaymentSuccess = async () => {
        await revalidateAuthSubscription();
        handleSubscriptionComplete();
    }

    return (
        <>
            {
                showStatus && currentSubscription &&
                <SubscriptionStatus
                    subscription={currentSubscription}
                    plans={plans}
                    onCancel={handleSetConfirm}
                    onNewSubscription={handleNewSubscription}
                    isCancelling={isCancelling}
                />
            }

            {
                !showStatus && !showStepper &&
                <div className="flex flex-col items-center gap-4 py-10">
                    <Sparkles size={32} className="text-white/30" />
                    <div className="text-center">
                        <h2 className="text-lg font-semibold">No active subscription</h2>
                        <p className="text-sm text-white/40 mt-1">
                            Choose a plan to get started
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleNewSubscription}
                        className="px-4 py-2 flex justify-center items-center gap-2
                        bg-white text-neutral-900 rounded-sm cursor-pointer hover:opacity-80
                        disabled:cursor-not-allowed disabled:opacity-80"
                    >
                        <CreditCard size={16} />
                        Choose a plan
                    </button>
                </div>
            }

            {
                showStepper &&
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        {
                            steps.map((label, i) => (
                                <div key={label} className="flex items-center gap-2">
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center 
                                    text-xs font-semibold transition-colors ${i <= step
                                                ? "bg-white text-black"
                                                : "border border-white/30 text-white/30"
                                            }`}
                                    >
                                        {
                                            i < step ?
                                                <Check size={12} /> :
                                                i + 1
                                        }
                                    </div>
                                    <span
                                        className={`text-xs ${i <= step ? "text-white" : "text-white/30"}`}
                                    >
                                        {label}
                                    </span>
                                    {
                                        i < steps.length - 1 &&
                                        <div
                                            className={`w-8 h-px ${i < step ? "bg-white" : "bg-white/20"}`}
                                        />
                                    }
                                </div>
                            ))}
                    </div>

                    {
                        step === 0 &&
                        <StepPlan
                            plans={plans}
                            selectedPlan={selectedPlan}
                            setSelectedPlan={setSelectedPlan}
                        />
                    }

                    {
                        step === 1 && activePlan &&
                        <StepCard
                            activePlan={activePlan}
                            onSuccess={handlePaymentSuccess}
                        />
                    }

                    <div className="flex justify-between items-center mt-2">
                        {
                            step > 0 ?
                                <button
                                    type="button"    
                                    onClick={handleBack}
                                    className="flex items-center gap-1 text-sm 
                                    cursor-pointer hover:opacity-80"
                                >
                                    <ChevronLeft size={16} /> Back
                                </button>
                                :
                                currentSubscription ?
                                    <button
                                        type="button"    
                                        onClick={() => handleBack()}
                                        className="flex items-center gap-1 text-sm 
                                        cursor-pointer hover:opacity-80"
                                    >
                                        <ChevronLeft size={16} /> Back to status
                                    </button>
                                    :
                                    <div />
                        }
                        {
                            step < 1 &&
                            <button
                                type="button"    
                                onClick={handleNext}
                                className="flex items-center gap-2 bg-white text-black 
                                px-4 py-2 rounded-sm text-sm font-semibold
                                cursor-pointer hover:opacity-80"
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        }
                    </div>
                </div>
            }

            <DeleteConfirm
                handleConfirm={handleConfirm}
                handleCancel={() => setIsConfirmCancel(false)}
                isOpen={isConfirmCancel}
            />
        </>
    )
}

export default SubscriptionPage;
