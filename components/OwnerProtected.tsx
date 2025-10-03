"use client";

import useCurrentProfile from "@/hooks/useCurrentProfile";
import { ReactNode } from "react";
import Loading from "./ui/loading";

const OwnerProtected = ({ children }: { children: ReactNode }) => {

    const {
        currentProfile,
        isPending
    } = useCurrentProfile();

    if (isPending) return <Loading />

    const authorization = currentProfile?.roles.includes("owner") || false;

    if (!authorization) return (
        <div className="flex justify-center items-center w-full h-full 
            text-xs text-center text-white/80"
        >
            Access denied: Unauthorized role based
        </div>
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