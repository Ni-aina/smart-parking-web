import { useElements, useStripe } from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "@/context/LanguageContext";

const useSubscriptionCheckout = ({
    planId,
    amount,
    onSuccess
}: {
    planId: string,
    amount: number,
    onSuccess: () => void
}) => {

    const { t } = useTranslation();
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [clientSecret, setClientSecret] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const onCheckout = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            setLoading(false);
            return;
        }

        const { error: submitError } = await elements.submit();

        if (submitError) {
            setErrorMessage(submitError.message || "Error submit element");
            setLoading(false);
            return;
        }

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            clientSecret,
            redirect: "if_required",
            confirmParams: {
                return_url: window.location.href
            }
        })

        if (error) {
            setErrorMessage(error.message || "Error payment processing");
            setLoading(false);
            return;
        }

        if (paymentIntent.status === "succeeded") {
            onSuccess();
            toast.success(t("accountSettings.messages.subscriptionUpdatedSuccessfully"));
            setLoading(false);
            return;
        }
    }

    useEffect(() => {
        setLoading(true);

        fetch("/api/public/subscription/update-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                planId,
                amount: amount * 100
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setErrorMessage(data.error);
                } else {
                    setClientSecret(data.clientSecret);
                }
            })
            .catch(err => setErrorMessage(err.message || "Failed to create payment intent"))
            .finally(() => setLoading(false))
    }, [
        planId,
        amount
    ])

    return {
        stripe,
        loading,
        clientSecret,
        errorMessage,
        onCheckout
    }
}

export default useSubscriptionCheckout;
