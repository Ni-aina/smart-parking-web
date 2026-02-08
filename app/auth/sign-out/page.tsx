"use client";

import { logOut } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const signOut = () => {
    useEffect(()=> {
        (async ()=> {
            await logOut();
            redirect("/auth/sign-in");
        })()
    }, [])
    return (
        <div>
            <div 
                className="flex items-center justify-center h-screen bg-black/95"
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="mb-8 flex justify-center">
                        <div 
                            className="animate-spin rounded-full h-12 w-12 
                            border-b-2 border-white"
                        />
                    </div>
                    <p className="text-white text-lg font-semibold">
                        Signing you out...
                    </p>
                    <p className="text-slate-300 text-sm mt-2">
                        Redirecting shortly
                    </p>
                </div>
            </div>
        </div>
    )
}
 
export default signOut;