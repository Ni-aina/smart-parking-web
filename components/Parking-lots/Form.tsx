"use client";

import { customCheckStyle } from "@/lib/customChexBoxStyle";
import { ParkingInterface } from "@/types/parking";
import { ProfileInterface } from "@/types/profile";
import { TypeInterface } from "@/types/type";
import {
    DollarSign,
    Loader2,
    PlusCircle,
    Search,
    Undo2,
    Upload,
    XCircle
} from "lucide-react";
import Image from "next/image";
import CustomButton from "../ui/customButton";
import useParkingForm from "@/hooks/forms/useParkingForm";
import Loading from "../ui/loading";
import InputNumber from "../ui/inputNumber";
import InputSelect from "../ui/inputSelect";
import { useTranslation } from "@/context/LanguageContext";

interface FormParkingLotsInterface {
    types: TypeInterface[];
    agents: ProfileInterface[];
    parking: ParkingInterface | null
}

const FormParkingLots = ({
    types,
    agents,
    parking
}: FormParkingLotsInterface) => {
    const { t } = useTranslation();

    const {
        selectTypes,
        formData,
        handleChange,
        agentsFiltered,
        agentSearch,
        setAgentSearch,
        handleAgentCheckedChange,
        images,
        isImagesPending,
        handleImagesChange,
        handleRemoveImage,
        isDragging,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleSubmit,
        isPending,
        handleCancel
    } = useParkingForm({
        agents,
        parking,
        types
    })

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
                <label htmlFor="name">{t("parkingLots.form.name")}</label>
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
                <label htmlFor="location">{t("parkingLots.form.location")}</label>
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
                <label htmlFor="typeId">{t("parkingLots.form.vehicleType")}</label>
                <InputSelect
                    name="typeId"
                    value={typeId}
                    handleChange={handleChange}
                    data={selectTypes}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="total-spots">{t("parkingLots.form.totalSpots")}</label>
                <InputNumber
                    name="totalSpots"
                    value={`${totalSpots}`}
                    handleChange={handleChange}
                    min={0}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="price-per-hour" className="flex items-center gap-2">
                    <DollarSign
                        size={16}
                        className="text-red-500"
                    />
                    <h1>
                        {t("parkingLots.form.pricePerHour")}
                    </h1>
                </label>
                <InputNumber
                    name="pricePerHour"
                    value={`${pricePerHour}`}
                    handleChange={handleChange}
                    min={0}
                />
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
                <h1>
                    {t("parkingLots.form.images")}{" "}
                    <span className="text-xs">{t("parkingLots.form.imageFormats")}</span>
                </h1>
                {
                    isImagesPending ?
                        <div
                            className={`
                                grid place-items-center w-full h-full min-h-50
                                bg-white/5 rounded-lg
                            `}
                        >
                            <Loader2
                                className="animate-spin"
                            />
                        </div>
                        :
                        images.length ?
                            <div
                                className={`
                                relative flex flex-wrap gap-3 w-full h-full min-h-50 
                                bg-white/5 rounded-lg p-5
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
                                w-full h-full min-h-50 
                                bg-white/5 rounded-lg
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
                <label htmlFor="agents">{t("parkingLots.form.agents")}</label>
                <div
                    className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-md"
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
                        placeholder={t("parkingLots.form.searchPlaceholder")}
                    />
                </div>
                <div className="flex flex-col gap-3 w-full max-h-80 overflow-y-scroll bg-white/10 rounded-lg p-5">
                    {
                        !agentsFiltered.length ?
                            <div className="w-full h-40 grid place-items-center">
                                <h1>
                                    {t("parkingLots.form.noResult")}
                                </h1>
                            </div>
                            :
                            agentsFiltered.map(item =>
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center gap-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className={customCheckStyle}
                                            checked={item.checked}
                                            onChange={() => handleAgentCheckedChange(item.id)}
                                        />
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
            <div className="hidden lg:flex justify-end gap-3 my-5 col-start-2">
                <CustomButton
                    title={t("parkingLots.form.cancel")}
                    type="button"
                    className="bg-white/10 text-white min-w-48"
                    Icon={Undo2}
                    onClick={handleCancel}
                />
                <CustomButton
                    title={parking ? t("parkingLots.form.update") : t("parkingLots.form.add")}
                    className="text-black min-w-48"
                    isPending={isPending}
                    Icon={Upload}
                />
            </div>
            <div className="lg:hidden my-5 space-y-3">
                <CustomButton
                    title={parking ? t("parkingLots.form.update") : t("parkingLots.form.add")}
                    className="text-black min-w-48"
                    isPending={isPending}
                    Icon={Upload}
                />
                <CustomButton
                    title={t("parkingLots.form.cancel")}
                    type="button"
                    className="bg-white/10 text-white min-w-48"
                    Icon={Undo2}
                    onClick={handleCancel}
                />
            </div>
        </form>
    )
}

export default FormParkingLots;
