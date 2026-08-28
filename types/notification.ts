export interface PushTokenInterface {
    id: string;
    userId: string;
    pushToken: string;
    platform: string;
    createdAt: string;
    updatedAt: string;
}

export interface PushNotificationPayload {
    to: string | string[];
    title: string;
    body: string;
    data?: Record<string, unknown>;
    sound?: "default" | string | null;
    badge?: number;
    channelId?: string;
    priority?: "default" | "normal" | "high";
}