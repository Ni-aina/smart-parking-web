"use client";

import { ReservationInterface } from "@/types/reservation";
import { PaymentInterface } from "@/types/payment";
import { cancelReservation } from "@/actions/reservations.action";
import {
    getDateFormat,
    getTimeFormat,
    calculateDurationHours
} from "@/utils/DateTimeAction";
import {
    Calendar,
    Clock,
    User,
    CarFront,
    MapPin,
    DollarSign,
    CreditCard,
    Ban
} from "lucide-react";
import Image from "next/image";
import { startTransition, useOptimistic, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import CancelConfirm from "../ui/cancelConfirm";
import { useTranslation } from "@/context/LanguageContext";

interface ReservationDetailProps {
    reservation: ReservationInterface;
    payment: PaymentInterface | null;
}

const statusStyles: Record<string, string> = {
    active: "text-green-500 bg-green-500/10 border-green-500/20",
    pending: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    cancelled: "text-red-500 bg-red-500/10 border-red-500/20",
    completed: "text-white/70 bg-white/10 border-white/10"
}

const paymentStatusStyles: Record<string, string> = {
    succeeded: "text-green-500 bg-green-500/10",
    pending: "text-blue-500 bg-blue-500/10",
    failed: "text-red-500 bg-red-500/10"
}

const isCancellable = (status: string) =>
    status === "pending" || status === "active";

const ReservationDetail = ({
    reservation,
    payment
}: ReservationDetailProps) => {
    const [loadingImage, setLoadingImage] = useState(true);
    const [cancellingId, setCancellingId] = useState("");
    const { t } = useTranslation();

    const [optimisticReservation, setOptimisticReservation] = useOptimistic(
        reservation,
        (_current: ReservationInterface, updated: Partial<ReservationInterface>) =>
            ({ ..._current, ...updated })
    )

    const {
        id,
        lot,
        vehicle,
        driver,
        status,
        startTime,
        endTime,
        createdAt
    } = optimisticReservation;

    const durationHours = calculateDurationHours(startTime, endTime);
    const totalAmount = lot.pricePerHour * durationHours;
    const statusLabel = t(`reservations.status.${status}`);
    const paymentStatusLabel = payment ? t(`reservations.status.${payment.status}`) : "";

    const imageSrc = lot.urlImages?.[0] || "/images/default-parking.jpg";

    const handleCancel = async () => {
        if (!cancellingId) return;

        startTransition(() => {
            setOptimisticReservation({ status: "cancelled" });
            cancelReservation(cancellingId);
        })

        setCancellingId("");
    }

    return (
        <>
            <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span
                            className={
                                `text-sm font-medium capitalize px-4 py-1.5 rounded-full border
                                ${statusStyles[status] || "text-white bg-white/10 border-white/10"}`
                            }
                        >
                            {statusLabel}
                        </span>
                        {
                            createdAt &&
                            <span className="text-xs text-white/40">
                                {t("reservations.detail.created")} {getDateFormat(new Date(createdAt))}
                            </span>
                        }
                    </div>
                    <div className="flex items-center gap-2">
                        {
                            isCancellable(status) &&
                            <button
                                className="flex items-center gap-2 px-4 py-2 text-sm
                                    bg-red-500/10 text-red-500 hover:bg-red-500/20 
                                    rounded-sm cursor-pointer transition-colors"
                                onClick={() => setCancellingId(id)}
                                type="button"
                            >
                                <Ban size={16} className="text-red-500" />
                                {t("reservations.actions.cancel")}
                            </button>
                        }
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 flex flex-col gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-5">
                        <h2 className="text-sm font-semibold uppercase text-white/50 tracking-wide">
                            {t("reservations.detail.parkingLot")}
                        </h2>
                        <div className="relative w-full h-40 rounded-md overflow-hidden">
                            {
                                loadingImage &&
                                <Skeleton className="w-full h-full bg-white/10" />
                            }
                            <Image
                                src={imageSrc}
                                alt={lot.name || t("reservations.detail.parkingLotAlt")}
                                fill
                                className="object-cover"
                                onLoadStart={() => setLoadingImage(true)}
                                onLoadingComplete={() => setLoadingImage(false)}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <h3 className="text-lg font-semibold">{lot.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <MapPin size={16} />
                                <span>{lot.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <DollarSign size={16} />
                                <span>${lot.pricePerHour} {t("reservations.form.perHour")}</span>
                            </div>
                            {
                                lot.lotType?.vehicleType &&
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <CarFront size={16} />
                                    <span>{lot.lotType.vehicleType}</span>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
                            <h2 className="text-sm font-semibold uppercase text-white/50 tracking-wide mb-4">
                                {t("reservations.detail.schedule")}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoBlock
                                    icon={<Calendar size={16} />}
                                    label={t("reservations.detail.arrival")}
                                    value={`${getDateFormat(new Date(startTime))} ${t("reservations.detail.at")} ${getTimeFormat(new Date(startTime))}`}
                                />
                                <InfoBlock
                                    icon={<Calendar size={16} />}
                                    label={t("reservations.detail.exit")}
                                    value={`${getDateFormat(new Date(endTime))} ${t("reservations.detail.at")} ${getTimeFormat(new Date(endTime))}`}
                                />
                                <InfoBlock
                                    icon={<Clock size={16} />}
                                    label={t("reservations.detail.duration")}
                                    value={`${durationHours} ${t(durationHours > 1 ? "reservations.form.hours" : "reservations.form.hour")}`}
                                />
                                <InfoBlock
                                    icon={<DollarSign size={16} />}
                                    label={t("reservations.detail.totalEstimate")}
                                    value={`$${totalAmount.toFixed(2)}`}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
                                <h2 className="text-sm font-semibold uppercase text-white/50 tracking-wide mb-4">
                                    {t("reservations.detail.driver")}
                                </h2>
                                <div className="flex flex-col gap-3">
                                    <InfoBlock
                                        icon={<User size={16} />}
                                        label={t("reservations.detail.fullName")}
                                        value={driver.fullName}
                                    />
                                    {
                                        driver.emailAddress &&
                                        <InfoBlock
                                            icon={<CreditCard size={16} />}
                                            label={t("reservations.detail.email")}
                                            value={driver.emailAddress}
                                        />
                                    }
                                    {
                                        driver.phoneNumber &&
                                        <InfoBlock
                                            icon={<CreditCard size={16} />}
                                            label={t("reservations.detail.phone")}
                                            value={driver.phoneNumber}
                                        />
                                    }
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
                                <h2 className="text-sm font-semibold uppercase text-white/50 tracking-wide mb-4">
                                    {t("reservations.detail.vehicle")}
                                </h2>
                                <div className="flex flex-col gap-3">
                                    <InfoBlock
                                        icon={<CarFront size={16} />}
                                        label={t("reservations.detail.plateNumber")}
                                        value={vehicle.plateNumber}
                                    />
                                    {
                                        vehicle.make &&
                                        <InfoBlock
                                            icon={<CarFront size={16} />}
                                            label={t("reservations.detail.vehicle")}
                                            value={`${vehicle.make} ${vehicle.model || ""}`}
                                        />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
                            <h2 className="text-sm font-semibold uppercase text-white/50 tracking-wide mb-4">
                                {t("reservations.detail.payment")}
                            </h2>
                            {
                                payment ?
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoBlock
                                            icon={<DollarSign size={16} />}
                                            label={t("reservations.detail.amount")}
                                            value={`$${Number(payment.amount).toFixed(2)}`}
                                        />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-white/40 uppercase tracking-wide">
                                                {t("reservations.detail.status")}
                                            </span>
                                            <span
                                                className={
                                                    `text-sm font-medium capitalize px-3 py-1 rounded-full w-fit
                                                    ${paymentStatusStyles[payment.status] || "text-white bg-white/10"}`
                                                }
                                            >
                                                {paymentStatusLabel}
                                            </span>
                                        </div>
                                        <InfoBlock
                                            icon={<CreditCard size={16} />}
                                            label={t("reservations.detail.method")}
                                            value={payment.method || t("reservations.detail.cash")}
                                        />
                                        {
                                            payment.transactionId &&
                                            <InfoBlock
                                                icon={<CreditCard size={16} />}
                                                label={t("reservations.detail.transactionId")}
                                                value={payment.transactionId}
                                            />
                                        }
                                        {
                                            payment.createdAt &&
                                            <InfoBlock
                                                icon={<Calendar size={16} />}
                                                label={t("reservations.detail.paymentDate")}
                                                value={getDateFormat(new Date(payment.createdAt))}
                                            />
                                        }
                                    </div>
                                    :
                                    <p className="text-sm text-white/40">
                                        {t("reservations.detail.noPayment")}
                                    </p>

                            }
                        </div>
                    </div>
                </div>
            </div>

            <CancelConfirm
                isOpen={!!cancellingId}
                handleCancel={() => setCancellingId("")}
                handleConfirm={handleCancel}
            />
        </>
    )
}

const InfoBlock = ({
    icon,
    label,
    value
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs text-white/40 uppercase tracking-wide">
            {label}
        </span>
        <div className="flex items-center gap-2 text-sm">
            <span className="text-white/50">{icon}</span>
            <span className="text-white/80">{value}</span>
        </div>
    </div>
)

export default ReservationDetail;
