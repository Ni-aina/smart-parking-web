"use client";

import { createParkingLot, editParkingLot } from "@/actions/parkingLots.action";
import { SelectInterface } from "@/types/input";
import { LotInterface } from "@/types/lot";
import { ParkingInterface } from "@/types/parking";
import { ProfileInterface } from "@/types/profile";
import { TypeInterface } from "@/types/type";
import { urlToFile } from "@/utils/urlToFile";
import { useTranslation } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import {
    ChangeEvent,
    DragEvent,
    FormEvent,
    useEffect,
    useState
} from "react";

interface FormParkingLotsInterface {
    types: TypeInterface[];
    agents: ProfileInterface[];
    parking: (LotInterface | ParkingInterface) | null;
}

const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]

const useParkingForm = ({
    types,
    agents,
    parking
}: FormParkingLotsInterface) => {

    const router = useRouter();
    const { t } = useTranslation();
    const selectTypes = types.map(item => ({
        id: item.id,
        value: `
            ${item.vehicleType},
            ${t("parkingLots.form.maxWidth")}: ${item.maxWidth}, 
            ${t("parkingLots.form.maxLength")}: ${item.maxLength}
            ${t("parkingLots.form.maxHeight")}: ${item.maxHeight}
            ${item.description.trim() && `(${item.description})`}
        `
    }))

    const [agentSearch, setAgentSearch] = useState("");
    const [isPending, setIsPending] = useState(false);

    const [formData, setFormData] = useState<{
        id: string;
        name: string;
        location: string;
        locationLat: number | null;
        locationLng: number | null;
        typeId: string;
        totalSpots: number | string;
        pricePerHour: number | string;
    }>({
        id: parking?.id ? String(parking.id) : "",
        name: parking?.name || "",
        location: parking?.location || "",
        locationLat: parking && "locationLat" in parking && typeof parking.locationLat === "number" ? parking.locationLat : null,
        locationLng: parking && "locationLng" in parking && typeof parking.locationLng === "number" ? parking.locationLng : null,
        typeId: (parking && "lotType" in parking && parking.lotType?.id) || (parking && "typeId" in parking && String(parking.typeId)) || selectTypes.at(0)?.id || "",
        totalSpots: parking?.totalSpots || "",
        pricePerHour: parking?.pricePerHour || ""
    })

    const [agentsFormated, setAgentsFormated] = useState(agents.map(item => ({
        id: item.id || "",
        name: item.fullName || "",
        urlImage: item.urlImage || "/images/default-user.png",
        checked: parking && "agents" in parking && Array.isArray(parking.agents) ? parking.agents.includes(item.id) : false
    })))

    const agentsFiltered = agentsFormated.filter(item =>
        item.name.toLowerCase().includes(agentSearch.toLowerCase())
    )

    const [images, setImages] = useState<File[]>([]);
    const [isImagesPending, setIsImagesPending] = useState(true);
    const [isDragging, setIsDragging] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | SelectInterface) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleLocationSelect = ({
        address,
        lat,
        lng
    }: {
        address: string;
        lat: number;
        lng: number;
    }) => {
        setFormData(prev => ({
            ...prev,
            location: address,
            locationLat: lat,
            locationLng: lng
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
        })
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = async () => setIsDragging(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsPending(true);
            if (parking?.id) {
                const updatedParking = await editParkingLot({
                    ...formData,
                    agents: agentsFormated,
                    images,
                    location_lat: formData.locationLat,
                    location_lng: formData.locationLng
                }, parking.urlImages)

                if (!updatedParking) return;
                router.push("/owner/parking-lots");
                return;
            }
            const newParking = await createParkingLot({
                ...formData,
                agents: agentsFormated,
                images,
                location_lat: formData.locationLat,
                location_lng: formData.locationLng
            })
            if (!newParking) return;
            router.push("/owner/parking-lots");
        } catch {

        } finally {
            setIsPending(false);
        }
    }

    const handleCancel = () => {
        router.back()
    }

    useEffect(() => {
        (async () => {
            if (parking?.urlImages?.length) {
                const files = await Promise.all(parking.urlImages.map(url => urlToFile(url)));
                setImages(files);
            }
            setIsImagesPending(false);
        })()
    }, [parking]);

    return {
        formData,
        selectTypes,
        handleChange,
        handleLocationSelect,
        agentsFiltered,
        agentSearch,
        setAgentSearch,
        handleAgentCheckedChange,
        images,
        isImagesPending,
        handleImagesChange,
        isDragging,
        handleRemoveImage,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleSubmit,
        isPending,
        handleCancel
    }
}

export default useParkingForm
