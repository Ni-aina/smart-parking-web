"use client";

import {
    Area,
    AreaChart,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { useTranslation } from "@/context/LanguageContext";

const AreaChartDashboard = ({ 
    isAnimationActive = true,
    bookingsLastWeek = []
}: {
    isAnimationActive?: boolean
    bookingsLastWeek: Array<{ day: string; booking: number; }>
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-5">
            <h1 className="text-white text-lg lg:text-3xl font-semibold">
                {t("dashboard.bookingsLastWeek")}
            </h1>
            <AreaChart
                style={{ width: "100%", maxWidth: "700px", maxHeight: "45vh", aspectRatio: 1.618 }}
                responsive
                data={bookingsLastWeek}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="colorBooking" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="day"
                    tickFormatter={value => t(`dashboard.days.${String(value).toLowerCase()}`)}
                />
                <YAxis width="auto" allowDecimals={false} />
                <Tooltip
                    labelFormatter={value => t(`dashboard.days.${String(value).toLowerCase()}`)}
                    formatter={value => [value, t("dashboard.export.booking")]}
                />
                <Area
                    type="monotone"
                    dataKey="booking"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorBooking)"
                    isAnimationActive={isAnimationActive}
                />
            </AreaChart>
        </div>
    )
}

export default AreaChartDashboard;
