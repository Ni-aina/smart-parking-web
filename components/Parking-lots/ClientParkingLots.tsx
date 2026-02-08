"use client";

import { startTransition, useOptimistic, useState } from "react";
import Navbar from "../Navbar";
import { useRouter } from "next/navigation";
import { ParkingInterface } from "@/types/parking";
import ParkingCards from "./ParkingCards";
import { ProfileInterface } from "@/types/profile";
import { deleteParking } from "@/actions/parkingLots.action";
import Pagination from "../ui/pagination";
import DeleteConfrim from "../ui/deleteConfirm";

interface ClientParkingLotsInterface {
    parkings: ParkingInterface[];
    agents: ProfileInterface[];
    count: number;
}

const ClientParkingLots = ({
    parkings,
    agents,
    count
}: ClientParkingLotsInterface) => {
    const [search, setSearch] = useState("");
    const [isConfirm, setIsConfirm] = useState("");
    const router = useRouter();

    const [optimisticParkings, addOptimisticParkings] = useOptimistic(
        parkings,
        (currentParkings: ParkingInterface[], id: string) => (
            currentParkings.filter(item => item.id !== id)
        )
    )

    const title = "Parking lots";

    const agentsNamesMap = Object.fromEntries(agents.map(a => [a.id, a.fullName]));

    const handleEdit = (id: string) => {
        router.push(`/owner/parking-lots/form/${id}`);
    }

    const handleDelete = () => {
        if (!isConfirm) return;
        startTransition(() => {
            addOptimisticParkings(isConfirm);
            deleteParking(isConfirm);
        })
        setIsConfirm("");
    }

    return (
        <div className="flex flex-col gap-5">
            <Navbar
                title={title}
                search={search}
                setSearch={setSearch}
                onAdd={() => router.push("/owner/parking-lots/form/new")}
            />
            <div className="mt-5 lg:mt-10">
                <ParkingCards
                    parkings={optimisticParkings}
                    agentsNamesMap={agentsNamesMap}
                    onEdit={handleEdit}
                    onDelete={
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

export default ClientParkingLots;
