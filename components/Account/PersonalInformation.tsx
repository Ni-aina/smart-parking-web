"use client";

import "react-phone-number-input/style.css"
import PhoneInput from "react-phone-number-input"
import { PersonalInfoFormInterface } from "@/types/account";
import { Flag, Save } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, DragEvent, FormEvent } from "react";
import CustomButton from "../ui/customButton";

interface PersonalInformationInterface {
    formData: PersonalInfoFormInterface;
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
    imagePreview,
    isDragging,
    handleChange,
    handleImageChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleSubmit
}: PersonalInformationInterface) => {

    const {
        fullName,
        emailAddress,
        phoneNumber,
        urlImage
    } = formData;

    const displayImage = imagePreview || urlImage;

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
                                alt="Profile"
                                fill
                                className="object-cover"
                                sizes="80px"
                            /> :
                            <div className="w-full h-full bg-white/5 flex items-center justify-center 
                                text-xl uppercase"
                            >
                                {fullName?.charAt(0) || "?"}
                            </div>
                    }
                </label>
                <span className="text-xs">JPG, PNG or JPEG. 1MB max.</span>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="fullName">Full name *</label>
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
                <label htmlFor="emailAddress">Email address</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm 
                        opacity-50 cursor-not-allowed"
                    name="emailAddress"
                    type="email"
                    value={emailAddress}
                    disabled
                />
                <span className="text-xs">Email cannot be changed from here</span>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber">Phone number</label>
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
                    internationalIcon={() => <Flag className="w-5 h-5" />}
                />
            </div>
            <div className="lg:col-span-2 flex justify-end mt-3">
                <CustomButton
                    title="Save changes"
                    className="w-48"
                    Icon={Save}
                />
            </div>
        </form>
    )
}

export default PersonalInformation;
