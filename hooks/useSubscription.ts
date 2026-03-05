"use client";

import {
    useActionState,
    useEffect,
    useState,
    useTransition
} from "react";
import { toast } from "sonner";
import { cancelSubscription } from "@/actions/subscription.action";
import {
    SubscriptionPlanInterface,
    SubscriptionInterface,
    SubscriptionStateInterface
} from "@/types/subscription";

const initialState: SubscriptionStateInterface = {
    error: null,
    success: null
}

const useSubscription = (
    plans: SubscriptionPlanInterface[],
    currentSubscription: SubscriptionInterface | null
) => {
    const [step, setStep] = useState(currentSubscription ? -1 : 0);
    const [selectedPlan, setSelectedPlan] = useState(
        currentSubscription?.planId || plans.find(p => p.popular)?.id || plans[0]?.id || ""
    )

    const [isCancelling, startCancelling] = useTransition();

    const [cancelState, cancelAction] = useActionState(cancelSubscription, initialState);

    const activePlan = plans.find(p => p.id === selectedPlan);

    const handleNext = () => {
        if (step === 0 && !selectedPlan) {
            toast.error("Please select a plan");
            return;
        }
        setStep(prev => prev + 1);
    }

    const handleBack = () => setStep(prev => prev - 1);

    const handleCancel = () => {
        startCancelling(() => {
            cancelAction();
        })
    }

    const handleNewSubscription = () => setStep(0);

    const handleSubscriptionComplete = () => setStep(-1);

    useEffect(() => {
        if (cancelState.success) {
            toast.success(cancelState.success);
        }
        if (cancelState.error) {
            toast.error(cancelState.error);
        }
    }, [cancelState])

    return {
        step,
        selectedPlan,
        setSelectedPlan,
        activePlan,
        isCancelling,
        cancelState,
        handleNext,
        handleBack,
        handleCancel,
        handleNewSubscription,
        handleSubscriptionComplete
    }
}

export default useSubscription;
