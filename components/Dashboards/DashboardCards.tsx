"use client";

import MetricCard from "@/components/Dashboards/MetricCard";
import { CalendarCheck, DollarSign, PieChart, XCircle } from "lucide-react";

interface DashboardMetrics {
    totalReservations: {
        value: string;
        trend: { 
            value: number; 
            isPositive: boolean 
        }
    }
    revenue: {
        value: string;
        trend: { 
            value: number; 
            isPositive: boolean 
        }
    }
    completed: {
        value: string;
        trend: { 
            value: number; 
            isPositive: boolean 
        }
    }
    cancelled: {
        value: string;
        trend: { 
            value: number; 
            isPositive: boolean 
        }
    }
}

interface DashboardCardsProps {
    metrics: DashboardMetrics;
}

const DashboardCards = ({
    metrics
}: DashboardCardsProps) => {
    const {
        totalReservations,
        revenue,
        completed,
        cancelled
    } = metrics

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 my-8">
            <MetricCard
                title="Total Reservations"
                value={totalReservations.value}
                icon={CalendarCheck}
                trend={totalReservations.trend}
                iconBgColor="bg-blue-500/10"
                iconColor="text-blue-500"
            />

            <MetricCard
                title="Revenue"
                value={revenue.value}
                icon={DollarSign}
                trend={revenue.trend}
                iconBgColor="bg-green-500/10"
                iconColor="text-green-500"
            />

            <MetricCard
                title="Completed"
                value={completed.value}
                icon={PieChart}
                trend={completed.trend}
                iconBgColor="bg-yellow-500/10"
                iconColor="text-yellow-500"
            />

            <MetricCard
                title="Cancelled"
                value={cancelled.value}
                icon={XCircle}
                trend={cancelled.trend}
                iconBgColor="bg-red-500/10"
                iconColor="text-red-500"
            />
        </div>
    )
}

export default DashboardCards;