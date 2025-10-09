"use client";

import { customCheckStyle } from "@/lib/customChexBoxStyle";
import { ParkingInterface } from "@/types/parking";
import { ProfileInterface } from "@/types/profile";
import { TypeInterface } from "@/types/type";
import {
    ChevronDown,
    ChevronUp,
    Edit,
    PlusCircle,
    Search
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

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
    const [agentSearch, setAgentSearch] = useState("");
    const [formData, setFormData] = useState({
        id: parking?.id || "",
        name: parking?.name || "",
        location: parking?.location || "",
        typeId: parking?.typeId || types.at(0)?.id || "",
        totalSpots: parking?.totalSpots || "",
        pricePerHour: parking?.pricePerHour || ""
    })

    const [agents, setAgents] = useState(profiles.map(item => ({
        id: item.id || "",
        name: item.fullName || "",
        urlImage: item.urlImage || "/images/default-user.png",
        checked: parking?.agents.includes(item.id) || false
    })))

    const agentsFiltered = agents.filter(item =>
        item.name.toLowerCase().includes(agentSearch.toLowerCase())
    )

    const [urlImages, setUrlImages] = useState<FileList | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAgentCheckedChange = (id: string) => {
        setAgents(prev => prev.map(item => item.id !== id ? item : {
            ...item,
            checked: !item.checked
        }))
    }

    const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        setUrlImages(files);
    }

    const {
        name,
        location,
        typeId,
        pricePerHour,
        totalSpots
    } = formData;

    return (
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
                <label htmlFor="name">Parking name *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="name"
                    type="text"
                    value={name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="location">Parking location *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="location"
                    type="text"
                    value={location}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="typeId">Vehicle type *</label>
                <div className="relative w-full">
                    <select
                        name="typeId"
                        id="typeId"
                        value={typeId}
                        onChange={handleChange}
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
                        value={totalSpots}
                        onChange={handleChange}
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
                        value={pricePerHour}
                        onChange={handleChange}
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
                    onChange={handleImagesChange}
                    multiple
                    required
                />
                <h1>Images *</h1>
                {
                    urlImages ?
                        <div
                            className="relative flex flex-wrap gap-3 w-full h-full min-h-60 bg-black/5 rounded-xl p-5"
                        >
                            <div className="absolute top-3 right-3">
                                <label htmlFor="url-images">
                                    <Edit
                                        size={16}
                                        className="text-red-500 cursor-pointer hover:opacity-80"
                                    />
                                </label>
                            </div>
                            <div className="lg:max-h-0">
                                <div className="flex flex-wrap gap-3">
                                    {
                                        Array.from({ length: urlImages.length }, (_, i) =>
                                            <Image
                                                key={i}
                                                src={URL.createObjectURL(urlImages[i])}
                                                alt={urlImages[i].name}
                                                width={100}
                                                height={100}
                                                className="rounded-sm"
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        :
                        <div
                            className="flex justify-center items-center 
                            w-full h-full min-h-60 bg-black/5 rounded-xl"
                        >

                            <label htmlFor="url-images">
                                <PlusCircle
                                    size={32}
                                    className="text-red-500 cursor-pointer hover:opacity-80"
                                />
                            </label>
                        </div>
                }
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
                        value={agentSearch}
                        onChange={e => setAgentSearch(e.target.value)}
                        className="w-full outline-none"
                        placeholder="Search ..."
                    />
                </div>
                <div className="flex flex-col gap-3 w-full max-h-80 overflow-y-scroll bg-black/5 rounded-lg p-5">
                    {
                        !agentsFiltered.length ?
                            <div className="w-full h-40 grid place-items-center">
                                <h1>
                                    No result
                                </h1>
                            </div>
                            :
                            agentsFiltered.map(item =>
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center gap-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="mt-1 relative">
                                            <input
                                                type="checkbox"
                                                className={customCheckStyle}
                                                checked={item.checked}
                                                onChange={() => handleAgentCheckedChange(item.id)}
                                            />
                                        </span>
                                        <h1 className="capitalize">
                                            {item.name}
                                        </h1>
                                    </div>
                                    <Image
                                        src={item.urlImage}
                                        alt={item.name}
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