import useCheckoutStripe from "@/hooks/useCheckoutStripe";
import { SignUpForm } from "@/types/auth";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useTranslation } from "@/context/LanguageContext";

const SubmitPayment = ({
    planId,
    amount,
    form,
    handleShowStripeElement
}: {
    planId: string
    amount: number
    form: SignUpForm
    handleShowStripeElement: () => void
}) => {
    const {
        onCheckoutStripe,
        loading,
        stripe,
        clientSecret,
        errorMessage
    } = useCheckoutStripe({
        planId,
        amount,
        form,
        handleShowStripeElement
    })
    const { t } = useTranslation()

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
                        googlePay: "never"
                    }
                }}
            />

            <button
                className="w-full py-3 rounded-sm bg-white text-neutral-900 font-bold 
                cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading || !stripe || !clientSecret}
            >
                {
                    loading ? t("payment.processing") : t("payment.payNow")
                }
            </button>
        </form>
    )
}

export default SubmitPayment