"use client";

import { PlusCircle } from "lucide-react";

const FormParkingLots = ({ id }: { id: string | null }) => {

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
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="type"
                    type="text"
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="agents">Agents *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="agents"
                    type="text"
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="total-spots">Total spots *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="totalSpots"
                    type="number"
                    min={0}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="price-per-hour">Price per hour</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="pricePerHour"
                    type="number"
                    min={0}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
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
                    w-full h-[300px] bg-white/5 rounded-lg opacity-60">
                    <label htmlFor="url-images">
                        <PlusCircle
                            size={32}
                            className="cursor-pointer hover:opacity-80"
                        />
                    </label>
                </div>
            </div>
        </form>
    )
}

export default FormParkingLots;