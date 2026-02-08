"use client";

import { useRouter } from "next/navigation";
import Navbar from "../Navbar";
import { ReservationInterface } from "@/types/reservation";
import ReservationCards from "./ReservationCards";
import { startTransition, useOptimistic, useState } from "react";
import Pagination from "../ui/pagination";
import DeleteConfrim from "../ui/deleteConfirm";
import { deleteRerservation } from "@/actions/reservations.action";

interface ReservationClientProps {
    reservations: ReservationInterface[];
    count: number;
}

const title = "Reservations";

const ReservationClient = ({
    reservations,
    count
}: ReservationClientProps) => {
    const router = useRouter();
    const [search, setSearch] = useState<string>("");
    const [isConfirm, setIsConfirm] = useState("");

    const [optimisticReservation, addOptimisticReservation] = useOptimistic(
        reservations,
        (currentReservation: ReservationInterface[], id: string) =>
            currentReservation.filter(r => r.id !== id)
    )

    const handleDelete = () => {
        if (!isConfirm) return;
        startTransition(() => {
            addOptimisticReservation(isConfirm);
            deleteRerservation(isConfirm);
        })
        setIsConfirm("")
    }

    return (
        <div className="flex flex-col gap-5">
            <Navbar
                title={title}
                search={search}
                setSearch={setSearch}
                onAdd={() => router.push("#")}
            />
            <div className="mt-5 lg:mt-10">
                {
                    optimisticReservation.length === 0 && (
                        <div className="text-white/80">No reservations found</div>
                    )
                }

                <ReservationCards
                    reservations={optimisticReservation}
                    handleDelete={
                        (id: string) => setIsConfirm(id)
                    }
                />
            </div>
            <Pagination
                showPage={6}
                count={count}
            />
            <DeleteConfrim
                isOpen={!!isConfirm}
                handleCancel={
                    () => setIsConfirm("")
                }
                handleConfirm={handleDelete}
            />
        </div>
    )
}

export default ReservationClient;
