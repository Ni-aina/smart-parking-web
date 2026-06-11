"use client";

import CustomButton from "../ui/customButton";
import { ArrowDown } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import InputSelect from "../ui/inputSelect";
import { keyFilter } from "@/types/global";
import { SelectInterface } from "@/types/input";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useProfileContext } from "@/context/ProfileContext";
import { supabase } from "@/lib/supabase/client";
import { useTranslation } from "@/context/LanguageContext";

export type trendType = "YES" | "NO";

interface summaryInterface {
    Metric: string;
    Value: string;
    Growing: trendType;
    Rate: string;
}

const dataFilter = [
    {
        id: "this-week",
        value: "dashboard.filters.thisWeek"
    },
    {
        id: "this-month",
        value: "dashboard.filters.thisMonth"
    },
    {
        id: "this-year",
        value: "dashboard.filters.thisYear"
    }
]

const handleExport = async (
    summaryData: summaryInterface[],
    bookingsLastWeek: HeaderProps["bookingsLastWeek"],
    occupancyLots: HeaderProps["occupancyLots"],
    t: (key: string) => string
) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const translatedSummaryData = summaryData.map(item => ({
            [t("dashboard.export.metric")]: t(`dashboard.metrics.${item.Metric}`),
            [t("dashboard.export.value")]: item.Value,
            [t("dashboard.export.rate")]: item.Rate,
            [t("dashboard.export.growing")]: t(`dashboard.export.${item.Growing.toLowerCase()}`)
        }))
        const translatedBookingsLastWeek = bookingsLastWeek.map(item => ({
            [t("dashboard.export.day")]: t(`dashboard.days.${item.Day.toLowerCase()}`),
            [t("dashboard.export.booking")]: item.Booking
        }))
        const translatedOccupancyLots = occupancyLots.map(item => ({
            [t("dashboard.export.status")]: t(`dashboard.status.${item.Status}`),
            [t("dashboard.export.count")]: item.Count
        }))

        const res = await fetch("/api/protected/export-dashboard", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({
                summaryData: translatedSummaryData,
                bookingsLastWeek: translatedBookingsLastWeek,
                occupancyLots: translatedOccupancyLots,
                sheetNames: {
                    summary: t("dashboard.export.summary"),
                    bookingsLastWeek: t("dashboard.bookingsLastWeek"),
                    occupancyLots: t("dashboard.export.occupancyLots")
                }
            })
        })
        if (!res.ok) throw new Error("Failed to export");

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "dashboard-report.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        toast.error(t("dashboard.export.failed"));
    }
}

interface HeaderProps {
    summaryData: summaryInterface[];
    bookingsLastWeek: Array<{ Day: string; Booking: string }>;
    occupancyLots: Array<{ Status: string; Count: string }>;
}

const HeaderDashboard = ({
    summaryData,
    bookingsLastWeek,
    occupancyLots
}: HeaderProps) => {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const filterParams = searchParams.get("filter") || "this-week";
    const { currentProfile } = useProfileContext();
    const fullName = currentProfile?.fullName || "";

    const router = useRouter();

    const [filter, setFilter] = useState<keyFilter>(() =>
        dataFilter.some(item => item.id === filterParams) ?
            filterParams as keyFilter :
            "this-year"
    )
    const [isPending, startTransition] = useTransition();
    const translatedDataFilter = dataFilter.map(item => ({
        ...item,
        value: t(item.value)
    }))

    const handleSetFilter = (e: SelectInterface) => {
        const { value } = e.target;
        startTransition(() => {
            toast.loading(t("dashboard.loadingData"), { id: "loading-filter" });
            router.push(`?filter=${value}`);
            setFilter(value);
        })
    }

    useEffect(() => {
        if (isPending) return;
        toast.dismiss("loading-filter");
    }, [isPending])

    return (
        <div className="flex flex-wrap justify-between gap-5">
            <div className="space-y-3">
                <h1 className="text-white text-lg lg:text-3xl font-semibold">
                    {t("dashboard.welcomeBack")}, {fullName}
                </h1>
                <p className="text-white/60">
                    {t("dashboard.measureTraffic")}
                </p>
            </div>
            <div className="flex items-center gap-5 text-white">
                <div>
                    <InputSelect
                        data={translatedDataFilter}
                        value={filter}
                        handleChange={handleSetFilter}
                    />
                </div>
                <CustomButton
                    Icon={ArrowDown}
                    title={t("dashboard.exportData")}
                    onClick={() => handleExport(
                        summaryData,
                        bookingsLastWeek,
                        occupancyLots,
                        t
                    )}
                />
            </div>
        </div>
    )
}

export default HeaderDashboard;
