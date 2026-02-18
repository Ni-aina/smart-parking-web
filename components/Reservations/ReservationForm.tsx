"use client";

import { ParkingInterface } from "@/types/parking";
import { ProfileInterface } from "@/types/profile";
import {
    DollarSign,
    Clock,
    Loader2,
    Undo2,
    Upload
} from "lucide-react";
import CustomButton from "../ui/customButton";
import InputSelect from "../ui/inputSelect";
import useReservationForm from "@/hooks/useReservationForm";
import useOccupancy from "@/hooks/useOccupancy";

interface ReservationFormInterface {
    parkingLots: ParkingInterface[];
    drivers: ProfileInterface[];
}

const ReservationForm = ({
    parkingLots,
    drivers
}: ReservationFormInterface) => {

    const {
        formData,
        handleChange,
        selectLots,
        selectDrivers,
        selectVehicles,
        isLoadingVehicles,
        pricePerHour,
        durationHours,
        amount,
        handleSubmit,
        isPending,
        error,
        handleCancel
    } = useReservationForm({
        parkingLots,
        drivers
    });

    const {
        lotId,
        driverId,
        vehicleId,
        startTime,
        endTime
    } = formData;

    const {
        availableSpots,
        isLoading: isLoadingOccupancy
    } = useOccupancy({
        lotId,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
    })

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {
                error &&
                <div className="lg:col-span-2 text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-sm">
                    {error}
                </div>
            }
            <div className="flex flex-col gap-2">
                <label htmlFor="lotId">Parking lot *</label>
                <InputSelect
                    name="lotId"
                    value={lotId}
                    handleChange={handleChange}
                    data={selectLots}
                    placeholder="Select a parking lot"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="driverId">Driver *</label>
                <InputSelect
                    name="driverId"
                    value={driverId}
                    handleChange={handleChange}
                    data={selectDrivers}
                    placeholder="Select a driver"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="vehicleId">Vehicle *</label>
                {
                    isLoadingVehicles ?
                        <div className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-sm text-white/40">
                            <Loader2 size={16} className="animate-spin" />
                            Loading vehicles...
                        </div>
                        :
                        selectVehicles.length ?
                            <InputSelect
                                name="vehicleId"
                                value={vehicleId}
                                handleChange={handleChange}
                                data={selectVehicles}
                                placeholder="Select a vehicle"
                            />
                            :
                            <div className="px-4 py-2 border border-white/10 rounded-sm text-white/40">
                                {driverId ? "No vehicles found for this driver" : "Select a driver first"}
                            </div>
                }
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="startTime">Start time *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="endTime">End time *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="endTime"
                    type="datetime-local"
                    value={endTime}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="">Available spots</h1>
                <div
                    className="w-full outline-none px-4 py-2 
                    rounded-sm bg-white/5 text-white/50"
                >
                    {
                        isLoadingOccupancy ?
                            <div className="flex items-center gap-2 text-white/40">
                                <Loader2 size={16} className="animate-spin" />
                                Checking availability...
                            </div>
                            :
                            availableSpots === 0 ?
                                <span className="text-red-500">
                                    No spots available for the selected time
                                </span>
                                :
                                <span>{availableSpots ?? "N/A"}</span>
                    }
                </div>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-4 bg-white/5 rounded-lg p-5">
                <h2 className="text-sm font-semibold uppercase text-white/50 tracking-wide">
                    Payment Summary (Cash)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-red-500" />
                        <span className="text-white/50">Rate:</span>
                        <span className="font-medium">${pricePerHour}/hr</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-white/50" />
                        <span className="text-white/50">Duration:</span>
                        <span className="font-medium">
                            {durationHours} hour{durationHours > 1 ? "s" : ""}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-red-500" />
                        <span className="text-white/50">Total:</span>
                        <span className="font-bold text-lg">${amount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex justify-end gap-3 my-5 col-start-2">
                <div>
                    <CustomButton
                        title="Cancel"
                        type="button"
                        className="bg-white/5 text-white w-56"
                        Icon={Undo2}
                        onClick={handleCancel}
                    />
                </div>
                <div>
                    <CustomButton
                        title="Create reservation"
                        className="w-56 text-black"
                        isPending={isPending}
                        Icon={Upload}
                        disabled={isLoadingOccupancy || availableSpots <= 0}
                    />
                </div>
            </div>
            <div className="lg:hidden my-5 space-y-3">
                <CustomButton
                    title="Create reservation"
                    className="w-56 text-black"
                    isPending={isPending}
                    Icon={Upload}
                    disabled={isLoadingOccupancy || availableSpots <= 0}
                />
                <CustomButton
                    title="Cancel"
                    type="button"
                    className="bg-white/5 text-white w-56"
                    Icon={Undo2}
                    onClick={handleCancel}
                />
            </div>
        </form>
    )
}

export default ReservationForm;
