import { getNoReadCountByUser } from "@/actions/message.action";
import { useProfileContext } from "@/context/ProfileContext";
import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const useNotReadCount = () => {
    const { currentProfile } = useProfileContext();
    const userId = currentProfile?.id || "";

    const {
        data: isNotReadCount,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ["not-read-count"],
        queryFn: () => getNoReadCountByUser()
    })

    useEffect(() => {
        if (!userId) return;

        const channelName = `messages:${userId}`;
        const existingChannel = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`);
        if (existingChannel) {
            supabase.removeChannel(existingChannel);
        }

        const messagesChannel = supabase.channel(channelName)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages"
                },
                () => refetch()
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "messages"
                },
                () => refetch()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(messagesChannel);
        }
    }, [
        userId,
        refetch,
    ])

    return {
        isNotReadCount,
        isLoading
    }
}

export default useNotReadCount;