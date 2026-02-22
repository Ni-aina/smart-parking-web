"use client";

import { CreditCard, Landmark, User } from "lucide-react";
import useAccountSettings from "@/hooks/useAccountSettings";
import { AccountTabType } from "@/types/account";
import Loading from "../ui/loading";
import PersonalInformation from "./PersonalInformation";
import AccountSecurity from "./AccountSecurity";
import PaymentAccount from "./PaymentAccount";

const tabs: { key: AccountTabType; label: string; Icon: typeof User }[] = [
    { key: "personal", label: "Personal info", Icon: User },
    { key: "payment", label: "Payment account", Icon: CreditCard }
]

const AccountSettings = () => {
    const {
        isProfileLoading,
        personalForm,
        securityForm,
        imagePreview,
        isDragging,
        handlePersonalChange,
        handleSecurityChange,
        handleImageChange,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handlePersonalSubmit,
        handleSecuritySubmit
    } = useAccountSettings();

    if (isProfileLoading) return <Loading />;

    return (
        <div className="flex flex-col gap-5 text-white">
            <h1 className="font-semibold">Account settings</h1>
            <div className="mt-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="flex flex-col gap-5">
                        <div className="lg:col-span-2 flex items-center gap-3">
                            <User size={20} />
                            <h1 className="text-lg font-semibold">Personal information</h1>
                        </div>
                        <PersonalInformation
                            formData={personalForm}
                            imagePreview={imagePreview}
                            isDragging={isDragging}
                            handleChange={handlePersonalChange}
                            handleImageChange={handleImageChange}
                            handleDrop={handleDrop}
                            handleDragOver={handleDragOver}
                            handleDragLeave={handleDragLeave}
                            handleSubmit={handlePersonalSubmit}
                        />
                        <AccountSecurity
                            formData={securityForm}
                            handleChange={handleSecurityChange}
                            handleSubmit={handleSecuritySubmit}
                        />
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="lg:col-span-2 flex items-center gap-3">
                            <Landmark size={20} />
                            <h1 className="text-lg font-semibold">Bank account</h1>
                        </div>
                        <PaymentAccount />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountSettings;
