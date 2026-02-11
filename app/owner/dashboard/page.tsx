import DashboardCards from "@/components/Dashboards/DashboardCards";
import Header from "@/components/Dashboards/Header";

const DashboardPage = async () => {

    const dashboardMetrics = {
        totalReservations: {
            value: "1234",
            trend: { value: 12.5, isPositive: true }
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