"use client"

import {
    createConversation,
    getConversationsByUserId
} from "@/actions/message.action";
import { useProfileContext } from "@/context/ProfileContext";
import { supabase } from "@/lib/supabase/client";
import { ConversationCreateInterface } from "@/types/message";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const useConversations = () => {
    const { currentProfile } = useProfileContext()
    const userId = currentProfile?.id || ""
    const queryClient = useQueryClient()
    const conversationsKey = ["conversations", userId]

    const {
        data: conversations = [],
        isLoading,
        error,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: conversationsKey,
        queryFn: () => getConversationsByUserId(userId),
        enabled: !!userId
    })

    const {
        mutateAsync: createConversationAsync,
        isPending: isCreating,
        error: createError
    } = useMutation({
        mutationKey: ["create-conversation", userId],
        mutationFn: (conversation: ConversationCreateInterface) => createConversation(conversation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: conversationsKey })
        }
    })

    useEffect(() => {
        if (!userId) return

        const channel = supabase.channel(`conversations:${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "conversations"
                },
                () => refetch()
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "messages"
                },
                () => refetch()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [
        refetch,
        userId
    ])

    return {
        conversations,
        isLoading,
        error,
        refetch,
        isRefetching,
        createConversationAsync,
        isCreating,
        createError,
        currentProfile
    }
}

export default useConversations
