import useSubscriptionCheckout from "@/hooks/useSubscriptionCheckout";
import { PaymentElement } from "@stripe/react-stripe-js";

const SubmitSubscription = ({
    planId,
    amount,
    onSuccess
}: {
    planId: string,
    amount: number,
    onSuccess: () => void
}) => {
    const {
        onCheckout,
        loading,
        stripe,
        clientSecret,
        errorMessage
    } = useSubscriptionCheckout({
        planId,
        amount,
        onSuccess
    })

    return (
        <form
            onSubmit={onCheckout}
            className="flex flex-col gap-4"
        >
            {
                errorMessage &&
                <p className="text-red-500 text-sm">
                    {errorMessage}
                </p>
            }

            <PaymentElement
                options={{
                    wallets: {
                        applePay: "never",
                        googlePay: "never",
                    }
                }}
            />

            <button
                className="w-full py-3 rounded-sm bg-white text-neutral-900
                font-bold cursor-pointer hover:opacity-90 transition-opacity
                disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading || !stripe || !clientSecret}
            >
                {loading ? "Processing..." : "Pay now"}
            </button>
        </form>
    )
}

export default SubmitSubscription;
