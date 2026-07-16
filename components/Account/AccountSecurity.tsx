"use client";

import { SecurityFormInterface } from "@/types/account";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import CustomButton from "../ui/customButton";
import { ProfileStateInterface } from "@/hooks/useAccountSettings";
import SubmitForm from "../ui/submitForm";
import { useTranslation } from "@/context/LanguageContext";
import { translateAccountMessage } from "@/utils/messages/accountSettingsMessages";

interface AccountSecurityInterface {
    formData: SecurityFormInterface;
    passwordState: ProfileStateInterface;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const PasswordInput = ({
    name,
    value,
    label,
    placeholder,
    onChange
}: {
    name: string;
    value: string;
    label: string;
    placeholder?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name}>{label}</label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required
                    placeholder={placeholder}
                    className="w-full outline-none px-4 py-2 pr-10 border border-white/10 rounded-sm"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 
                        cursor-pointer hover:opacity-80"
                >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    )
}

const AccountSecurity = ({
    formData,
    passwordState,
    handleChange,
    handleSubmit
}: AccountSecurityInterface) => {

    const { t } = useTranslation();
    const [stateVisible, setStateVisible] = useState(false);

    const {
        currentPassword,
        newPassword,
        confirmPassword
    } = formData;

    useEffect(() => {
        if (passwordState.error) {
            setStateVisible(true);
        }
        if (passwordState.success) {
            setStateVisible(true);
        }
    }, [passwordState])

    useEffect(() => {
        if (!stateVisible) return;

        const timer = setTimeout(() => {
            setStateVisible(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, [stateVisible])

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
        >
            <PasswordInput
                name="currentPassword"
                value={currentPassword}
                label={t("accountSettings.security.currentPassword")}
                placeholder={t("accountSettings.security.currentPasswordPlaceholder")}
                onChange={handleChange}
            />
            <PasswordInput
                name="newPassword"
                value={newPassword}
                label={t("accountSettings.security.newPassword")}
                placeholder={t("accountSettings.security.newPasswordPlaceholder")}
                onChange={handleChange}
            />
            <PasswordInput
                name="confirmPassword"
                value={confirmPassword}
                label={t("accountSettings.security.confirmPassword")}
                placeholder={t("accountSettings.security.confirmPasswordPlaceholder")}
                onChange={handleChange}
            />
            <div className="lg:col-span-2 text-xs">
                {t("accountSettings.security.passwordHelp")}
            </div>
            {
                stateVisible && passwordState.error &&
                <div className="lg:col-span-2 text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-sm">
                    {translateAccountMessage(t, passwordState.error)}
                </div>
            }
            {
                stateVisible && passwordState.success &&
                <div className="lg:col-span-2 text-green-500 text-sm bg-green-500/10 px-4 py-2 rounded-sm">
                    {translateAccountMessage(t, passwordState.success)}
                </div>
            }
            <div className="lg:col-span-2 flex justify-end mt-3">
                <SubmitForm
                    pendingMessage={t("accountSettings.security.updatingPassword")}
                >
                    <CustomButton
                        title={t("accountSettings.security.updatePassword")}
                        className="w-48"
                        Icon={ShieldCheck}
                    />
                </SubmitForm>
            </div>
        </form>
    )
}

export default AccountSecurity;
