"use client";

import { Eye, EyeClosed } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword(prev => !prev);

    return (
        <div className="grid place-items-center w-full h-screen">
            <div className="flex flex-col space-y-5 w-xs lg:w-lg min-h-[70%] bg-blue-950/10 text-white rounded-xl shadow-2xl p-8">
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
                    <input type="email" className="p-2 focus-within:outline-none border border-white rounded-sm" />
                </div>
                <div className="flex flex-col gap-3">
                    <h1>Password</h1>
                    <div className="flex items-center gap-2 w-full p-2 rounded-sm border border-white">
                        <input type={showPassword ? "text" : "password"} className="flex-1 focus-within:outline-none" />
                        <div className="w-[24px] cursor-pointer">
                            {
                                showPassword ?
                                    <Eye onClick={handleShowPassword} size={16} /> :
                                    <EyeClosed onClick={handleShowPassword} size={16} />
                            }
                        </div>
                    </div>
                </div>
                <button className="mt-2 bg-blue-950/50 w-full py-2 rounded-sm cursor-pointer hover:opacity-80">
                    Login
                </button>
            </div>
        </div>
    )
}

export default SignIn;