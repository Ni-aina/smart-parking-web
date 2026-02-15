import { getOccupancyLots } from "@/actions/parkingLots.action";
import {
    getBokingsLastWeekForOwner,
    getCancelledReservationsForOwnerByTime,
    getCompletedForOwnerByTime,
    getTotalReservationsForOwnerByTime
} from "@/actions/reservations.action";
import { getRevevueForOwnerByTime } from "@/actions/transaction.action";
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
        bookingsLastWeek,
        occupancyLots
    ] = await Promise.all([
        getTotalReservationsForOwnerByTime(filter),
        getRevevueForOwnerByTime(filter),
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
            Metric: "Total Reservations",
            Value: `${reservationCount}`,
            Rate: `${reservationRate}%`,
            Growing: reservationTrend ? "YES" : "NO" as trendType
        },
        {
            Metric: "Revenue",
            Value: `$${revenue}`,
            Rate: `${revenueRate}%`,
            Growing: revenueTrend ? "YES" : "NO" as trendType
        },
        {
            Metric: "Completed",
            Value: `${completedReservation}`,
            Rate: `${completedRate}%`,
            Growing: completedTrend ? "YES" : "NO" as trendType
        },
        {
            Metric: "Cancelled",
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
            name: "Occupied",
            value: occupiedSpots
        },
        {
            name: "Available",
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
        Status: "Total Spots",
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
                <div className="space-y-5">
                    <h1 className="text-white text-lg lg:text-3xl font-semibold">
                        Bookings last week
                    </h1>
                    <AreaChartDashboard
                        bookingsLastWeek={bookingsLastWeek}
                    />
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <h1 className="text-white text-lg lg:text-3xl font-semibold">
                        Occupancy Rate
                    </h1>
                    <PieChartDashboard
                        piechartData={PieChartData}
                    />
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#5CFA90]" />
                            <span className="text-white">Occupied</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF8042]" />
                            <span className="text-white">Available</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardPage;