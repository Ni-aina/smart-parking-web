"use client"

import { cn } from "@/lib/utils";
import { MessageInterface } from "@/types/message";
import {
    formatMessageTime,
    shouldShowMessageTime
} from "@/utils/messages/messageTime";
import Avatar from "./Avatar";

const MessageBubble = ({
    message,
    previousMessage,
    isMine,
    locale
}: {
    message: MessageInterface
    previousMessage?: MessageInterface
    isMine: boolean
    locale: string
}) => {
    const showTime = shouldShowMessageTime(
        message.createdAt,
        previousMessage?.createdAt
    )

    return (
        <div>
            {
                showTime &&
                <div className="my-4 text-center text-xs font-medium text-white/35">
                    {formatMessageTime(message.createdAt, locale)}
                </div>
            }
            <div className={cn("flex items-end gap-2", isMine && "justify-end")}>
                {!isMine && <Avatar profile={message.sender} size="sm" />}
                <div
                    className={cn(
                        "max-w-[78%] whitespace-pre-wrap wrap-break-word rounded-2xl px-4 py-2 text-sm leading-6",
                        isMine
                            ? "rounded-br-sm bg-white text-neutral-950"
                            : "rounded-bl-sm bg-white/10 text-white"
                    )}
                >
                    {message.content}
                </div>
            </div>
        </div>
    )
}

export default MessageBubble;
