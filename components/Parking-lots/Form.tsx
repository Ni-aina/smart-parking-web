"use client";

import { customCheckStyle } from "@/lib/customChexBoxStyle";
import { ParkingInterface } from "@/types/parking";
import { ProfileInterface } from "@/types/profile";
import { TypeInterface } from "@/types/type";
import { ChevronDown, ChevronUp, PlusCircle, Search } from "lucide-react";
import Image from "next/image";

interface FormParkingLotsInterface {
    types: TypeInterface[];
    profiles: ProfileInterface[];
    parking: ParkingInterface | null
}

const FormParkingLots = ({
    types,
    profiles,
    parking
}: FormParkingLotsInterface) => {

    return (
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
                <label htmlFor="name">Parking name *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="name"
                    type="text"
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="location">Parking location *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="location"
                    type="text"
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="type">Vehicle type *</label>
                <div className="relative w-full">
                    <select
                        name="type"
                        id="type"
                        required
                        className="appearance-none w-full px-4 py-2 border border-white/10 rounded-sm cursor-pointer"
                    >
                        {
                            types.map(item =>
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.type} ({item.description})
                                </option>
                            )
                        }
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <ChevronDown
                            size={20}
                            className="text-red-500"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="total-spots">Total spots *</label>
                <div className="relative w-full">
                    <input
                        className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                        name="totalSpots"
                        type="number"
                        min={0}
                        required
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex flex-col justify-center">
                        <ChevronUp
                            size={16}
                            className="text-red-500"
                        />
                        <ChevronDown
                            size={16}
                            className="text-red-500 mt-[-5px]"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="price-per-hour">Price per hour</label>
                <div className="relative w-full">
                    <input
                        className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                        name="pricePerHour"
                        type="number"
                        min={0}
                        required
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex flex-col justify-center">
                        <ChevronUp
                            size={16}
                            className="text-red-500"
                        />
                        <ChevronDown
                            size={16}
                            className="text-red-500 mt-[-5px]"
                        />
                    </div>
                </div>
            </div>
            <div className="col-start-1 flex flex-col gap-2">
                <input
                    id="url-images"
                    className="hidden"
                    name="urlImages"
                    type="file"
                    multiple
                    required
                />
                <h1>Add an images *</h1>
                <div className="flex justify-center items-center 
                    w-full h-full min-h-[250px] bg-white/5 rounded-lg opacity-60">
                    <label htmlFor="url-images">
                        <PlusCircle
                            size={32}
                            className="text-red-500 cursor-pointer hover:opacity-80"
                        />
                    </label>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="agents">Agents *</label>
                <div
                    className="flex items-center gap-3 px-4 py-2 bg-black/5 rounded-md"
                >
                    <Search
                        size={16}
                        className="text-red-500"
                    />
                    <input
                        name="search"
                        type="text"
                        className="w-full outline-none"
                        placeholder="Search ..."
                    />
                </div>
                <div className="flex flex-col gap-3 w-full max-h-80 overflow-y-scroll bg-black/5 rounded-lg p-5">
                    {
                        profiles.map(item =>
                            <div
                                key={item.id}
                                className="flex justify-between items-center gap-3"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="mt-1 relative">
                                        <input
                                            type="checkbox"
                                            className={customCheckStyle}
                                        />
                                    </span>
                                    <h1>
                                        {item.fullName}
                                    </h1>
                                </div>
                                <Image
                                    src={item.urlImage || "/images/default-user.png"}
                                    alt={item.fullName}
                                    width={25}
                                    height={25}
                                    className="rounded-full"
                                />
                            </div>
                        )
                    }
                </div>
            </div>
        </form>
    )
}

export default FormParkingLots;