import { getPaymentAccount } from "@/actions/bank.action";
import { getCurrentSubscription, getSubscriptionPlans } from "@/actions/subscription.action";
import AccountSettings from "@/components/Account/AccountSettings";

const AccountPage = async () => {
    const [
        paymentAccount,
        plans, 
        currentSubscription
    ] = await Promise.all([
        getPaymentAccount(),
        getSubscriptionPlans(),
        getCurrentSubscription()
    ])

    return (
        <AccountSettings
            plans={plans}
            currentSubscription={currentSubscription}
            paymentAccount={paymentAccount}
        />
    )
}

export default AccountPage;