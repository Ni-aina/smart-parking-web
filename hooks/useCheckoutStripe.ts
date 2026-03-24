import { SignUpForm } from "@/types/auth";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const useCheckoutStripe = ({
    planId,
    amount,
    form,
    handleShowStripeElement
}: {
    planId: string,
    amount: number,
    form: SignUpForm,
    handleShowStripeElement: () => void
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [clientSecret, setClientSecret] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const onCheckoutStripe = async (e: FormEvent<HTMLFormElement>) => {
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
            handleShowStripeElement();
            toast.success("Check your inbox to activate your account.");
            setLoading(false);
            return;
        }
    }

    useEffect(() => {
        setLoading(true);

        const {
            name,
            email,
            phone,
            password
        } = form;

        fetch("/api/subscription/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                planId,
                amount: amount * 100,
                name,
                email,
                phone,
                password
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
        amount,
        form
    ])

    return {
        stripe,
        loading,
        clientSecret,
        errorMessage,
        onCheckoutStripe
    }
}

export default useCheckoutStripe;