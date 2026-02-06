import { ReservationInterface } from '@/types/reservation';
import { getReservationsForOwner } from '@/actions/reservations.action';
import ReservationClient from '@/components/Reservations/ReservationClient';

export default async function ReservationsPage() {
    const reservations: ReservationInterface[] = await getReservationsForOwner();

    return (
        <ReservationClient
            reservations={reservations}
        />
    )
}