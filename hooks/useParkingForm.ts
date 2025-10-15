"use client";
import { createParkingLot, editParkingLot } from "@/actions/parkingLots.action";
import { ParkingInterface } from "@/types/parking";
import { ProfileInterface } from "@/types/profile";
import { TypeInterface } from "@/types/type";
import { getLatLng } from "@/utils/openstreetmap";
import { urlToFile } from "@/utils/urlToFile";
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
    parking: ParkingInterface | null
}

const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]

const useParkingForm = ({
    types,
    agents,
    parking
}: FormParkingLotsInterface) => {

    const router = useRouter();

    const [agentSearch, setAgentSearch] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState({
        id: parking?.id || "",
        name: parking?.name || "",
        location: parking?.location || "",
        typeId: parking?.vehicleType.id || types.at(0)?.id || "",
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
    const [isImagesPending, setIsImagesPending] = useState(true);
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
            const latLng = await getLatLng(formData.location);
            if (parking?.id) {
                const updatedParking = await editParkingLot({
                    ...formData,
                    agents: agentsFormated,
                    images,
                    location_lat: latLng.latitude,
                    location_lng: latLng.longitude
                }, parking.urlImages)

                if (!updatedParking) return;
                router.push("/owner/parking-lots");
                return;
            }
            const newParking = await createParkingLot({
                ...formData,
                agents: agentsFormated,
                images,
                location_lat: latLng.latitude,
                location_lng: latLng.longitude
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
        (async function () {
            if (parking?.urlImages?.length) {
                const files = await Promise.all(parking.urlImages.map(url => urlToFile(url)));
                setImages(files);
            }
            setIsImagesPending(false);
        })()
    }, [parking]);


    return {
        formData,
        handleChange,
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

export default useParkingForm;