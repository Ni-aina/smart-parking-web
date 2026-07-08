"use client"

import { useTranslation } from "@/context/LanguageContext";
import { MessageCircle } from "lucide-react";

const EmptyThread = () => {
    const { t } = useTranslation()

    return (
        <section
            className="hidden min-h-0 flex-1 items-center justify-center rounded-md 
            bg-white/10 p-6 text-center shadow-sm shadow-black/20 lg:flex"
        >
            <div className="space-y-3">
                <MessageCircle size={58} className="mx-auto text-white/20" />
                <h2 className="text-lg font-semibold text-white">
                    {t("messages.selectConversation")}
                </h2>
                <p className="max-w-sm text-sm text-white/40">
                    {t("messages.selectConversationDesc")}
                </p>
            </div>
        </section>
    )
}

export default EmptyThread;
