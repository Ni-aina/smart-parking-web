"use client";

import { startTransition, useOptimistic, useState } from "react";
import Navbar from "../Navbar";
import { useRouter } from "next/navigation";
import { ParkingInterface } from "@/types/parking";
import Table from "../Table";
import { ProfileInterface } from "@/types/profile";
import { deleteParking } from "@/actions/parkingLots.action";

interface ClientParkingLotsInterface {
    parkings: ParkingInterface[],
    agents: ProfileInterface[]
}

const ClientParkingLots = ({
    parkings,
    agents
}: ClientParkingLotsInterface) => {
    const [search, setSearch] = useState("");
    const router = useRouter();

    const [optimisticParkings, addOptimisticParkings] = useOptimistic(
        parkings,
        (currentParkings: ParkingInterface[], id: string) => (
            currentParkings.filter(item => item.id !== id)
        )
    )

    const title = "Parking lots";

    const headers = [
        "Image",
        "Name",
        "Location",
        "Lot Type",
        "Total spots",
        "Occupied sopts",
        "Price / hour",
        "Agents"
    ]

    const body = {
        rows: optimisticParkings.map(item => ({
            id: item.id,
            urlImage: item.urlImages.at(0) || "/images/default-parking.png",
            name: item.name,
            location: item.location,
            type: item.lotType.vehicle_type,
            totalSpots: item.totalSpots + "",
            occupiedSpots: item.occupiedSpots + "",
            pricePerHour: item.pricePerHour + "",
            agents: agents.filter(agent => item.agents.includes(agent.id))
            .map(item =>item.fullName)
            .join(", ")
        })),
        cols: [
            "urlImage",
            "name",
            "location",
            "type",
            "totalSpots",
            "occupiedSpots",
            "pricePerHour",
            "agents"
        ]
    }

    const handleEdit = (id: string)=> {
        router.push(`/owner/parking-lots/form/${id}`);
    }

    const handleDelete = (id: string)=> {
        startTransition(()=> {
            addOptimisticParkings(id);
            deleteParking(id);
        })
    }

    return (
        <div className="flex flex-col gap-5">
            <Navbar
                title={title}
                search={search}
                setSearch={setSearch}
                onAdd={()=> router.push("/owner/parking-lots/form/new")}
            />
            <Table
                title={title}
                headers={headers}
                body={body}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </div>
    )
}

export default ClientParkingLots;