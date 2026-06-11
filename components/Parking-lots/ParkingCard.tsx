"use client";

import Image from "next/image";
import { DollarSign, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface ParkingCardProps {
    id: string;
    urlImage: string;
    name: string;
    location: string;
    type: string;
    totalSpots: string;
    occupiedSpots: string;
    pricePerHour: string;
    agents: string;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const ParkingCard = ({
    id,
    urlImage,
    name,
    location,
    type,
    totalSpots,
    occupiedSpots,
    pricePerHour,
    agents,
    onEdit,
    onDelete
}: ParkingCardProps) => {
    const [loadingImage, setLoadingImage] = useState(true);

    return (
        <div className="flex flex-col bg-white/2.5 rounded-md p-4 text-white gap-4">
            <div className="flex gap-4">
                {
                    loadingImage &&
                    <Skeleton
                        className="flex-shrink-0 w-30 h-25 bg-white/10"
                    />
                }
                <div
                    className={
                        `
                            relative flex-shrink-0 rounded-md overflow-hidden
                            ${loadingImage ? "w-0 h-0" : "w-30 h-25"}
                        `
                    }
                >
                    <Image
                        src={urlImage || "/images/default-parking.jpg"}
                        alt={name}
                        fill
                        className="object-cover"
                        onLoadStart={
                            () => setLoadingImage(true)
                        }
                        onLoadingComplete={
                            () => setLoadingImage(false)
                        }
                    />
                </div>
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                    <div className="flex justify-between items-center gap-4">
                        <h2 className="font-semibold truncate">{name}</h2>
                        <p className="text-sm text-white">{type}</p>
                    </div>
                    <p className="text-sm text-white/60 truncate">{location}</p>
                    <div className="text-md">Agents</div>
                    <div className="truncate text-sm text-white/50">{agents || "—"}</div>
                </div>
            </div>
            <div className="mt-2 flex justify-between items-end gap-3">
                <div className="grid grid-cols-2 gap-2 text-sm text-white/70">
                    <div>
                        <div className="text-xs text-white/50">Capacity</div>
                        <div>{occupiedSpots} / {totalSpots}</div>
                    </div>
                    <div>
                        <div className="text-xs text-white/50">Price / hour</div>
                        <div className="flex items-center gap-1">
                            <DollarSign
                                size={16}
                                className="text-red-500"
                            />
                            <p className="text-white">
                                {pricePerHour}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Edit
                        className="text-green-500 cursor-pointer hover:scale-105"
                        onClick={() => onEdit(id)}
                        size={18}
                    />
                    <Trash2
                        size={20}
                        onClick={() => onDelete(id)}
                        className="text-red-500 cursor-pointer hover:scale-105"
                    />
                </div>
            </div>
        </div>
    )
}

export default ParkingCard;
