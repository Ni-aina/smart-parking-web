import { getReservationByIdForOwner } from "@/actions/reservations.action";
import { getPaymentByReservationId } from "@/actions/payments.action";
import ReservationDetail from "@/components/Reservations/ReservationDetail";
import HeaderBack from "@/components/ui/headerBack";

interface ReservationDetailPageProps {
    params: Promise<{ id: string }>;
}

const ReservationDetailPage = async ({
    params
}: ReservationDetailPageProps) => {
    const { id } = await params;

    const [reservation, payment] = await Promise.all([
        getReservationByIdForOwner(id),
        getPaymentByReservationId(id)
    ]);

    return (
        <div className="flex flex-col gap-5 text-white/90 lg:p-2">
            <HeaderBack
                title="Reservation"
                action="New"
            />
            <div className="mt-3">
                <ReservationDetail
                    reservation={reservation}
                    payment={payment}
                />
            </div>
        </div>
    )
}

export default ReservationDetailPage;
