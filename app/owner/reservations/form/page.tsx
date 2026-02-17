import { getAllParkingLotsForOwner } from "@/actions/parkingLots.action";
import { getDrivers } from "@/actions/profile.action";
import ReservationForm from "@/components/Reservations/ReservationForm";
import HeaderBack from "@/components/ui/headerBack";

const ReservationFormPage = async ({
    searchParams
}: { searchParams: Promise<{ driverName?: string }> }) => {
    const { driverName = "" } = await searchParams;

    const [parkingLots, drivers] = await Promise.all([
        getAllParkingLotsForOwner(),
        getDrivers(driverName)
    ])

    return (
        <div className="flex flex-col gap-5 text-white/90 lg:p-2">
            <HeaderBack
                title="Reservation"
                action="New"
            />
            <div className="mt-3">
                <ReservationForm
                    parkingLots={parkingLots}
                    drivers={drivers}
                />
            </div>
        </div>
    )
}

export default ReservationFormPage;
