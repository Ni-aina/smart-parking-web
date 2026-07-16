"use client"

import { createConversation, revalidateConversationsByUser } from "@/actions/message.action";
import { useProfileContext } from "@/context/ProfileContext";
import { supabase } from "@/lib/supabase/client";
import { ConversationCreateInterface } from "@/types/message";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

const useConversations = () => {
    const { currentProfile } = useProfileContext()
    const userId = currentProfile?.id || ""

    const {
        mutateAsync: createConversationAsync,
        isPending: isCreating,
        error: createError
    } = useMutation({
        mutationKey: ["create-conversation", userId],
        mutationFn: (conversation: ConversationCreateInterface) => createConversation(conversation),
        onSuccess: async () => {
            await revalidateConversationsByUser()
        }
    })

    useEffect(() => {
        if (!userId) return;

        const channel = supabase.channel(`conversations:${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "conversations"
                },
                async () => await revalidateConversationsByUser()
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "messages"
                },
                async () => await revalidateConversationsByUser()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId])

    return {
        createConversationAsync,
        isCreating,
        createError,
        currentProfile
    }
}

export default useConversations
