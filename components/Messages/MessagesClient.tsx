"use client"

import { useTranslation } from "@/context/LanguageContext";
import useConversations from "@/hooks/messages/useConversations";
import { cn } from "@/lib/utils";
import { ProfileInterface } from "@/types/profile";
import { Loader2, Plus, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ConversationItem from "./ConversationItem";
import EmptyThread from "./EmptyThread";
import ProfileSearch from "./ProfileSearch";
import ThreadPane from "./ThreadPane";

const MessagesClient = () => {
    const { t } = useTranslation()
    const profileListRef = useRef<HTMLDivElement>(null)
    const newConversationButtonRef = useRef<HTMLButtonElement>(null)
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
    const [showProfiles, setShowProfiles] = useState(false)
    const {
        conversations,
        isLoading,
        createConversationAsync,
        isCreating,
        currentProfile
    } = useConversations()

    const startConversation = async (profile: ProfileInterface) => {
        if (!currentProfile?.id) return

        try {
            const conversation = await createConversationAsync({
                senderId: currentProfile.id,
                receiverId: profile.id
            })
            setSelectedConversationId(conversation.id)
            setShowProfiles(false)
        } catch {
            toast.error(t("messages.errorConversation"))
        }
    }

    useEffect(() => {
        if (!showProfiles) return

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node
            const isInsideProfileList = profileListRef.current?.contains(target)
            const isInsideToggleButton = newConversationButtonRef.current?.contains(target)

            if (!isInsideProfileList && !isInsideToggleButton) {
                setShowProfiles(false)
            }
        }

        document.addEventListener("pointerdown", handlePointerDown)
        return () => document.removeEventListener("pointerdown", handlePointerDown)
    }, [showProfiles])

    return (
        <div className="flex h-full min-h-[calc(100dvh-8rem)] flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-white">
                        {t("messages.title")}
                    </h1>
                    <p className="text-sm text-white/45">
                        {t("messages.subtitle")}
                    </p>
                </div>
                <button
                    ref={newConversationButtonRef}
                    type="button"
                    onClick={() => setShowProfiles(prev => !prev)}
                    className="flex cursor-pointer items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition hover:opacity-80"
                >
                    <Plus size={16} />
                    {t("messages.newConversation")}
                </button>
            </div>

            <div className="flex min-h-0 flex-1 gap-4">
                <aside
                    className={cn(
                        "min-h-0 w-full flex-col gap-3 lg:flex lg:max-w-105",
                        selectedConversationId ? "hidden lg:flex" : "flex"
                    )}
                >
                    {
                        showProfiles &&
                        <div ref={profileListRef}>
                            <ProfileSearch
                                onStart={startConversation}
                                isCreating={isCreating}
                            />
                        </div>
                    }

                    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
                        {
                            isLoading ?
                                <div className="flex h-72 items-center justify-center text-white/55">
                                    <Loader2 size={24} className="animate-spin" />
                                </div>
                                :
                                conversations.length ?
                                    conversations.map(conversation =>
                                        <ConversationItem
                                            key={conversation.id}
                                            conversation={conversation}
                                            currentUserId={currentProfile?.id || ""}
                                            isActive={conversation.id === selectedConversationId}
                                            onClick={() => setSelectedConversationId(conversation.id)}
                                        />
                                    )
                                    :
                                    <div
                                        className="flex h-full min-h-72 flex-col items-center justify-center rounded-md 
                                        bg-white/10 p-8 text-center shadow-sm shadow-black/20"
                                    >
                                        <UserRound size={52} className="text-white/20" />
                                        <h2 className="mt-4 text-base font-semibold text-white">
                                            {t("messages.noData")}
                                        </h2>
                                        <p className="mt-2 text-sm text-white/40">
                                            {t("messages.noDataDescription")}
                                        </p>
                                    </div>
                        }
                    </div>
                </aside>

                {
                    selectedConversationId ?
                        <ThreadPane
                            conversationId={String(selectedConversationId)}
                            onBack={() => setSelectedConversationId(null)}
                        /> :
                        <EmptyThread />
                }
            </div>
        </div>
    )
}

export default MessagesClient;
