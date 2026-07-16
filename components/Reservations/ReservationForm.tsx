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
import useReservationForm from "@/hooks/forms/useReservationForm";
import useOccupancy from "@/hooks/useOccupancy";
import { useTranslation } from "@/context/LanguageContext";

interface ReservationFormInterface {
    parkingLots: ParkingInterface[];
    drivers: ProfileInterface[];
}

const ReservationForm = ({
    parkingLots,
    drivers
}: ReservationFormInterface) => {
    const { t } = useTranslation();

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
    })

    const {
        lotId,
        driverId,
        vehicleId,
        startTime,
        endTime
    } = formData;

    const {
        availableSpots,
        isLoading: isLoadingOccupancy,
        error: occupancyError
    } = useOccupancy({
        lotId,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
    })

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {
                error  &&
                <div className="lg:col-span-2 text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-sm">
                    {error}
                </div>
            }
            {
                occupancyError  &&
                <div className="lg:col-span-2 text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-sm">
                    {occupancyError?.message || t("reservations.form.availabilityError")}
                </div>
            }
            <div className="flex flex-col gap-2">
                <label htmlFor="lotId">{t("reservations.form.parkingLot")}</label>
                <InputSelect
                    name="lotId"
                    value={lotId}
                    handleChange={handleChange}
                    data={selectLots}
                    placeholder={t("reservations.form.selectParkingLot")}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="driverId">{t("reservations.form.driver")}</label>
                <InputSelect
                    name="driverId"
                    value={driverId}
                    handleChange={handleChange}
                    data={selectDrivers}
                    placeholder={t("reservations.form.selectDriver")}
                    searchParamName="driver_name"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="vehicleId">{t("reservations.form.vehicle")}</label>
                {
                    isLoadingVehicles ?
                        <div className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-sm text-white/40">
                            <Loader2 size={16} className="animate-spin" />
                            {t("reservations.form.loadingVehicles")}
                        </div>
                        :
                        selectVehicles.length ?
                            <InputSelect
                                name="vehicleId"
                                value={vehicleId}
                                handleChange={handleChange}
                                data={selectVehicles}
                                placeholder={t("reservations.form.selectVehicle")}
                            />
                            :
                            <div className="px-4 py-2 border border-white/10 rounded-sm text-white/40">
                                {driverId ? t("reservations.form.noVehicles") : t("reservations.form.selectDriverFirst")}
                            </div>
                }
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="startTime">{t("reservations.form.startTime")}</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm
                                text-white
                                [&::-webkit-calendar-picker-indicator]:invert
                                [&::-webkit-calendar-picker-indicator]:opacity-70
                                [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    name="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="endTime">{t("reservations.form.endTime")}</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm
                                text-white
                                [&::-webkit-calendar-picker-indicator]:invert
                                [&::-webkit-calendar-picker-indicator]:opacity-70
                                [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    name="endTime"
                    type="datetime-local"
                    value={endTime}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="">{t("reservations.form.availableSpots")}</h1>
                <div
                    className="w-full outline-none px-4 py-2 
                    rounded-sm bg-white/10 text-white/50"
                >
                    {
                        isLoadingOccupancy ?
                            <div className="flex items-center gap-2 text-white/40">
                                <Loader2 size={16} className="animate-spin" />
                                {t("reservations.form.checkingAvailability")}
                            </div>
                            :
                            availableSpots === 0 ?
                                <span className="text-red-500">
                                    {t("reservations.form.noSpots")}
                                </span>
                                :
                                <span>{availableSpots ?? t("reservations.form.unavailable")}</span>
                    }
                </div>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-4 bg-white/10 rounded-lg p-5">
                <h2 className="text-sm font-semibold uppercase text-white/50 tracking-wide">
                    {t("reservations.form.paymentSummary")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-red-500" />
                        <span className="text-white/50">{t("reservations.form.rate")}</span>
                        <span className="font-medium">${pricePerHour}{t("reservations.form.perHour")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-white/50" />
                        <span className="text-white/50">{t("reservations.form.duration")}</span>
                        <span className="font-medium">
                            {durationHours} {t(durationHours > 1 ? "reservations.form.hours" : "reservations.form.hour")}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-red-500" />
                        <span className="text-white/50">{t("reservations.form.total")}</span>
                        <span className="font-bold text-lg">${amount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex justify-end gap-3 my-5 col-start-2">
                <div>
                    <CustomButton
                        title={t("reservations.actions.cancel")}
                        type="button"
                        className="bg-white/10 text-white w-56"
                        Icon={Undo2}
                        onClick={handleCancel}
                    />
                </div>
                <div>
                    <CustomButton
                        title={t("reservations.actions.create")}
                        className="w-56 text-black"
                        isPending={isPending}
                        Icon={Upload}
                        disabled={
                            isLoadingVehicles ||
                            isLoadingOccupancy ||
                            availableSpots <= 0
                        }
                    />
                </div>
            </div>
            <div className="lg:hidden my-5 space-y-3">
                <CustomButton
                    title={t("reservations.actions.create")}
                    className="w-56 text-black"
                    isPending={isPending}
                    Icon={Upload}
                    disabled={
                        isLoadingVehicles ||
                        isLoadingOccupancy ||
                        availableSpots <= 0
                    }
                />
                <CustomButton
                    title={t("reservations.actions.cancel")}
                    type="button"
                    className="bg-white/10 text-white w-56"
                    Icon={Undo2}
                    onClick={handleCancel}
                />
            </div>
        </form>
    )
}

export default ReservationForm;
