"use client";

import {
    ChangeEvent,
    DragEvent,
    FormEvent,
    startTransition,
    useActionState,
    useEffect,
    useState
} from "react";
import {
    PersonalInfoFormInterface,
    SecurityFormInterface
} from "@/types/account";
import { updateAvatar, updateProfile } from "@/actions/profile.action";
import { updatePassword } from "@/actions/authServer.action";
import { logIn } from "@/actions/auth.action";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useProfileContext } from "@/context/ProfileContext";
import { useTranslation } from "@/context/LanguageContext";

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
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const { currentProfile } = useProfileContext();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [avatarState, setAvatarState] = useActionState(updateAvatar, initialProfileState)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [personalForm, setPersonalForm] = useState<PersonalInfoFormInterface>({
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        urlImage: ""
    })

    const [personalState, personalFormAction] = useActionState(updateProfile, initialProfileState);
    const [securityForm, setSecurityForm] = useState<SecurityFormInterface>(initSecurityForm);
    const [passwordState, setPasswordState] = useActionState(updatePassword, initialProfileState)

    const handlePersonalChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPersonalForm(prev => ({
            ...prev,
            [name]: value
        }))
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

    const handlePersonalSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (imageFile) {
            startTransition(() => {
                setAvatarState({ avatar: imageFile, urlImage: currentProfile?.urlImage || "" })
            })
        }

        const { phoneNumber } = personalForm;

        if (!isValidPhoneNumber(phoneNumber)) {
            toast.error(t("accountSettings.messages.invalidPhone"));
            return;
        }

        if (personalForm) {
            startTransition(() => {
                personalFormAction(personalForm);
                queryClient.invalidateQueries({ queryKey: ["current-profile"] })
            })
        }
    }

    const handleSecuritySubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { 
            currentPassword, 
            newPassword,
            confirmPassword 
        } = securityForm;

        if (!currentProfile) {
            toast.error(t("accountSettings.messages.authRequired"));
            return;
        }

        startTransition(async () => {
            const { user } = await logIn(currentProfile.emailAddress, currentPassword);
            
            if (!user) {
                toast.error(t("accountSettings.messages.currentPasswordIncorrect"));
                return;
            }

            startTransition(() => {
                setPasswordState({ 
                    oldPassword: currentPassword, 
                    newPassword, 
                    confirmPassword 
                })
                setSecurityForm(initSecurityForm)
            })
        })
    }

    useEffect(()=> {
        setPersonalForm({
            fullName: currentProfile?.fullName || "",
            emailAddress: currentProfile?.emailAddress || "",
            phoneNumber: currentProfile?.phoneNumber || "",
            urlImage: currentProfile?.urlImage || ""
        })
    }, [currentProfile])

    return {
        currentProfile,
        personalForm,
        avatarState,
        personalState,
        passwordState,
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
