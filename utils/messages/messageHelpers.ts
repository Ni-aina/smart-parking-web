import {
    ConversationInterface,
    MessageInterface
} from "@/types/message";
import { normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";

export type QueryRecord = Record<string, any>

export const normalizeConversation = (conversation: QueryRecord) =>
    normalizeData(conversation) as ConversationInterface

export const normalizeMessage = (message: QueryRecord) =>
    normalizeData(message) as MessageInterface

export const cleanSearchTerm = (term: string) =>
    term.trim().replace(/[,%()]/g, " ")

export const withTimeout = <T>(request: Promise<T>) =>
    Promise.race([
        request,
        rejectTimeout()
    ])

export const selectConversationFields = `
    *,
    sender: sender_id(*),
    receiver: receiver_id(*)
`
