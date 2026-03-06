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
        value: "This week"
    },
    {
        id: "this-month",
        value: "This month"
    },
    {
        id: "this-year",
        value: "This year"
    }
]

const handleExport = async (
    summaryData: summaryInterface[],
    bookingsLastWeek: HeaderProps["bookingsLastWeek"],
    occupancyLots: HeaderProps["occupancyLots"]
) => {
    try {
        const res = await fetch("/api/export-dashboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                summaryData,
                bookingsLastWeek,
                occupancyLots
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
        toast.error("Failed to export dashboard");
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

    const handleSetFilter = (e: SelectInterface) => {
        const { value } = e.target;
        startTransition(() => {
            toast.loading("Loading data...", { id: "loading-filter" });
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
                    Welcome back, {fullName}
                </h1>
                <p className="text-white/60">
                    Measure your reservations traffic
                </p>
            </div>
            <div className="flex items-center gap-5 text-white">
                <div>
                    <InputSelect
                        data={dataFilter}
                        value={filter}
                        handleChange={handleSetFilter}
                    />
                </div>
                <CustomButton
                    Icon={ArrowDown}
                    title="Export data"
                    onClick={() => handleExport(
                        summaryData,
                        bookingsLastWeek,
                        occupancyLots
                    )}
                />
            </div>
        </div>
    )
}

export default HeaderDashboard;