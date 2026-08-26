"use client"

import { useTranslation } from "@/context/LanguageContext";
import useMessages from "@/hooks/messages/useMessages";
import { ArrowLeft, ChevronUp, Loader2, MessageCircle, Send } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Avatar from "./Avatar";
import MessageBubble from "./MessageBubble";
import Link from "next/link";
import { ConversationInterface, PaginatedMessagesInterface } from "@/types/message";

interface ThreadPaneInterface {
    conversation: ConversationInterface
    initialData: PaginatedMessagesInterface
}

const ThreadPane = ({
    conversation,
    initialData
}: ThreadPaneInterface) => {
    const { t, language } = useTranslation()
    const [message, setMessage] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)
    const prevScrollHeightRef = useRef<number | null>(null)
    const isInitialLoadRef = useRef<boolean>(true)

    const {
        messages,
        hasMore,
        isLoadingOlder,
        loadOlderMessages,
        handleSendAsync,
        isSending,
        currentProfile
    } = useMessages(conversation, initialData)

    const otherUser = currentProfile && conversation.senderId === currentProfile?.id
        ? conversation.receiver
        : conversation.sender

    const lastSeenMessageId = messages.filter(item => item.senderId === currentProfile?.id && item.isRead).at(-1)?.id

    const submitMessage = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const content = message.trim()
        if (!content || !currentProfile?.id || !conversation.id) return

        try {
            await handleSendAsync({
                conversationId: Number(conversation.id),
                senderId: currentProfile.id,
                content
            })
            setMessage("")
        } catch {
            toast.error(t("messages.errorSending"))
        }
    }

    const handleLoadOlder = async () => {
        if (!scrollRef.current) return
        prevScrollHeightRef.current = scrollRef.current.scrollHeight
        await loadOlderMessages()
    }

    useEffect(() => {
        isInitialLoadRef.current = true
    }, [conversation.id])

    useEffect(() => {
        if (!scrollRef.current) return

        if (prevScrollHeightRef.current !== null) {
            const newScrollHeight = scrollRef.current.scrollHeight
            scrollRef.current.scrollTop = newScrollHeight - prevScrollHeightRef.current
            prevScrollHeightRef.current = null
            return
        }

        if (isInitialLoadRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            isInitialLoadRef.current = false
            return
        }

        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth"
        })
    }, [messages.length])

    return (
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md bg-white/10 shadow-sm shadow-black/20">
            <header className="flex min-h-16 items-center gap-3 bg-black/20 px-4">
                <Link
                    href="/owner/messages"
                    className="cursor-pointer rounded-md p-2 text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
                    aria-label={t("messages.backToInbox")}
                >
                    <ArrowLeft size={18} />
                </Link>
                <Avatar profile={otherUser} />
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold text-white">
                        {otherUser?.fullName || t("messages.defaultUser")}
                    </h2>
                    <p className="truncate text-xs text-white/40">
                        {otherUser?.emailAddress || t("messages.conversation")}
                    </p>
                </div>
            </header>

            <div ref={scrollRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
                {
                    hasMore &&
                    <div className="flex justify-center py-2">
                        {
                            isLoadingOlder ?
                                <div className="flex items-center justify-center gap-2 py-1 text-xs text-white/50">
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>{t("messages.loadingOlder")}</span>
                                </div>
                                :
                                <button
                                    type="button"
                                    onClick={handleLoadOlder}
                                    disabled={isLoadingOlder}
                                    className="flex cursor-pointer items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronUp size={14} />
                                    {t("messages.loadOlder")}
                                </button>
                        }
                    </div>
                }

                {
                    messages.length ?
                        messages.map((item, index) =>
                            <MessageBubble
                                key={item.id}
                                message={item}
                                previousMessage={messages[index - 1]}
                                nextMessage={messages[index + 1]}
                                isMine={item.senderId === currentProfile?.id}
                                isLastSeenMessage={item.id === lastSeenMessageId}
                                otherUser={otherUser}
                                locale={language === "fr" ? "fr-FR" : "en-US"}
                            />
                        )
                        :
                        <div className="flex h-full min-h-72 flex-col items-center justify-center gap-3 text-center">
                            <MessageCircle size={52} className="text-white/20" />
                            <p className="text-sm font-medium text-white/55">
                                {t("messages.startChat")}
                            </p>
                        </div>
                }
            </div>

            <form onSubmit={submitMessage} className="bg-black/20 p-3">
                <div className="flex items-end gap-2 rounded-md bg-black/30 p-2">
                    <textarea
                        value={message}
                        onChange={event => setMessage(event.target.value)}
                        onKeyDown={event => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault()
                                event.currentTarget.form?.requestSubmit()
                            }
                        }}
                        placeholder={t("messages.typePlaceholder")}
                        rows={1}
                        className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/30"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim() || isSending}
                        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md bg-white text-neutral-950 transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={t("messages.send")}
                    >
                        {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} />}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default ThreadPane
