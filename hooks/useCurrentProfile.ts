"use client";

import { getCurrentProfile } from "@/actions/profile.action";
import { useAuthContext } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";

const useCurrentProfile = () => {
    const { user } = useAuthContext();

    const { data: currentProfile, isPending } = useQuery({
        queryKey: ["current-profile"],
        queryFn: () => getCurrentProfile(user)
    })

    return {
        currentProfile,
        isPending
    }
}

export default useCurrentProfile;