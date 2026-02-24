"use client";

import {
    ChangeEvent,
    DragEvent,
    FormEvent,
    useState
} from "react";
import useCurrentProfile from "./useCurrentProfile";
import {
    PersonalInfoFormInterface,
    SecurityFormInterface
} from "@/types/account";

const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]

const initSecurityForm = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
}

const useAccountSettings = () => {
    const { currentProfile, isPending: isProfileLoading } = useCurrentProfile();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [personalForm, setPersonalForm] = useState<PersonalInfoFormInterface | null>(null);
    const [securityForm, setSecurityForm] = useState<SecurityFormInterface>(initSecurityForm);

    const getPersonalForm = (): PersonalInfoFormInterface => {
        if (personalForm) return personalForm;
        return {
            fullName: currentProfile?.fullName || "",
            emailAddress: currentProfile?.emailAddress || "",
            phoneNumber: currentProfile?.phoneNumber || "",
            urlImage: currentProfile?.urlImage || ""
        }
    }

    const handlePersonalChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const current = getPersonalForm();
        setPersonalForm({
            ...current,
            [name]: value
        })
    }

    const handleSecurityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSecurityForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const previewFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        const file = Array.from(files).find(f =>
            allowedTypes.includes(f.type)
        )
        if (file) previewFile(file)
    }

    const handleDrop = (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (!files.length) return;
        const file = Array.from(files).find(f =>
            allowedTypes.includes(f.type)
        )
        if (file) previewFile(file)
    }

    const handleDragOver = (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = async () => setIsDragging(false);

    const handleRemoveImage = () => setImagePreview(null);

    const handlePersonalSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    const handleSecuritySubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return {
        currentProfile,
        isProfileLoading,
        personalForm: getPersonalForm(),
        securityForm,
        imagePreview,
        isDragging,
        handlePersonalChange,
        handleSecurityChange,
        handleImageChange,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleRemoveImage,
        handlePersonalSubmit,
        handleSecuritySubmit
    }
}

export default useAccountSettings;
