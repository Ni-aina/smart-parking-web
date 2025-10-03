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

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleShowPassword = () => setShowPassword(prev => !prev);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const [email, password] = [formData.get("email") + "", formData.get("password") + ""];
        if (!email || !password) return;
        try {
            setIsPending(true);
            const { session } = await logIn(email, password);
            if (!session) throw new Error();
            setError("");
        } catch {
            setError("Failed authentication");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="grid place-items-center w-full h-screen">
            <form
                className="flex flex-col space-y-4 w-xs lg:w-lg min-h-[70%] 
                bg-blue-950/10 text-white rounded-xl shadow-2xl p-8"
                onSubmit={handleSubmit}
            >
                <div className="flex justify-center">
                    <div className="flex items-center gap-3">
                        <Image
                            src={"/images/smart-parking.png"}
                            alt="Smart parking"
                            width={40}
                            height={40}
                        />
                        <h1 className="text-xl italic">Smart Parking</h1>
                    </div>
                </div>
                <div className="mt-3 flex flex-col gap-3">
                    <h1 className="text-md font-semibold">Email</h1>
                    <input
                        type="email"
                        name="email"
                        className="p-2 focus-within:outline-none border border-white rounded-sm"
                        required
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <h1 className="text-md font-semibold">Password</h1>
                    <div className="flex items-center gap-2 w-full p-2 rounded-sm border border-white">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="flex-1 focus-within:outline-none"
                            required
                        />
                        <div className="w-[24px] cursor-pointer">
                            {
                                showPassword ?
                                    <Eye onClick={handleShowPassword} size={16} /> :
                                    <EyeClosed onClick={handleShowPassword} size={16} />
                            }
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center gap-2">
                    <Link
                        href={"/auth/forgot-password"}
                        className="text-xs text-blue-300 hover:underline"
                    >
                        Forgot password
                    </Link>
                </div>
                <button
                    className="mt-3 flex justify-center items-center gap-3 bg-blue-950/15 w-full py-2 rounded-sm 
                    cursor-pointer hover:opacity-80 
                    disabled:cursor-not-allowed disabled:opacity-80"
                    disabled={isPending}
                >
                    {
                        isPending ?
                            <LoaderCircle
                                size={16}
                                color="white"
                                className="animate-spin"
                            />
                            :
                            <LogIn
                                size={16}
                                color="white"
                            />
                    }
                    <h1>Login</h1>
                </button>
                <div className="flex flex-wrap justify-center lg:justify-between items-center gap-3">
                    <span className="text-xs text-red-400">{error}</span>
                    <div className="flex flex-wrap justify-center lg:justify-end items-center gap-2">
                        <h1 className="text-sm">Don't have an account ?</h1>
                        <Link
                            href={"/auth/sign-up"}
                            className="text-sm text-blue-300 hover:underline"
                        >
                            Create an account
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SignIn;