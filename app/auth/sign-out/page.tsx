"use client";

import { logOut } from "@/actions/auth.action";
import Loading from "@/components/ui/loading";
import { useEffect } from "react";

const signOut = () => {

    useEffect(() => {
        (async () => {
            await logOut()
            window.location.href = "/auth/sign-in"
        })()
    }, [])

    return (
        <div className="w-full h-dvh">
            <Loading />
        </div>
    )
}

export default signOut;