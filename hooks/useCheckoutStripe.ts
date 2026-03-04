import { useElements, useStripe } from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";

const useCheckoutStripe = ({ 
    amount,
    handleShowStripeElement
 }: { 
    amount: number,
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
            setLoading(false);
            return;
        }
    }

    useEffect(() => {
        setLoading(true);
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount: amount * 100 })
        })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret))
            .catch(err => setErrorMessage(err.message || "Error creating payment intent"))
            .finally(() => setLoading(false))
    }, [amount])

    return {
        stripe,
        loading,
        clientSecret,
        errorMessage,
        onCheckoutStripe
    }
}

export default useCheckoutStripe;