"use client";

import { useRouter } from "next/navigation";
import Navbar from "../Navbar";
import { ReservationInterface } from "@/types/reservation";
import ReservationCards from "./ReservationCards";
import { useState } from "react";

interface ReservationClientProps {
    reservations: ReservationInterface[]
}

const title = "Reservations";

const ReservationClient = ({
    reservations
}: ReservationClientProps) => {
    const router = useRouter();
    const [search, setSearch] = useState<string>("");

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
                    reservations.length === 0 && (
                        <div className="text-white/80">No reservations found</div>
                    )
                }

                <ReservationCards reservations={reservations} />
            </div>
        </div>
    )
}

export default ReservationClient;
