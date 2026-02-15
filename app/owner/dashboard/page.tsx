import {
    getBokingsLastWeekForOwner,
    getCancelledReservationsForOwnerByTime,
    getCompletedForOwnerByTime,
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
            count: reservationCount,
            rate: reservationRate,
            isGrowing: reservationTrend
        },
        {
            revenue,
            rate: revenueRate,
            isGrowing: revenueTrend
        },
        {
            completed: completedReservation,
            rate: completedRate,
            isGrowing: completedTrend
        },
        {
            count: cancelledReservation,
            rate: rateCancelledReservation,
            isGrowing: cancelledReservationTrend
        },
        bookingsLastWeek
    ] = await Promise.all([
        getTotalReservationsForOwnerByTime(filter),
        getRevevueForOwnerByTime(filter),
        getCompletedForOwnerByTime(filter),
        getCancelledReservationsForOwnerByTime(filter),
        getBokingsLastWeekForOwner()
    ])

    const dashboardMetrics = {
        totalReservations: {
            value: `${reservationCount}`,
            trend: {
                value: reservationRate,
                isPositive: reservationTrend
            }
        },
        revenue: {
            value: `$${revenue}`,
            trend: {
                value: revenueRate,
                isPositive: revenueTrend
            }
        },
        completed: {
            value: `${completedReservation}`,
            trend: {
                value: completedRate,
                isPositive: completedTrend
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

    const summaryData = [
        {
            Metric: "Total Reservations",
            Value: reservationCount,
            Rate: reservationRate,
            Growing: reservationTrend
        },
        {
            Metric: "Revenue",
            Value: revenue,
            Rate: revenueRate,
            Growing: revenueTrend
        },
        {
            Metric: "Completed",
            Value: completedReservation,
            Rate: completedRate,
            Growing: completedTrend
        },
        {
            Metric: "Cancelled",
            Value: cancelledReservation,
            Rate: rateCancelledReservation,
            Growing: cancelledReservationTrend
        }
    ]

    return (
        <>
            <Header
                summaryData={summaryData}
                bookingsLastWeek={bookingsLastWeek}
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