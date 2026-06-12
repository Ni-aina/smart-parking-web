"use client";

import { startTransition, useOptimistic, useState } from "react";
import Navbar from "../Layouts/Navbar";
import { useRouter } from "next/navigation";
import { ParkingInterface } from "@/types/parking";
import ParkingCards from "./ParkingCards";
import { ProfileInterface } from "@/types/profile";
import { deleteParking } from "@/actions/parkingLots.action";
import Pagination from "../ui/pagination";
import DeleteConfirm from "../ui/deleteConfirm";
import NoData from "../ui/noData";
import { useTranslation } from "@/context/LanguageContext";

interface ClientParkingLotsInterface {
    parkings: ParkingInterface[];
    agents: ProfileInterface[];
    count: number;
    searchTerm: string;
}

const ClientParkingLots = ({
    parkings,
    agents,
    count,
    searchTerm
}: ClientParkingLotsInterface) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState(searchTerm);
    const [isConfirm, setIsConfirm] = useState("");
    const router = useRouter();

    const [optimisticParkings, addOptimisticParkings] = useOptimistic(
        parkings,
        (currentParkings: ParkingInterface[], id: string) => (
            currentParkings.filter(item => item.id !== id)
        )
    )
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
                title={t("parkingLots.title")}
                search={search}
                setSearch={setSearch}
                onAdd={() => router.push("/owner/parking-lots/form/new")}
                listTitle={t("parkingLots.listTitle")}
                searchPlaceholder={t("parkingLots.searchPlaceholder")}
                addLabel={t("parkingLots.addNew")}
                loadingLabel={t("parkingLots.loadingData")}
            />
            <div className="mt-5 lg:mt-10">
                {
                    !count ?
                        <NoData
                            message={t("parkingLots.noData")}
                        />
                    :
                        <ParkingCards
                            parkings={optimisticParkings}
                            agentsNamesMap={agentsNamesMap}
                            onEdit={handleEdit}
                            onDelete={
                                (id: string) => setIsConfirm(id)
                            }
                        />
                }
            </div>
            <Pagination
                showPage={6}
                count={count}
            />
            <DeleteConfirm
                isOpen={!!isConfirm}
                handleCancel={
                    () => setIsConfirm("")
                }
                handleConfirm={handleDelete}
                title={t("parkingLots.confirm.title")}
                message={t("parkingLots.confirm.message")}
                cancelLabel={t("parkingLots.confirm.cancel")}
                confirmLabel={t("parkingLots.confirm.confirm")}
            />
        </div>
    )
}

export default ClientParkingLots;
