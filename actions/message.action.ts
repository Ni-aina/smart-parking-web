"use server"

import {
    ConversationCreateInterface,
    ConversationInterface,
    MessageCreateInterface,
    MessageInterface
} from "@/types/message";
import { ProfileInterface } from "@/types/profile";
import { isUUID } from "@/utils/isUUID";
import { denormalizeData, normalizeData } from "@/utils/normalizeData";
import { getServerAuth } from "./authServer.action";
import {
    cleanSearchTerm,
    normalizeConversation,
    normalizeMessage,
    QueryRecord,
    selectConversationFields,
    withTimeout
} from "../utils/messages/messageHelpers";
import { revalidatePath } from "next/cache";

export const revalidateConversationsByUser = async () => {
    revalidatePath("/owner/messages");
}
export const revalidateMessagesByConversation = async (conversationId: string) => {
    revalidatePath(`/owner/messages/${conversationId}`);
}

export const getConversationsByUser = async (): Promise<ConversationInterface[]> => {
    const request = (async () => {
        const { supabase, userId } = await getServerAuth()
        const { data: conversations, error } = await supabase
            .from("conversations")
            .select(selectConversationFields)
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order("created_at", { ascending: false })

        if (!conversations || error) throw new Error(`Conversations fetching error, ${error?.message}`)

        const rawConversations = conversations as QueryRecord[]
        const conversationIds = rawConversations.map(item => item.id)
        const { data: messages, error: messageError } = conversationIds.length
            ? await supabase
                .from("messages")
                .select("id,conversation_id,sender_id,content,content_type,attachement_url,is_read,created_at,updated_at")
                .in("conversation_id", conversationIds)
                .order("created_at", { ascending: false })
            : { data: [], error: null }

        if (messageError) throw new Error(`Messages fetching error, ${messageError.message}`)

        const lastMessages = ((messages ?? []) as QueryRecord[]).reduce((
            acc: Record<number, MessageInterface>,
            item
        ) => {
            const normalized = normalizeMessage(item)
            if (!acc[normalized.conversationId]) acc[normalized.conversationId] = normalized
            return acc
        }, {})

        return rawConversations
            .map(item => {
                const normalized = normalizeConversation(item)
                return {
                    ...normalized,
                    lastMessage: lastMessages[normalized.id]
                }
            })
            .sort((a, b) => {
                const aTime = a.lastMessage?.createdAt ?? a.createdAt
                const bTime = b.lastMessage?.createdAt ?? b.createdAt
                return new Date(bTime).getTime() - new Date(aTime).getTime()
            })
    })()

    return withTimeout(request)
}

export const getConversationById = async (conversationId: string): Promise<ConversationInterface> => {
    if (!conversationId) throw new Error("Conversation id is required")

    const request = (async () => {
        const { supabase } = await getServerAuth()
        const { data: conversation, error } = await supabase
            .from("conversations")
            .select(selectConversationFields)
            .eq("id", conversationId)
            .single()

        if (!conversation || error) throw new Error(`Conversation fetching error, ${error?.message}`)
        return normalizeConversation(conversation)
    })()

    return withTimeout(request)
}

export const createConversation = async (conversation: ConversationCreateInterface): Promise<ConversationInterface> => {
    const { senderId, receiverId } = conversation
    if (!isUUID(senderId) || !isUUID(receiverId)) throw new Error("Invalid user")
    if (senderId === receiverId) throw new Error("You cannot create a conversation with yourself")

    const request = (async () => {
        const { supabase } = await getServerAuth()
        const { data: existingConversation, error: existingError } = await supabase
            .from("conversations")
            .select(selectConversationFields)
            .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
            .maybeSingle()

        if (existingError) throw new Error(`Conversation lookup error, ${existingError.message}`)
        if (existingConversation) return normalizeConversation(existingConversation)

        const { data: newConversation, error } = await supabase
            .from("conversations")
            .insert([denormalizeData(conversation)])
            .select(selectConversationFields)
            .single()

        if (!newConversation || error) throw new Error(`Conversation creation error, ${error?.message}`)
        return normalizeConversation(newConversation)
    })()

    return withTimeout(request)
}

export const getMessagesByConversationId = async (conversationId: string): Promise<MessageInterface[]> => {
    if (!conversationId) throw new Error("Conversation id is required")

    const request = (async () => {
        const { supabase } = await getServerAuth()
        const { data: messages, error } = await supabase
            .from("messages")
            .select("*, sender: sender_id(*)")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true })

        if (!messages || error) throw new Error(`Messages fetching error, ${error?.message}`)
        return (messages as QueryRecord[]).map(item => normalizeMessage(item))
    })()

    return withTimeout(request)
}

export const sendMessage = async (message: MessageCreateInterface): Promise<MessageInterface> => {
    const payload = denormalizeData({
        ...message,
        contentType: message.contentType ?? "text"
    })

    const request = (async () => {
        const { supabase } = await getServerAuth()
        const { data: newMessage, error } = await supabase
            .from("messages")
            .insert([payload])
            .select("*, sender: sender_id(*)")
            .single()

        if (!newMessage || error) throw new Error(`Message sending error, ${error?.message}`)
        return normalizeMessage(newMessage)
    })()

    return withTimeout(request)
}

export const markConversationMessagesAsRead = async (conversationId: string): Promise<boolean> => {
    if (!conversationId) return false

    const request = (async () => {
        const { supabase, userId } = await getServerAuth()
        const { error } = await supabase
            .from("messages")
            .update({ is_read: true })
            .eq("is_read", false)
            .eq("conversation_id", conversationId)
            .neq("sender_id", userId)

        if (error) throw new Error(`Mark messages as read error, ${error.message}`)
        return true
    })()

    return withTimeout(request)
}

export const getProfilesForConversation = async (searchTerm = "", roleFilter = "all"): Promise<ProfileInterface[]> => {

    const request = (async () => {
        const { supabase, userId: currentUserId } = await getServerAuth()
        const term = cleanSearchTerm(searchTerm)
        let query = supabase
            .from("profiles")
            .select("*")
            .neq("id", currentUserId)
            .order("full_name", { ascending: true })
            .limit(30)

        if (term) query = query.or(`full_name.ilike.%${term}%,email_address.ilike.%${term}%`)
        if (["owner", "driver", "agent"].includes(roleFilter)) query = query.contains("roles", [roleFilter])

        const { data: profiles, error } = await query

        if (!profiles || error) throw new Error(`Profiles fetching error, ${error?.message}`)
        return (profiles as QueryRecord[]).map(item => normalizeData(item) as ProfileInterface)
    })()

    return withTimeout(request)
}
