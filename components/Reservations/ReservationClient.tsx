"use client";

import { useRouter } from "next/navigation";
import Navbar from "../Layouts/Navbar";
import { ReservationInterface } from "@/types/reservation";
import ReservationCards from "./ReservationCards";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import Pagination from "../ui/pagination";
import CancelConfirm from "../ui/cancelConfirm";
import { cancelReservation, revalidateLotsReservations } from "@/actions/reservations.action";
import { supabase } from "@/lib/supabase/client";
import { useProfileContext } from "@/context/ProfileContext";
import NoData from "../ui/noData";
import { useTranslation } from "@/context/LanguageContext";

interface ReservationClientProps {
    reservations: ReservationInterface[];
    count: number;
    searchTerm: string;
}

const ReservationClient = ({
    reservations,
    count,
    searchTerm
}: ReservationClientProps) => {
    const { currentProfile } = useProfileContext();
    const { t } = useTranslation();
    const profileId = currentProfile?.id!;

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

    useEffect(()=> {
        const channel = supabase.channel(`reservations-channel-${profileId}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, 
            async () => {
            await revalidateLotsReservations()
        }).subscribe()
        
        return () => {
            channel.unsubscribe();
        }
    }, [profileId])

    return (
        <div className="flex flex-col gap-5">
            <Navbar
                title={t("reservations.title")}
                search={search}
                setSearch={setSearch}
                onAdd={() => router.push("/owner/reservations/form")}
                listTitle={t("reservations.listTitle")}
                searchPlaceholder={t("reservations.searchPlaceholder")}
                addLabel={t("reservations.addNew")}
            />
            <div className="mt-5 lg:mt-10">
                {
                    !count ?
                        <NoData
                            message={t("reservations.noData")}
                        />
                    :
                        <ReservationCards
                            reservations={optimisticReservations}
                            handleCancel={
                                (id: string) => setCancellingId(id)
                            }
                        />
                }

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
