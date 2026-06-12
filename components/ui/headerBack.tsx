"use client";

import { ArrowLeftCircle, Eye, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/context/LanguageContext";

const HeaderBack = (
    { 
        title,
        action,
        onBack
     }: { 
        title: string,
        action: "New" | "Edit" | "View",
        onBack?: () => void
    }
) => {
    const router = useRouter();
    const { t } = useTranslation();

    const isParkingLot = title === "Parking lot";
    const actionNamespace = isParkingLot ? "parkingLots" : "reservations";

    const actionLabels = {
        New: t(`${actionNamespace}.pageActions.new`),
        Edit: t(`${actionNamespace}.pageActions.edit`),
        View: t(`${actionNamespace}.pageActions.view`)
    }

    const titleLabels: Record<string, string> = {
        Reservation: t("reservations.titleSingular"),
        "Parking lot": t("parkingLots.titleSingular")
    }

    const titleLabel = titleLabels[title] || title;

    return (
        <div className="flex justify-between items-center gap-5">
            <div className="flex items-center gap-3">
                <button
                    title={t(`${actionNamespace}.pageActions.goBack`)}
                    className="cursor-pointer hover:opacity-80"
                    onClick={onBack || router.back}
                >
                    <ArrowLeftCircle
                        size={24}
                    />
                </button>
                <h1 className="font-semibold">
                    {titleLabel}
                </h1>
            </div>
            <div className="flex items-center space-x-2">
                {
                    action === "New" &&
                    <Plus
                        size={20}
                        className="text-red-500"
                    />
                }
                {
                    action === "Edit" &&
                    <Pencil
                        size={18}
                        className="text-red-500"
                    />
                }
                {
                    action === "View" &&
                    <Eye
                        size={18}
                        className="text-red-500"
                    />
                }
                <h1 className="font-semibold">
                    {actionLabels[action] || action}
                </h1>
            </div>
        </div>
    )
}

export default HeaderBack;
