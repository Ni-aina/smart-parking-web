"use client";

import { confirmResetPassword } from "@/actions/auth.action";
import { useTranslation } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase/client";
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

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
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-semibold">{label}</label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    required
                    placeholder={placeholder}
                    className="w-full outline-none px-4 py-2 pr-10 border border-white/10 rounded-sm"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-80"
                >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    )
}

const ResetPasswordPage = () => {
    const router = useRouter()
    const { t } = useTranslation()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isValidSession, setIsValidSession] = useState(true)

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                setIsValidSession(false)
            }
        }
        checkSession()
    }, [])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError(t("resetPassword.passwordsDoNotMatch"))
            return
        }

        try {
            setIsPending(true)
            setError("")
            await confirmResetPassword(password)
            setIsSuccess(true)
            setTimeout(() => {
                supabase.auth.signOut()
                router.push("/auth/sign-in")
            }, 2000)
        } catch {
            setError(t("resetPassword.errorUpdate"))
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="grid w-full h-dvh sm:place-items-center">
            <div className="flex flex-col space-y-4 text-white rounded-xl p-8 sm:w-md sm:bg-white/10 sm:shadow-2xl">
                <div className="flex lg:justify-center">
                    <div className="relative w-48 h-16">
                        <Image
                            src="/images/smart-parking.png"
                            alt="Smart parking"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                        />
                    </div>
                </div>
                {
                    !isValidSession ?
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            <h1 className="text-lg font-semibold">
                                {t("resetPassword.errorUpdate")}
                            </h1>
                            <Link
                                href="/auth/forgot-password"
                                className="text-xs hover:underline"
                            >
                                {t("forgot.tryAnother")}
                            </Link>
                        </div>
                        : isSuccess ?
                            <div className="flex flex-col items-center gap-4 py-4 text-center">
                                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                                    <CheckCircle size={24} />
                                </div>
                                <p className="text-sm font-semibold">
                                    {t("resetPassword.successMessage")}
                                </p>
                            </div>
                            :
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col space-y-4"
                            >
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-lg font-semibold">
                                        {t("resetPassword.title")}
                                    </h1>
                                    <p className="text-sm text-white/70">
                                        {t("resetPassword.desc")}
                                    </p>
                                </div>
                                <PasswordInput
                                    name="newPassword"
                                    value={password}
                                    label={t("resetPassword.newPassword")}
                                    placeholder={t("resetPassword.placeholderNew")}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <PasswordInput
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    label={t("resetPassword.confirmPassword")}
                                    placeholder={t("resetPassword.placeholderConfirm")}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                                {error && <span className="text-xs text-red-400">{error}</span>}
                                <button
                                    className="mt-3 flex justify-center items-center gap-3 bg-white text-black w-full py-2 rounded-sm cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-80"
                                    disabled={isPending}
                                >
                                    {
                                        isPending ?
                                            <LoaderCircle
                                                size={16}
                                                color="black"
                                                className="animate-spin"
                                            />
                                            :
                                            <Lock
                                                size={16}
                                                color="black"
                                            />
                                    }
                                    <span>{t("resetPassword.updateButton")}</span>
                                </button>
                            </form>
                }
                <div className="flex justify-center items-center gap-2">
                    <ArrowLeft size={14} />
                    <Link
                        href="/auth/sign-in"
                        className="text-sm hover:underline"
                    >
                        {t("resetPassword.backToSignIn")}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordPage;
