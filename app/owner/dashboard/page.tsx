import { getOccupancyLots } from "@/actions/parkingLots.action";
import {
    getBokingsLastWeekForOwner,
    getCancelledReservationsForOwnerByTime,
    getCompletedForOwnerByTime,
    getTotalReservationsForOwnerByTime
} from "@/actions/reservations.action";
import { getRevenueForOwnerByTime } from "@/actions/transaction.action";
import AreaChartDashboard from "@/components/Dashboards/AreaChart";
import DashboardCards from "@/components/Dashboards/DashboardCards";
import HeaderDashboard, { trendType } from "@/components/Dashboards/Header";
import PieChartDashboard from "@/components/Dashboards/PieChart";
import { keyFilter } from "@/types/global";

interface DashboardPageProps {
    searchParams: Promise<{
        filter: keyFilter
    }>
}

const DashboardPage = async ({
    searchParams
}: DashboardPageProps) => {

    const { filter = "this-week" } = await searchParams;

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
        bookingsLastWeek,
        occupancyLots
    ] = await Promise.all([
        getTotalReservationsForOwnerByTime(filter),
        getRevenueForOwnerByTime(filter),
        getCompletedForOwnerByTime(filter),
        getCancelledReservationsForOwnerByTime(filter),
        getBokingsLastWeekForOwner(),
        getOccupancyLots(filter)
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
            Metric: "totalReservations",
            Value: `${reservationCount}`,
            Rate: `${reservationRate}%`,
            Growing: reservationTrend ? "YES" : "NO" as trendType
        },
        {
            Metric: "revenue",
            Value: `$${revenue}`,
            Rate: `${revenueRate}%`,
            Growing: revenueTrend ? "YES" : "NO" as trendType
        },
        {
            Metric: "completed",
            Value: `${completedReservation}`,
            Rate: `${completedRate}%`,
            Growing: completedTrend ? "YES" : "NO" as trendType
        },
        {
            Metric: "cancelled",
            Value: `${cancelledReservation}`,
            Rate: `${rateCancelledReservation}%`,
            Growing: cancelledReservationTrend ? "YES" : "NO" as trendType
        }
    ]

    const {
        occupiedSpots,
        availableSpots,
        totalSpots
    } = occupancyLots;

    const PieChartData = [
        {
            name: "occupied",
            value: occupiedSpots
        },
        {
            name: "available",
            value: availableSpots
        }
    ]

    const normalizeBookingsToExcel = (() => {
        const bookingsByDay: Record<string, string> = {};

        bookingsLastWeek.forEach(({ day, booking }) => {
            bookingsByDay[day] = `${booking}`;
        })

        return Object.entries(bookingsByDay).map(([Day, Booking]) => ({ Day, Booking }));
    })()

    const PiechartToExcel = PieChartData.map(({ name, value }) => ({
        Status: name,
        Count: `${value}`
    })).concat({
        Status: "totalSpots",
        Count: `${totalSpots}`
    })

    return (
        <>
            <HeaderDashboard
                summaryData={summaryData}
                bookingsLastWeek={normalizeBookingsToExcel}
                occupancyLots={PiechartToExcel}
            />
            <DashboardCards
                metrics={dashboardMetrics}
            />
            <div className="grid grid-cols-1 lg:grid-cols-[auto_260px] gap-10">
                <AreaChartDashboard
                    bookingsLastWeek={bookingsLastWeek}
                />
                <PieChartDashboard
                    piechartData={PieChartData}
                />
            </div>
        </>
    )
}

export default DashboardPage;
