"use client";

import { useRouter } from "next/navigation";
import Navbar from "../Navbar";
import { ReservationInterface } from "@/types/reservation";
import ReservationCards from "./ReservationCards";
import { startTransition, useOptimistic, useState } from "react";
import Pagination from "../ui/pagination";
import CancelConfirm from "../ui/cancelConfirm";
import { cancelReservation } from "@/actions/reservations.action";

interface ReservationClientProps {
    reservations: ReservationInterface[];
    count: number;
    searchTerm: string;
}

const title = "Reservations";

const ReservationClient = ({
    reservations,
    count,
    searchTerm
}: ReservationClientProps) => {
    const router = useRouter();
    const [search, setSearch] = useState<string>(searchTerm);
    const [cancellingId, setCancellingId] = useState("");
    const [isCancelling, setIsCancelling] = useState(false);

    const [optimisticReservations, addOptimisticReservation] = useOptimistic(
        reservations,
        (currentReservations: ReservationInterface[], id: string) =>
            currentReservations.map(r =>
                r.id === id ? { ...r, status: "cancelled" as const } : r
            )
    )

    const handleCancel = async () => {
        if (!cancellingId) return;

        setIsCancelling(true);
        startTransition(() => {
            addOptimisticReservation(cancellingId);
            cancelReservation(cancellingId);
        })
        setIsCancelling(false);
        setCancellingId("");
    }

    return (
        <div className="flex flex-col gap-5">
            <Navbar
                title={title}
                search={search}
                setSearch={setSearch}
                onAdd={() => router.push("/owner/reservations/form")}
            />
            <div className="mt-5 lg:mt-10">
                {
                    optimisticReservations.length === 0 && (
                        <div className="text-white/80">No reservations found</div>
                    )
                }

                <ReservationCards
                    reservations={optimisticReservations}
                    handleCancel={
                        (id: string) => setCancellingId(id)
                    }
                />
            </div>
            <Pagination
                showPage={6}
                count={count}
            />
            <CancelConfirm
                isOpen={!!cancellingId}
                isLoading={isCancelling}
                handleCancel={
                    () => setCancellingId("")
                }
                handleConfirm={handleCancel}
            />
        </div>
    )
}

export default ReservationClient;
