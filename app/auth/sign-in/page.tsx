"use client";

import { logIn } from "@/actions/auth.action";
import {
    Eye,
    EyeClosed,
    LoaderCircle,
    LogIn
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useTranslation } from "@/context/LanguageContext";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isPending, setIsPending] = useState(false)
    const { t } = useTranslation()

    const handleShowPassword = () => {
        setShowPassword(prev => !prev)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const [email, password] = [formData.get("email") + "", formData.get("password") + ""]
        if (!email || !password) {
            return
        }
        try {
            setIsPending(true)
            setError("")
            const { session } = await logIn(email, password)
            if (!session) {
                throw new Error()
            }
        } catch {
            setError(t("auth.failedAuth"))
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="grid w-full h-dvh sm:place-items-center">
            <form
                className="flex flex-col space-y-4 text-white rounded-xl p-8 sm:w-md sm:bg-white/5 sm:shadow-2xl"
                onSubmit={handleSubmit}
            >
                <div className="flex lg:justify-center">
                    <Link
                        href="/"
                        className="relative w-48 h-16 hover:opacity-80 transition-opacity"
                    >
                        <Image
                            src="/images/smart-parking.png"
                            alt="Smart parking"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                        />
                    </Link>
                </div>
                <div className="mt-3 flex flex-col gap-3">
                    <h1 className="text-md font-semibold">
                        {
                            t("auth.email")
                        }
                    </h1>
                    <input
                        type="email"
                        name="email"
                        className="p-2 focus-within:outline-none border border-white rounded-sm"
                        required
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <h1 className="text-md font-semibold">
                        {
                            t("auth.password")
                        }
                    </h1>
                    <div className="flex items-center gap-2 w-full p-2 rounded-sm border border-white">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="flex-1 focus-within:outline-none"
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
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <span className="text-xs text-red-400">{error}</span>
                    <div className="flex justify-end items-center gap-2">
                        <Link
                            href="/auth/forgot-password"
                            className="text-xs hover:underline"
                        >
                            {
                                t("auth.forgotPassword")
                            }
                        </Link>
                    </div>
                </div>
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
                            <LogIn
                                size={16}
                                color="black"
                            />
                    }
                    <h1>
                        {
                            t("auth.login")
                        }
                    </h1>
                </button>
                <div className="flex flex-wrap justify-end items-center gap-2">
                    <h1 className="text-sm">
                        {
                            t("auth.dontHaveAccount")
                        }
                    </h1>
                    <Link
                        href="/auth/sign-up"
                        className="text-sm hover:underline"
                    >
                        {
                            t("auth.createAccount")
                        }
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default SignIn