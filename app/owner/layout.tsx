import { getCurrentProfile } from "@/actions/profile.action";
import { getCurrentSubscription } from "@/actions/subscription.action";
import OwnerLayoutClient from "@/components/Layouts/OwnerLayoutClient";
import ProfileContextProvider from "@/context/ProfileContext";

const OwnerLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const [
        currentProfile,
        currentSubscription
    ] = await Promise.all([
        getCurrentProfile(),
        getCurrentSubscription()
    ])

    return (
        <ProfileContextProvider
            currentProfile={currentProfile}
        >
            <OwnerLayoutClient
                currentSubscription={currentSubscription}
            >
                {children}
            </OwnerLayoutClient>
        </ProfileContextProvider>
    )
}

export default OwnerLayout;