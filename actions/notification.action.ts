import { PushNotificationPayload, PushTokenInterface } from "@/types/notification";
import { normalizeData } from "@/utils/normalizeData";
import { getServerAuth } from "./authServer.action";
import { isUUID } from "@/utils/isUUID";
import { rejectTimeout } from "@/utils/rejectTimeout";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

export const getPushTokensByUserId = async (
    userId: string,
    push_messages: boolean,
    push_updates: boolean
): Promise<PushTokenInterface[]> => {
    try {
        if (!isUUID(userId)) return []

        const request = (async () => {
            const { supabase } = await getServerAuth()

            const query = supabase
                .from("user_push_tokens")
                .select("*")
                .eq("user_id", userId)

            if (push_messages) query.eq("enabled_messages", true)

            if (push_updates) query.eq("enabled_updates", true)

            const { data, error } = await query;

            if (error) throw new Error(error.message);
            return (data || []).map((item: any) => normalizeData(item) as PushTokenInterface);
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export const sendExpoPushNotification = async (
    payload: PushNotificationPayload | PushNotificationPayload[]
): Promise<boolean> => {
    try {
        const response = await fetch(EXPO_PUSH_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })

        return response.ok;
    } catch {
        return false;
    }
}

export const sendMessagePushNotification = async ({
    recipientId,
    senderName,
    messageContent,
    conversationId
}: {
    recipientId: string;
    senderName: string;
    messageContent: string;
    conversationId: number;
}): Promise<boolean> => {
    try {
        if (!recipientId || !messageContent) return false;

        const tokens = await getPushTokensByUserId(recipientId, true, false);
        const validTokens = tokens
            .map(t => t.pushToken)
            .filter(token => Boolean(token && token.startsWith("ExponentPushToken[")))

        if (validTokens.length === 0) return false;

        const notificationPayload: PushNotificationPayload = {
            to: validTokens,
            sound: "default",
            title: senderName || "New Message",
            body: messageContent,
            channelId: "messages-v2",
            priority: "high",
            data: {
                conversationId,
                type: "chat_message"
            }
        }

        return await sendExpoPushNotification(notificationPayload);
    } catch {
        return false;
    }
}