import { getSubscriptionPlans } from "@/actions/subscription.action";
import SignUpPage from "@/components/Sign-up/SignUpPage";

const signUpRouter = async () => {
    const plans = await getSubscriptionPlans();

    return (
        <SignUpPage
            plans={plans}
        />
    )
}
 
export default signUpRouter;