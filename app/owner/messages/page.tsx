"use client";

import NoData from "@/components/ui/noData";
import { useTranslation } from "@/context/LanguageContext";

const MessagesPage = () => {
    const { t } = useTranslation();

    return (
        <div className="mt-5 lg:mt-10">
            <NoData
                message={t("messages.title")}
                description={t("messages.noData")}
            />
        </div>
    )
}

export default MessagesPage;