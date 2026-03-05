import { getCurrentSubscription } from "@/actions/subscription.action";
import OwnerLayoutClient from "@/components/Layouts/OwnerLayoutClient";

const OwnerLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const currentSubscription = await getCurrentSubscription();

    return (
        <OwnerLayoutClient
            currentSubscription={currentSubscription}
        >
            {children}
        </OwnerLayoutClient>
    )
}

export default OwnerLayout;