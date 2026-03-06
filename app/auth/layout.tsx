"use client";

import { revalidateAuthSubscriptionPlans } from "@/actions/subscription.action";
import { useAuthContext } from "@/context/AuthContext";
import { redirect, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const { user } = useAuthContext();

    useEffect(() => {
        if (pathname !== "/auth/sign-up") return;
        revalidateAuthSubscriptionPlans();
    }, [pathname]);

    if (user && pathname !== "/auth/sign-out") return redirect("/owner/dashboard");

    return (
        <>
            {children}
        </>
    )
}

export default AuthLayout;