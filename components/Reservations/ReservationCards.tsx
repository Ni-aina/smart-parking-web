"use client";

import ReservationCard from './ReservationCard';
import { ReservationInterface } from '@/types/reservation';

interface ReservationCardsProps {
    reservations: ReservationInterface[];
    handleDelete: (id: string) => void;
}

const ReservationCards = ({
    reservations,
    handleDelete
}: ReservationCardsProps) => {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {
                reservations.map(r => (
                    <ReservationCard
                        key={r.id}
                        reservation={r}
                        handleDelete={handleDelete}
                    />
                ))
            }
        </div>
    )
}

export default ReservationCards
