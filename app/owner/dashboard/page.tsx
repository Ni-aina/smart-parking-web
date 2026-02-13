import {
    getCancelledReservationsForOwnerByTime,
    getOccupancyForOwnerByTime,
    getTotalReservationsForOwnerByTime
} from "@/actions/reservations.action";
import { getRevevueForOwnerByTime } from "@/actions/transaction.action";
import AreaChartDashboard from "@/components/Dashboards/AreaChart";
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

    const bookingsLastWeek = [
        {
            name: "Sunday",
            value: 0
        },
        {
            name: "Monday",
            value: 5
        },
        {
            name: "Tuesday",
            value: 0
        },
        {
            name: "Wednesday",
            value: 1
        },
        {
            name: "Thursday",
            value: 0
        },
        {
            name: "Friday",
            value: 3
        },
        {
            name: "Saturday",
            value: 0
        }
    ]

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
            <div className="space-y-5">
                <h1 className="text-white text-lg lg:text-3xl font-semibold">
                    Bookings last week
                </h1>
                <AreaChartDashboard
                    data={bookingsLastWeek}
                />
            </div>
        </>
    )
}

export default DashboardPage;