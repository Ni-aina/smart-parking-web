import { getAllParkingLotsForOwner } from "@/actions/parkingLots.action";
import { getDrivers } from "@/actions/profile.action";
import ReservationForm from "@/components/Reservations/ReservationForm";
import HeaderBack from "@/components/ui/headerBack";
import { redirect } from "next/navigation";

const ReservationFormPage = async ({
    searchParams
}: { searchParams: Promise<{ driver_name?: string }> }) => {
    const { driver_name = "" } = await searchParams;

    const [parkingLots, drivers] = await Promise.all([
        getAllParkingLotsForOwner(),
        getDrivers(driver_name)
    ])

    const handleBack = async () => {
        "use server";
        redirect("/owner/reservations");
    }

    return (
        <div className="flex flex-col gap-5 text-white/90 lg:p-2">
            <HeaderBack
                title="Reservation"
                action="New"
                onBack={handleBack}
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
