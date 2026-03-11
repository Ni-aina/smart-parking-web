"use client";

import { useEffect } from "react";
import ParkingCard from "./ParkingCard";
import { ParkingInterface } from "@/types/parking";
import { supabase } from "@/lib/supabase/client";
import { useProfileContext } from "@/context/ProfileContext";
import { revalidateLotsReservations } from "@/actions/reservations.action";

interface ParkingCardsProps {
    parkings: ParkingInterface[];
    agentsNamesMap: Record<string, string>;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const ParkingCards = ({ parkings, agentsNamesMap, onEdit, onDelete }: ParkingCardsProps) => {
    const { currentProfile } = useProfileContext();
    const profileId = currentProfile?.id!;

    useEffect(()=> {
        const channel = supabase.channel(`lots-occupancy-channel-${profileId}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, 
            async () => {
            await revalidateLotsReservations()
        }).subscribe()
        
        return () => {
            channel.unsubscribe();
        }
    }, [profileId])
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {
                parkings.map(item => (
                    <ParkingCard
                        key={item.id}
                        id={item.id}
                        urlImage={item.urlImages?.at(0) || "/images/default-parking.jpg"}
                        name={item.name}
                        location={item.location}
                        type={item.lotType?.vehicleType || "—"}
                        totalSpots={String(item.totalSpots)}
                        occupiedSpots={String(item.occupiedSpots)}
                        pricePerHour={String(item.pricePerHour)}
                        agents={(item.agents || []).map(a => agentsNamesMap[a]).filter(Boolean).join(", ")}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))
            }
        </div>
    )
}

export default ParkingCards;
