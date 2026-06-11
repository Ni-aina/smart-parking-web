"use client";

import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend: {
        value: number;
        isPositive: boolean;
    }
    iconBgColor?: string;
    iconColor?: string;
}

const MetricCard = ({
    title,
    value,
    icon: Icon,
    trend,
    iconBgColor = "bg-blue-500/10",
    iconColor = "text-blue-500"
}: MetricCardProps) => {
    const trendColor = trend.isPositive ? "text-green-500" : "text-red-500";
    const trendBgColor = trend.isPositive ? "bg-green-500/10" : "bg-red-500/10";
    const trendSymbol = trend.isPositive ? "+" : "";
    const TrendIcon = trend.isPositive ? ArrowUpRight : ArrowDownRight;

    return (
        <div className="bg-white/10 rounded-md p-5 text-white">
            <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                    <p className="text-sm text-white/60 font-medium">
                        {title}
                    </p>
                    <h2 className="text-3xl font-bold mb-3">
                        {value}
                    </h2>
                    <div className={`flex items-center gap-1 text-sm ${trendColor} font-medium`}>
                        <span>
                            {trendSymbol}{trend.value.toFixed(2)}%
                        </span>
                        <div className={`p-1 rounded ${trendBgColor}`}>
                            <TrendIcon size={14} className={trendColor} />
                        </div>
                    </div>
                </div>
                <div className={`p-3 rounded-lg ${iconBgColor}`}>
                    <Icon className={`${iconColor}`} size={24} />
                </div>
            </div>
        </div>
    )
}

export default MetricCard;