import { getReservationsForOwner } from "@/actions/reservations.action";
import ReservationClient from "@/components/Reservations/ReservationClient";

interface ReservationsPageProps {
    page?: number;
    limit?: number;
    searchTerm?: string;
}

const ReservationsPage = async ({
    searchParams
}: {
    searchParams: Promise<ReservationsPageProps>
}) => {
    const { 
        page, 
        limit = 6,
        searchTerm = ""
    } = await searchParams;
    
    const reservations = await getReservationsForOwner(page, limit, searchTerm);
    const { count } = reservations;

    return (
        <ReservationClient
            reservations={reservations}
            count={count}
            searchTerm={searchTerm}
        />
    )
}

export default ReservationsPage;