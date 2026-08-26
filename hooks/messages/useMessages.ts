"use client"

import {
    getMessagesByConversationId,
    markConversationMessagesAsRead,
    revalidateConversationsByUser,
    sendMessage
} from "@/actions/message.action";
import { useProfileContext } from "@/context/ProfileContext";
import { supabase } from "@/lib/supabase/client";
import {
    ConversationInterface,
    MessageCreateInterface,
    MessageInterface,
    PaginatedMessagesInterface
} from "@/types/message";
import { normalizeMessage } from "@/utils/messages/messageHelpers";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useMessages = (conversation: ConversationInterface, initialData: PaginatedMessagesInterface) => {
    const { currentProfile } = useProfileContext()
    const [messages, setMessages] = useState<MessageInterface[]>(initialData?.messages || [])
    const [hasMore, setHasMore] = useState<boolean>(initialData?.hasMore || false)
    const [page, setPage] = useState<number>(1)
    const [isLoadingOlder, setIsLoadingOlder] = useState<boolean>(false)

    useEffect(() => {
        setMessages(initialData?.messages || [])
        setHasMore(initialData?.hasMore || false)
        setPage(1)
    }, [
        conversation.id,
        initialData
    ])

    const {
        mutateAsync: handleSendAsync,
        isPending: isSending,
        error: sendError
    } = useMutation({
        mutationKey: ["send-message", conversation.id],
        mutationFn: (message: MessageCreateInterface) => sendMessage(message),
        onSuccess: (newMessage: MessageInterface) => {
            setMessages(prev => prev.some(m => m.id === newMessage.id) ? prev : [...prev, newMessage])
        }
    })

    const loadOlderMessages = async () => {
        if (isLoadingOlder || !hasMore || !conversation.id) return
        setIsLoadingOlder(true)
        try {
            const nextPage = page + 1
            const res = await getMessagesByConversationId(String(conversation.id), nextPage, 20)
            setMessages(prev => {
                const existingIds = new Set(prev.map(m => m.id))
                const older = res.messages.filter(m => !existingIds.has(m.id))
                return [...older, ...prev]
            })
            setHasMore(res.hasMore)
            setPage(nextPage)
        } catch {
        } finally {
            setIsLoadingOlder(false)
        }
    }

    useEffect(() => {
        if (!conversation.id) return
        markConversationMessagesAsRead(String(conversation.id)).catch(() => null)
    }, [
        conversation.id,
        messages.length
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
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversation.id}`
                },
                (payload) => {
                    const normalized = normalizeMessage(payload.new)
                    setMessages(prev => prev.some(m => m.id === normalized.id) ? prev : [...prev, normalized])
                    revalidateConversationsByUser().catch(() => null)
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversation.id}`
                },
                (payload) => {
                    const normalized = normalizeMessage(payload.new)
                    setMessages(prev => prev.map(m => m.id === normalized.id ? { ...m, ...normalized } : m))
                    revalidateConversationsByUser().catch(() => null)
                }
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
        hasMore,
        isLoadingOlder,
        loadOlderMessages,
        handleSendAsync,
        isSending,
        sendError,
        currentProfile
    }
}

export default useMessages
