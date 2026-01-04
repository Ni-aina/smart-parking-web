import { getParkingLots } from "@/actions/parkingLots.action";
import { getAgents } from "@/actions/profile.action";
import ClientParkingLots from "@/components/Parking-lots/ClientParkingLots";

const ParkingLotsPage = async () => {
    const [parkings, agents] = await Promise.all([
        getParkingLots(),
        getAgents()
    ])

    return (
        <ClientParkingLots
            parkings={parkings}
            agents={agents}
        />
    )
}

export default ParkingLotsPage;