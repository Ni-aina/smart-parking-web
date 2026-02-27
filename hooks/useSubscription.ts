"use client";

import {
    useActionState,
    useEffect,
    useState,
    useTransition
} from "react";
import { toast } from "sonner";
import { subscribe, cancelSubscription } from "@/actions/subscription.action";
import {
    SubscriptionPlanInterface,
    SubscriptionInterface,
    SubscriptionStateInterface
} from "@/types/subscription";
import { validateCardNumber, validateExpiredDate } from "@/utils/checkBankInfo";

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

    const [cardForm, setCardForm] = useState({
        cardNumber: "",
        expiredDate: ""
    })

    const [isSubscribing, startSubscribing] = useTransition();
    const [isCancelling, startCancelling] = useTransition();

    const [subscribeState, subscribeAction] = useActionState(subscribe, initialState);
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

    const handleSubscribe = () => {
        const cleanCard = cardForm.cardNumber.replace(/\s/g, "");

        if (!cleanCard || !cardForm.expiredDate) {
            toast.error("All card fields are required");
            return;
        }

        if (!validateCardNumber(cleanCard)) {
            toast.error("Invalid card number");
            return;
        }

        if (!validateExpiredDate(cardForm.expiredDate)) {
            toast.error("Card is expired or invalid date");
            return;
        }

        startSubscribing(() => {
            subscribeAction({
                planId: selectedPlan,
                cardNumber: cardForm.cardNumber,
                expiredDate: cardForm.expiredDate
            })
        })
    }

    const handleCancel = () => {
        startCancelling(() => {
            cancelAction();
        })
    }

    const handleNewSubscription = () => setStep(0);

    useEffect(() => {
        if (subscribeState.success) {
            toast.success(subscribeState.success);
            setStep(-1);
            setCardForm({ cardNumber: "", expiredDate: "" });
        }
        if (subscribeState.error) {
            toast.error(subscribeState.error);
        }
    }, [subscribeState])

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
        cardForm,
        setCardForm,
        activePlan,
        isSubscribing,
        isCancelling,
        subscribeState,
        cancelState,
        handleNext,
        handleBack,
        handleSubscribe,
        handleCancel,
        handleNewSubscription
    }
}

export default useSubscription;
