"use client";

import { ReactNode } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { useProfileContext } from "@/context/ProfileContext";

const OwnerProtected = ({ children }: { children: ReactNode }) => {

    const { currentProfile } = useProfileContext();

    const authorization = currentProfile?.roles.includes("owner") || false;

    if (!authorization) return (
        <>
            <SidebarTrigger
                className="absolute top-0 left-0 text-white/80 cursor-pointer 
                        hover:text-white/80 hover:bg-transparent hover:opacity-80"
            />
            <div className="flex justify-center items-center w-full h-full 
                text-xs text-center text-white/80"
            >
                Access denied: Unauthorized role based
            </div>
        </>
    )

    return (
        <>
            {
                children
            }
        </>
    )
}

export default OwnerProtected;