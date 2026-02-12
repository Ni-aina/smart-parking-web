import { getTotalReservationByTime } from "@/actions/reservations.action";
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
            count: countReservation,
            rate: reservationRate,
            isGrowing: reservationTrend
        }
    ] = await Promise.all([
        getTotalReservationByTime(filter)
    ])

    const dashboardMetrics = {
        totalReservations: {
            value: `${countReservation}`,
            trend: { 
                value: reservationRate, 
                isPositive: reservationTrend 
            }
        },
        revenue: {
            value: "$4578",
            trend: { value: 8.3, isPositive: true }
        },
        occupancyRate: {
            value: "78%",
            trend: { value: 5.2, isPositive: true }
        },
        cancellationRate: {
            value: "4.2%",
            trend: { value: 1.8, isPositive: false }
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