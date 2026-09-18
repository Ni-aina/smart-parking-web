export interface PushTokenInterface {
    id: string;
    userId: string;
    pushToken: string;
    platform: string;
    createdAt: string;
    updatedAt: string;
    enabledUpdates: boolean;
    enabledMessages: boolean;
}

export interface PushNotificationPayload {
    to: string | string[];
    title: string;
    body: string;
    data?: Record<string, unknown>;
    sound?: "default" | null;
    badge?: number;
    channelId?: string;
    priority?: "default" | "normal" | "high";
}