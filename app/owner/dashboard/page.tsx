import {
    getCancelledReservationsForOwnerByTime,
    getOccupancyForOwnerByTime,
    getTotalReservationsForOwnerByTime
} from "@/actions/reservations.action";
import { getRevevueForOwnerByTime } from "@/actions/transaction.action";
import DashboardCards from "@/components/Dashboards/DashboardCards";
import Header from "@/components/Dashboards/Header";
import { keyFilter } from "@/types/global";

interface DashboardPageProps {
    searchParams: Promise<{
        filter: keyFilter
    }>
}

const DashboardPage = async ({
    searchParams
}: DashboardPageProps) => {

    const { filter = "this-year" } = await searchParams;

    const [
        {
            count,
            rate: reservationRate,
            isGrowing: reservationTrend
        },
        {
            revenue,
            rate: revenueRate,
            isGrowing: RevenueTrend
        },
        {
            occupancy,
            rate: occupancyRate,
            isGrowing: occupancyTrend
        },
        {
            count: cancelledReservation,
            rate: rateCancelledReservation,
            isGrowing: cancelledReservationTrend
        }
    ] = await Promise.all([
        getTotalReservationsForOwnerByTime(filter),
        getRevevueForOwnerByTime(filter),
        getOccupancyForOwnerByTime(filter),
        getCancelledReservationsForOwnerByTime(filter)
    ])

    const dashboardMetrics = {
        totalReservations: {
            value: `${count}`,
            trend: {
                value: reservationRate,
                isPositive: reservationTrend
            }
        },
        revenue: {
            value: `$${revenue}`,
            trend: {
                value: revenueRate,
                isPositive: RevenueTrend
            }
        },
        occupancy: {
            value: `${occupancy}`,
            trend: {
                value: occupancyRate,
                isPositive: occupancyTrend
            }
        },
        cancelled: {
            value: `${cancelledReservation}`,
            trend: {
                value: rateCancelledReservation,
                isPositive: cancelledReservationTrend
            }
        }
    }

    const handleExport = async () => {
        "use server";

    }

    return (
        <>
            <Header
                handleExport={handleExport}
            />
            <DashboardCards
                metrics={dashboardMetrics}
            />
        </>
    )
}

export default DashboardPage;