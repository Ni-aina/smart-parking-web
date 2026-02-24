import { getPaymentAccount } from "@/actions/bank.action";
import AccountSettings from "@/components/Account/AccountSettings";

const AccountPage = async () => {
    const paymentAccount = await getPaymentAccount();

    return (
        <AccountSettings
            paymentAccount={paymentAccount}
        />
    )
}

export default AccountPage;