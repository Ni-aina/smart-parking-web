"use client";

import { createReservation } from "@/actions/reservations.action";
import { getVehiclesByDriverId } from "@/actions/vehicle.action";
import { SelectInterface } from "@/types/input";
import { ParkingInterface } from "@/types/parking";
import { ProfileInterface } from "@/types/profile";
import { VehicleInterface } from "@/types/vehicle";
import { calculateDurationHours } from "@/utils/DateTimeAction";
import { useRouter } from "next/navigation";
import {
    ChangeEvent,
    FormEvent,
    useLayoutEffect,
    useState
} from "react";

interface UseReservationFormInterface {
    parkingLots: ParkingInterface[];
    drivers: ProfileInterface[];
}

const toDateTimeLocal = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
}

const useReservationForm = ({
    parkingLots,
    drivers
}: UseReservationFormInterface) => {

    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");

    const now = new Date();
    const defaultEnd = new Date(now);
    defaultEnd.setHours(now.getHours() + 1);

    const selectLots = parkingLots.map(item => ({
        id: item.id,
        value: `${item.name} — ${item.location} ($${item.pricePerHour}/hr)`
    }))

    const selectDrivers = drivers.map(item => ({
        id: item.id,
        value: item.fullName
    }))

    const [vehicles, setVehicles] = useState<VehicleInterface[]>([]);
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);

    const selectVehicles = vehicles.map(item => ({
        id: item.id,
        value: `${item.plateNumber} — ${item.make} ${item.model}`
    }))

    const [formData, setFormData] = useState({
        lotId: selectLots.at(0)?.id || "",
        driverId: selectDrivers.at(0)?.id || "",
        vehicleId: "",
        startTime: toDateTimeLocal(now),
        endTime: toDateTimeLocal(defaultEnd)
    })

    const {
        driverId
    } = formData;

    const selectedLot = parkingLots.find(l => l.id === formData.lotId);
    const pricePerHour = selectedLot?.pricePerHour || 0;

    const durationHours = (() => {
        try {
            return calculateDurationHours(formData.startTime, formData.endTime);
        } catch {
            return 0;
        }
    })()

    const amount = pricePerHour * durationHours;

    const handleChange = (e: ChangeEvent<HTMLInputElement> | SelectInterface) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsPending(true);
            setError("");

            if (!formData.lotId) throw new Error("Please select a parking lot");
            if (!formData.driverId) throw new Error("Please select a driver");
            if (!formData.vehicleId) throw new Error("Please select a vehicle");

            const startDate = new Date(formData.startTime);
            const endDate = new Date(formData.endTime);

            if (startDate > endDate) {
                throw new Error("Start time must be before end time");
            }

            const newReservation = await createReservation({
                lotId: formData.lotId,
                driverId: formData.driverId,
                vehicleId: formData.vehicleId,
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                amount
            });

            if (!newReservation) return;
            router.push("/owner/reservations");
        } catch (err: any) {
            setError(err?.message || "An error occurred");
        } finally {
            setIsPending(false);
        }
    }

    const handleCancel = () => {
        router.back();
    }

    useLayoutEffect(() => {
        if (!driverId) {
            setVehicles([]);
            setFormData(prev => ({ ...prev, vehicleId: "" }));
            return;
        }

        (async function () {
            setIsLoadingVehicles(true);
            try {
                const driverVehicles = await getVehiclesByDriverId(driverId);
                setVehicles(driverVehicles);
                setFormData(prev => ({
                    ...prev,
                    vehicleId: driverVehicles.at(0)?.id || ""
                }));
            } catch {
                setVehicles([]);
            } finally {
                setIsLoadingVehicles(false);
            }
        })()
    }, [driverId]);

    return {
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
    }
}

export default useReservationForm;
