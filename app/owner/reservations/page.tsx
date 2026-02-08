import { getReservationsForOwner } from '@/actions/reservations.action';
import ReservationClient from '@/components/Reservations/ReservationClient';

interface ReservationsPageProps {
    page?: number;
    limit?: number;
}

const ReservationsPage = async ({
    searchParams
}: {
    searchParams: Promise<ReservationsPageProps>
}) => {
    const { page, limit = 6 } = await searchParams;
    
    const reservations = await getReservationsForOwner(page, limit);
    const { count } = reservations;

    return (
        <ReservationClient
            reservations={reservations}
            count={count}
        />
    )
}

export default ReservationsPage;