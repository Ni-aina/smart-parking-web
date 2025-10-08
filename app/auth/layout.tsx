"use client";

import { useAuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const { user } = useAuthContext();

    if (user) return redirect("/owner/dashboard");

    return (
        <>
            {children}
        </>
    )
}

export default AuthLayout;