"use client"

import {
    markConversationMessagesAsRead,
    revalidateConversationsByUser,
    revalidateMessagesByConversation,
    sendMessage
} from "@/actions/message.action";
import { useProfileContext } from "@/context/ProfileContext";
import { supabase } from "@/lib/supabase/client";
import { ConversationInterface, MessageCreateInterface, MessageInterface } from "@/types/message";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

const useMessages = (conversation: ConversationInterface, messages: MessageInterface[]) => {
    const { currentProfile } = useProfileContext()
    const userId = currentProfile?.id || ""

    const {
        mutateAsync: handleSendAsync,
        isPending: isSending,
        error: sendError
    } = useMutation({
        mutationKey: ["send-message", conversation.id],
        mutationFn: (message: MessageCreateInterface) => sendMessage(message),
        onSuccess: async () => {
            await revalidateMessagesByConversation(String(conversation.id))
        }
    })

    useEffect(() => {
        if (!conversation.id || !userId) return
        markConversationMessagesAsRead(String(conversation.id), userId).catch(() => null)
    }, [
        conversation.id,
        messages.length,
        userId
    ])

    useEffect(() => {
        if (!conversation.id) return

        const channelName = `messages:${conversation.id}`
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
                    filter: `conversation_id=eq.${conversation.id}`
                },
                async () => await revalidateMessagesByConversation(String(conversation.id))
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "conversations",
                    filter: `id=eq.${conversation.id}`
                },
                async () => await revalidateConversationsByUser()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(messagesChannel)
        }
    }, [
        conversation.id
    ])

    return {
        conversation,
        messages,
        handleSendAsync,
        isSending,
        sendError,
        currentProfile
    }
}

export default useMessages;
