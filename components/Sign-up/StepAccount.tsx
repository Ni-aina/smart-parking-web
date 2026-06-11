"use client";

import "react-phone-number-input/style.css";
import { SignUpForm } from "@/types/auth";
import { Eye, EyeClosed, Flag } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { useTranslation } from "@/context/LanguageContext";

interface StepAccountProps {
    form: SignUpForm
    setForm: Dispatch<SetStateAction<SignUpForm>>
    showPassword: boolean;
    handleShowPassword: () => void
}

const StepAccount = ({
    form,
    setForm,
    showPassword,
    handleShowPassword
}: StepAccountProps) => {
    const { t } = useTranslation()

    const {
        name,
        email,
        phone,
        password,
        confirmPassword
    } = form

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
                <h1 className="text-md font-semibold">
                    {
                        t("auth.fields.fullName")
                    }
                </h1>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="p-2 focus-within:outline-none border border-white/10 rounded-sm"
                    required
                />
            </div>
            <div className="flex flex-col gap-3">
                <h1 className="text-md font-semibold">
                    {
                        t("auth.email")
                    }
                </h1>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="p-2 focus-within:outline-none border border-white/10 rounded-sm"
                    required
                />
            </div>
            <div className="flex flex-col gap-3">
                <h1 className="text-md font-semibold">
                    {
                        t("auth.password")
                    }
                </h1>
                <div className="flex items-center gap-2 w-full p-2 rounded-sm border border-white/10">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        className="w-full focus-within:outline-none"
                        required
                    />
                    <div className="w-6 cursor-pointer">
                        {
                            showPassword ?
                                <Eye
                                    onClick={handleShowPassword}
                                    size={16}
                                /> :
                                <EyeClosed
                                    onClick={handleShowPassword}
                                    size={16}
                                />
                        }
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <h1 className="text-md font-semibold">
                    {
                        t("auth.fields.confirmPassword")
                    }
                </h1>
                <div className="flex items-center gap-2 w-full p-2 rounded-sm border border-white/10">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                        className="w-full focus-within:outline-none"
                        required
                    />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <h1 className="text-md font-semibold">
                    {
                        t("auth.fields.phoneNumber")
                    }
                </h1>
                <PhoneInputWithCountrySelect
                    defaultCountry="US"
                    value={phone}
                    onChange={value => {
                        setForm(f => ({ ...f, phone: value || "" }))
                    }}
                    className="flex items-center w-full border border-white/10 rounded-sm px-3 py-2 bg-transparent"
                    countrySelectProps={{
                        className: "bg-black text-white p-2"
                    }}
                    numberInputProps={{
                        className: "outline-none bg-transparent"
                    }}
                    internationalIcon={() => <Flag className="w-5 h-5" />}
                />
            </div>
        </div>
    )
}

export default StepAccount
