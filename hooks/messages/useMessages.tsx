"use client"

import {
    getConversationById,
    getMessagesByConversationId,
    markConversationMessagesAsRead,
    sendMessage
} from "@/actions/message.action";
import { useProfileContext } from "@/context/ProfileContext";
import { supabase } from "@/lib/supabase/client";
import { MessageCreateInterface } from "@/types/message";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const useMessages = (conversationId: string) => {
    const { currentProfile } = useProfileContext()
    const userId = currentProfile?.id || ""
    const queryClient = useQueryClient()
    const messagesKey = ["messages", conversationId]
    const conversationKey = ["conversation", conversationId]

    const {
        data: conversation,
        isLoading: isConversationLoading,
        error: conversationError,
        refetch: refetchConversation
    } = useQuery({
        queryKey: conversationKey,
        queryFn: () => getConversationById(conversationId),
        enabled: !!conversationId
    })

    const {
        data: messages = [],
        isLoading,
        error,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: messagesKey,
        queryFn: () => getMessagesByConversationId(conversationId),
        enabled: !!conversationId
    })

    const {
        mutateAsync: handleSendAsync,
        isPending: isSending,
        error: sendError
    } = useMutation({
        mutationKey: ["send-message", conversationId],
        mutationFn: (message: MessageCreateInterface) => sendMessage(message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: messagesKey })
            queryClient.invalidateQueries({ queryKey: ["conversations"] })
        }
    })

    useEffect(() => {
        if (!conversationId || !userId) return
        markConversationMessagesAsRead(conversationId, userId).catch(() => null)
    }, [
        conversationId,
        messages.length,
        userId
    ])

    useEffect(() => {
        if (!conversationId) return

        const channelName = `messages:${conversationId}`
        const existingChannel = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`)
        if (existingChannel) {
            supabase.removeChannel(existingChannel)
        }

        const messagesChannel = supabase.channel(channelName)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`
                },
                () => refetch()
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "conversations",
                    filter: `id=eq.${conversationId}`
                },
                () => refetchConversation()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(messagesChannel)
        }
    }, [
        conversationId,
        refetch,
        refetchConversation
    ])

    return {
        conversation,
        messages,
        isLoading: isLoading || isConversationLoading,
        error: error || conversationError,
        refetch,
        isRefetching,
        handleSendAsync,
        isSending,
        sendError,
        currentProfile
    }
}

export default useMessages
