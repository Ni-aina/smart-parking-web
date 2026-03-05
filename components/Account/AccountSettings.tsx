"use client";

import { Landmark, Lock, Sparkles, User } from "lucide-react";
import useAccountSettings from "@/hooks/useAccountSettings";
import Loading from "../ui/loading";
import PersonalInformation from "./PersonalInformation";
import AccountSecurity from "./AccountSecurity";
import PaymentAccount from "./PaymentAccount";
import { BankAccountInterface } from "@/types/payment";
import { SubscriptionInterface, SubscriptionPlanInterface } from "@/types/subscription";
import SubscriptionPage from "../Subscription/SubscriptionPage";

const AccountSettings = ({
    paymentAccount,
    plans,
    currentSubscription
}: {
    paymentAccount: BankAccountInterface | null;
    plans: SubscriptionPlanInterface[];
    currentSubscription: SubscriptionInterface | null;
}) => {
    const {
        isProfileLoading,
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
        handlePersonalSubmit,
        handleSecuritySubmit
    } = useAccountSettings();

    if (isProfileLoading) return <Loading />

    return (
        <div className="flex flex-col gap-5 text-white">
            <h1 className="font-semibold">Account settings</h1>
            <div className="my-5 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <User size={20} />
                            <h1 className="text-lg font-semibold">Personal information</h1>
                        </div>
                        <PersonalInformation
                            formData={personalForm}
                            avatarState={avatarState}
                            personalState={personalState}
                            imagePreview={imagePreview}
                            isDragging={isDragging}
                            handleChange={handlePersonalChange}
                            handleImageChange={handleImageChange}
                            handleDrop={handleDrop}
                            handleDragOver={handleDragOver}
                            handleDragLeave={handleDragLeave}
                            handleSubmit={handlePersonalSubmit}
                        />
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <Sparkles size={20} />
                            <h1 className="text-lg font-semibold">Subscription</h1>
                        </div>
                        <SubscriptionPage
                            plans={plans}
                            currentSubscription={currentSubscription}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <Lock size={20} />
                            <h1 className="text-lg font-semibold">Account security</h1>
                        </div>
                        <AccountSecurity
                            formData={securityForm}
                            passwordState={passwordState}
                            handleChange={handleSecurityChange}
                            handleSubmit={handleSecuritySubmit}
                        />
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <Landmark size={20} />
                            <h1 className="text-lg font-semibold">Bank account</h1>
                        </div>
                        <PaymentAccount
                            paymentAccount={paymentAccount}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountSettings;
