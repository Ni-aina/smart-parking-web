import { ProfileInterface } from "./profile";

export interface MessageInterface {
    id: number
    conversationId: number
    senderId: string
    content: string
    contentType?: string
    attachementUrl?: string
    isRead?: boolean
    createdAt: string
    updatedAt?: string
    sender?: ProfileInterface
}

export interface ConversationInterface {
    id: number
    senderId: string
    receiverId: string
    createdAt: string
    sender?: ProfileInterface
    receiver?: ProfileInterface
    lastMessage?: MessageInterface
}

export interface ConversationCreateInterface {
    senderId: string
    receiverId: string
}

export interface MessageCreateInterface {
    conversationId: number
    senderId: string
    content: string
    contentType?: string
}
