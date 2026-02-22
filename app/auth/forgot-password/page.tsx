"use client";

import { resetPassword } from "@/actions/auth.action";
import {
    ArrowLeft,
    LoaderCircle,
    Mail,
    Send
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

const ForgotPassword = () => {
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const emailValue = formData.get("email") + "";
        if (!emailValue) return;
        try {
            setIsPending(true);
            setError("");
            await resetPassword(emailValue);
            setEmail(emailValue);
            setIsSuccess(true);
        } catch {
            setError("Failed to send reset link. Please try again.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="grid w-full h-dvh sm:place-items-center">
            <div
                className="flex flex-col space-y-4 text-white rounded-xl p-8
                sm:w-md sm:bg-white/5 sm:shadow-2xl"
            >
                <div className="flex lg:justify-center">
                    <div className="relative w-48 h-16">
                        <Image
                            src={"/images/smart-parking.png"}
                            alt="Smart parking"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                        />
                    </div>
                </div>
                {
                    isSuccess ?
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                                <Mail size={24} />
                            </div>
                            <h1 className="text-lg font-semibold text-center">
                                Check your email
                            </h1>
                            <p className="text-sm text-white/70 text-center">
                                We sent a password reset link to
                            </p>
                            <p className="text-sm font-semibold text-center">
                                {email}
                            </p>
                            <p className="text-xs text-white/50 text-center">
                                Didn't receive the email? Check your spam folder or
                            </p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="text-xs hover:underline cursor-pointer"
                            >
                                try another email address
                            </button>
                        </div>
                        :
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-lg font-semibold">Forgot password?</h1>
                                <p className="text-sm text-white/70">
                                    No worries, we'll send you a reset link.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h1 className="text-md font-semibold">Email</h1>
                                <input
                                    type="email"
                                    name="email"
                                    className="p-2 focus-within:outline-none border border-white rounded-sm"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <span className="text-xs text-red-400">{error}</span>
                            <button
                                className="mt-3 flex justify-center items-center gap-3 
                                bg-white text-black w-full py-2 rounded-sm 
                                cursor-pointer hover:opacity-80 
                                disabled:cursor-not-allowed disabled:opacity-80"
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
                                        <Send
                                            size={16}
                                            color="black"
                                        />
                                }
                                <h1>Send reset link</h1>
                            </button>
                        </form>
                }
                <div className="flex justify-center items-center gap-2">
                    <ArrowLeft size={14} />
                    <Link
                        href={"/auth/sign-in"}
                        className="text-sm hover:underline"
                    >
                        Back to sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;
