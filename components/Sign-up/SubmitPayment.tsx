import useCheckoutStripe from "@/hooks/useCheckoutStripe";
import { PaymentElement } from "@stripe/react-stripe-js";

const SubmitPayment = ({ 
    amount,
    handleShowStripeElement
}: { 
    amount: number,
    handleShowStripeElement: () => void
}) => {
    const { 
        onCheckoutStripe,
        loading,
        stripe,
        clientSecret,
        errorMessage
    } = useCheckoutStripe({ 
        amount,
        handleShowStripeElement
    })

    return ( 
        <form 
            onSubmit={onCheckoutStripe}
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
                className="w-full py-3 rounded-sm bg-blue-950 text-white
                font-bold cursor-pointer hover:opacity-90 transition-opacity
                disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading || !stripe || !clientSecret}
            >
                {loading ? "Processing..." : "Pay now"}
            </button>
        </form>
    )
}
 
export default SubmitPayment;