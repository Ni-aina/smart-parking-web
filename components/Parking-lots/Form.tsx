"use client";

import { customCheckStyle } from "@/lib/customChexBoxStyle";
import { ParkingInterface } from "@/types/parking";
import { ProfileInterface } from "@/types/profile";
import { TypeInterface } from "@/types/type";
import {
    ChevronDown,
    ChevronUp,
    DollarSign,
    PlusCircle,
    Search,
    XCircle
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, DragEvent, FormEvent, useState } from "react";
import CustomButton from "../ui/customButton";

interface FormParkingLotsInterface {
    types: TypeInterface[];
    agents: ProfileInterface[];
    parking: ParkingInterface | null
}

const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]

const FormParkingLots = ({
    types,
    agents,
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

    const [agentsFormated, setAgentsFormated] = useState(agents.map(item => ({
        id: item.id || "",
        name: item.fullName || "",
        urlImage: item.urlImage || "/images/default-user.png",
        checked: parking?.agents.includes(item.id) || false
    })))

    const agentsFiltered = agentsFormated.filter(item =>
        item.name.toLowerCase().includes(agentSearch.toLowerCase())
    )

    const [images, setImages] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAgentCheckedChange = (id: string) => {
        setAgentsFormated(prev => prev.map(item => item.id !== id ? item : {
            ...item,
            checked: !item.checked
        }))
    }

    const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        const newFiles = Array.from(files);
        const allowedFiles = newFiles.filter(f =>
            allowedTypes.includes(f.type)
        )

        setImages(prev => {
            const existing = new Set(prev.map(f => `${f.name}-${f.size}`));
            const uniqueNew = allowedFiles.filter(f => !existing.has(`${f.name}-${f.size}`));
            return [...prev, ...uniqueNew];
        });
    }

    const handleRemoveImage = (id: number) => {
        setImages(prev => prev?.filter((_, i) => i !== id))
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (!files.length) return;
        const newFiles = Array.from(files);
        const allowedFiles = newFiles.filter(f =>
            allowedTypes.includes(f.type)
        )

        setImages(prev => {
            const existing = new Set(prev.map(f => `${f.name}-${f.size}`));
            const uniqueNew = allowedFiles.filter(f => !existing.has(`${f.name}-${f.size}`));
            return [...prev, ...uniqueNew];
        });
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = () => setIsDragging(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData, agentsFormated, images);
    }

    const {
        name,
        location,
        typeId,
        pricePerHour,
        totalSpots
    } = formData;

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                <div className="relative w-full px-4 py-2 border border-white/10 rounded-sm">
                    <select
                        name="typeId"
                        id="typeId"
                        value={typeId}
                        onChange={handleChange}
                        required
                        className="appearance-none w-11/12 truncate cursor-pointer"
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
                <label htmlFor="price-per-hour" className="flex items-center gap-2">
                    <DollarSign
                        size={16}
                        className="text-red-500"
                    />
                    <h1>
                        Price/hour *
                    </h1>
                </label>
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
            <div className="lg:col-start-1 lg:min-h-80 min-h-40 flex flex-col gap-2">
                <input
                    id="url-images"
                    className="hidden"
                    type="file"
                    onChange={handleImagesChange}
                    accept="image/png, image/jpg, image/jpeg"
                    multiple
                />
                <h1>Images <span className="text-xs">(png, jpg, jpeg)</span></h1>
                {
                    images.length ?
                        <div
                            className={`
                                relative flex flex-wrap gap-3 w-full h-full bg-black/5 rounded-xl p-5
                                ${isDragging && "opacity-70"}    
                            `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="absolute top-3 right-3">
                                <label htmlFor="url-images">
                                    <PlusCircle
                                        size={20}
                                        className="text-red-500 cursor-pointer hover:opacity-80"
                                    />
                                </label>
                            </div>
                            <div className="lg:max-h-0">
                                <div className="flex flex-wrap gap-3">
                                    {
                                        Array.from({ length: images.length }, (_, i) =>
                                            <div
                                                key={i}
                                                className="relative w-15 h-15 rounded-sm"
                                            >
                                                <Image
                                                    src={URL.createObjectURL(images[i])}
                                                    alt={images[i].name}
                                                    fill
                                                    className="object-cover rounded-sm"
                                                />
                                                <XCircle
                                                    size={16}
                                                    className="absolute top-1 right-1 cursor-pointer hover:opacity-80"
                                                    onClick={() => handleRemoveImage(i)}
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        :
                        <div
                            className={`
                                flex justify-center items-center 
                                w-full h-full bg-black/5 rounded-xl
                                ${isDragging && "opacity-70"}
                            `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
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
            <div className="mb-5 lg:col-start-2 flex justify-end">
                <CustomButton
                    title="Add new parking"
                    isPending={false}
                />
            </div>
        </form>
    )
}

export default FormParkingLots;