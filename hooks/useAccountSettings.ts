"use client";

import {
    ChangeEvent,
    DragEvent,
    FormEvent,
    startTransition,
    useActionState,
    useState
} from "react";
import useCurrentProfile from "./useCurrentProfile";
import {
    PersonalInfoFormInterface,
    SecurityFormInterface
} from "@/types/account";
import { updateAvatar, updateProfile } from "@/actions/profile.action";
import { toast } from "sonner";

export interface ProfileStateInterface {
    error: string | null,
    success: string | null
}

const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]

const initSecurityForm = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
}

const initialProfileState: ProfileStateInterface = {
    error: null,
    success: null
}

const useAccountSettings = () => {
    const { currentProfile, isPending: isProfileLoading } = useCurrentProfile();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [avatarState, setAvatarState] = useActionState(updateAvatar, initialProfileState)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [personalForm, setPersonalForm] = useState<PersonalInfoFormInterface | null>(null);
    const [personalState, personalFormAction] = useActionState(updateProfile, initialProfileState);
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

        if (file) {
            setImageFile(file);
            previewFile(file);
        }
    }

    const handleDrop = (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (!files.length) return;
        const file = Array.from(files).find(f =>
            allowedTypes.includes(f.type)
        )
        if (file) {
            setImageFile(file);
            previewFile(file);
        }
    }

    const handleDragOver = (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = async () => setIsDragging(false);

    const handleRemoveImage = () => setImagePreview(null);

    const handlePersonalSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (imageFile) {
            startTransition(() => setAvatarState({ avatar: imageFile, urlImage: currentProfile?.urlImage || "" }))
        }

        if (personalForm) {
            startTransition(() => personalFormAction(personalForm));
        }
    }

    const handleSecuritySubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return {
        currentProfile,
        isProfileLoading,
        personalForm: getPersonalForm(),
        avatarState,
        personalState,
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

