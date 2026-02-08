"use client";

import { useAuthContext } from "@/context/AuthContext";
import { redirect, usePathname } from "next/navigation";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const { user } = useAuthContext();

    if (user && pathname !== "/auth/sign-out") return redirect("/owner/dashboard");

    return (
        <>
            {children}
        </>
    )
}

export default AuthLayout;