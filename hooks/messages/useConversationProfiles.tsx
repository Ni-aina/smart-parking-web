"use client"

import { getProfilesForConversation } from "@/actions/message.action";
import { useProfileContext } from "@/context/ProfileContext";
import { useQuery } from "@tanstack/react-query";

const useConversationProfiles = (searchTerm: string, roleFilter = "all") => {
    const { currentProfile } = useProfileContext()
    const userId = currentProfile?.id || ""

    const {
        data: profiles = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ["conversation-profiles", userId, searchTerm, roleFilter],
        queryFn: () => getProfilesForConversation(searchTerm, roleFilter),
        enabled: !!userId
    })

    return {
        profiles,
        isLoading,
        error,
        refetch,
        currentProfile
    }
}

export default useConversationProfiles
