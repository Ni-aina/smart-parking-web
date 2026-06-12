"use client";

import NoData from "@/components/ui/noData";
import { useTranslation } from "@/context/LanguageContext";

const NotificationsPage = () => {
    const { t } = useTranslation();

    return (
        <div className="mt-5 lg:mt-10">
            <NoData
                message={t("notifications.title")}
                description={t("notifications.noData")}
            />
        </div>
    )
}

export default NotificationsPage;