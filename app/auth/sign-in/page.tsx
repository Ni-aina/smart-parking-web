"use client";

import { logIn } from "@/actions/auth.action";
import { Eye, EyeClosed, LoaderCircle, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleShowPassword = () => setShowPassword(prev => !prev);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const [email, password] = [formData.get("email")+"", formData.get("password")+""];
        if (!email || !password) return;
        try {
            setIsPending(true);
            await logIn(email, password);
        } catch {
            alert("Authentication failed");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="grid place-items-center w-full h-screen">
            <form
                className="flex flex-col space-y-3 w-xs lg:w-lg min-h-[70%] 
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
                <div className="flex flex-col gap-3">
                    <h1>Email</h1>
                    <input
                        type="email"
                        name="email"
                        className="p-2 focus-within:outline-none border border-white rounded-sm"
                        required
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <h1>Password</h1>
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
                <button
                    className="my-5 flex justify-center items-center gap-3 bg-blue-950/50 w-full py-2 rounded-sm 
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
                <div className="flex justify-end items-center gap-2">
                    <h1 className="text-sm">Don't have an account ?</h1>
                    <Link
                        href={"/auth/sign-up"}
                        className="text-sm text-white/70 hover:underline"
                    >
                        Create an account
                    </Link>
                </div>
                <div className="flex justify-end items-center gap-2">
                    <Link
                        href={"/auth/forgot-password"}
                        className="text-xs text-white/70 hover:underline"
                    >
                        Forgot password
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default SignIn;