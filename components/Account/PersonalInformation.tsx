"use client";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { PersonalInfoFormInterface } from "@/types/account";
import { Flag, Save } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, DragEvent, FormEvent, useEffect, useState } from "react";
import CustomButton from "../ui/customButton";
import { ProfileStateInterface } from "@/hooks/useAccountSettings";
import SubmitForm from "../ui/submitForm";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { useTranslation } from "@/context/LanguageContext";
import { translateAccountMessage } from "@/utils/accountSettingsMessages";

interface PersonalInformationInterface {
    formData: PersonalInfoFormInterface;
    avatarState: ProfileStateInterface;
    personalState: ProfileStateInterface;
    imagePreview: string | null;
    isDragging: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleDrop: (e: DragEvent<HTMLElement>) => void;
    handleDragOver: (e: DragEvent<HTMLElement>) => void;
    handleDragLeave: () => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const PersonalInformation = ({
    formData,
    avatarState,
    personalState,
    imagePreview,
    isDragging,
    handleChange,
    handleImageChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleSubmit
}: PersonalInformationInterface) => {

    const { t } = useTranslation();
    const [state, setState] = useState<ProfileStateInterface | null>(null);

    const {
        fullName,
        emailAddress,
        phoneNumber,
        urlImage
    } = formData;

    const displayImage = imagePreview || urlImage;

    useEffect(() => {
        if (avatarState.error) {
            setState(avatarState);
        }
        if (avatarState.success) {
            setState(avatarState);
        }
    }, [avatarState])

    useEffect(() => {
        if (personalState.error) {
            setState(personalState);
        }
        if (personalState.success) {
            setState(personalState);
        }
    }, [personalState])

    useEffect(() => {
        if (!state) return;

        const timeVisibility = setTimeout(() => {
            setState(null);
        }, 4000);

        return () => clearTimeout(timeVisibility);
    }, [state])

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
        >
            <div className="flex items-center gap-5">
                <input
                    id="profile-image"
                    className="hidden"
                    type="file"
                    onChange={handleImageChange}
                    accept="image/png, image/jpg, image/jpeg"
                />
                <label
                    htmlFor="profile-image"
                    className={`
                        relative w-20 h-20 rounded-full overflow-hidden border border-white/10
                        cursor-pointer hover:opacity-80
                        ${isDragging && "opacity-70"}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {
                        displayImage ?
                            <Image
                                src={displayImage}
                                alt={t("accountSettings.personal.profileAlt")}
                                fill
                                className="object-cover"
                                sizes="80px"
                            /> :
                            <div className="w-full h-full bg-white/10 flex items-center justify-center 
                                text-xl uppercase"
                            >
                                {fullName?.charAt(0) || "?"}
                            </div>
                    }
                </label>
                <div className="flex flex-col gap-3">
                    <span className="text-xs">
                        {t("accountSettings.personal.imageHelp")}
                    </span>
                    <LanguageSwitcher />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="fullName">{t("accountSettings.personal.fullName")}</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="emailAddress">{t("accountSettings.personal.emailAddress")}</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm 
                        opacity-50 cursor-not-allowed"
                    name="emailAddress"
                    type="email"
                    value={emailAddress}
                    disabled
                />
                <span className="text-xs">
                    {t("accountSettings.personal.emailLocked")}
                </span>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber">{t("accountSettings.personal.phoneNumber")}</label>
                <PhoneInput
                    defaultCountry="US"
                    value={phoneNumber}
                    onChange={value => {
                        handleChange({ target: { name: "phoneNumber", value: value || "" } } as ChangeEvent<HTMLInputElement>)
                    }}
                    className="
                        flex items-center w-full 
                        border border-white/10 
                        rounded-sm 
                        px-3 py-2 
                        bg-transparent
                    "
                    countrySelectProps={{
                        className: "bg-black text-white p-2"
                    }}
                    numberInputProps={{
                        className: "outline-none bg-transparent"
                    }}
                    internationalIcon={() => <Flag className="w-5 h-5" />}
                />
            </div>
            {
                state?.error &&
                <div className="lg:col-span-2 text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-sm">
                    {translateAccountMessage(t, state.error)}
                </div>
            }
            {
                state?.success &&
                <div className="lg:col-span-2 text-green-500 text-sm bg-green-500/10 px-4 py-2 rounded-sm">
                    {translateAccountMessage(t, state.success)}
                </div>
            }
            <div className="lg:col-span-2 flex justify-end mt-3">
                <SubmitForm
                    pendingMessage={t("accountSettings.personal.savingProfile")}
                >
                    <CustomButton
                        title={t("accountSettings.personal.saveChanges")}
                        className="w-48"
                        Icon={Save}
                    />
                </SubmitForm>
            </div>
        </form>
    )
}

export default PersonalInformation;
