import { getParkingLots } from "@/actions/parkingLots.action";
import { getAgents } from "@/actions/profile.action";
import ClientParkingLots from "@/components/Parking-lots/ClientParkingLots";

interface ParkingLotsPageProps {
    page?: number;
    limit?: number;
}

const ParkingLotsPage = async ({
    searchParams
}: {
    searchParams: Promise<ParkingLotsPageProps>
}) => {
    const { page, limit = 6 } = await searchParams;
    const [parkings, agents] = await Promise.all([
        getParkingLots(page, limit),
        getAgents()
    ])

    const { count } = parkings;

    return (
        <ClientParkingLots
            parkings={parkings}
            agents={agents}
            count={count}
        />
    )
}

export default ParkingLotsPage;