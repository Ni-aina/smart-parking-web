"use client"

import { useTranslation } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { ConversationInterface } from "@/types/message";
import { formatRelativeMessageTime } from "@/utils/messages/messageTime";
import Avatar from "./Avatar";

const ConversationItem = ({
    conversation,
    currentUserId,
    isActive,
    onClick
}: {
    conversation: ConversationInterface
    currentUserId: string
    isActive: boolean
    onClick: () => void
}) => {
    const { t } = useTranslation()
    const otherUser = conversation.senderId === currentUserId
        ? conversation.receiver
        : conversation.sender
    const lastMessage = conversation.lastMessage
    const isMine = lastMessage?.senderId === currentUserId

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-md p-3 text-left transition hover:bg-white/5",
                isActive ? "bg-white/5" : "bg-white/10"
            )}
        >
            <Avatar profile={otherUser} size="lg" />
            <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                        {otherUser?.fullName || t("messages.defaultUser")}
                    </h3>
                    <span className="shrink-0 text-xs text-white/40">
                        {lastMessage?.createdAt
                            ? formatRelativeMessageTime(lastMessage.createdAt, t)
                            : formatRelativeMessageTime(conversation.createdAt, t)}
                    </span>
                </div>
                <p className="truncate text-sm text-white/45">
                    {
                        lastMessage?.content
                            ? `${isMine ? `${t("messages.you")}: ` : ""}${lastMessage.content}`
                            : t("messages.noMessagesYet")
                    }
                </p>
            </div>
        </button>
    )
}

export default ConversationItem;
