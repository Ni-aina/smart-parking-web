"use client";

import SideBarLyout from "@/components/Layouts/SideBar";
import OwnerProtected from "@/components/OwnerProtected";
import SubscriptionProtected from "@/components/SubscriptionProtected";
import {
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/context/AuthContext";
import { SubscriptionInterface } from "@/types/subscription";
import { redirect, usePathname } from "next/navigation";
import { ReactNode } from "react";

const OwnerLayoutClient = ({
    children,
    currentSubscription
}: {
    children: ReactNode,
    currentSubscription: SubscriptionInterface | null
}) => {
    const { user } = useAuthContext();
    const pathname = usePathname();

    if (!user) return redirect("/auth/sign-in");

    const isAccountSettings = pathname === "/owner/settings/account";

    return (
        <SidebarProvider>
            <SideBarLyout />
            <main className="relative w-full h-dvh p-8">
                <OwnerProtected>
                    <SidebarTrigger
                        className="absolute top-0 left-0 text-white/80 cursor-pointer 
                        hover:text-white/80 hover:bg-transparent hover:opacity-80"
                    />
                    <div className="pb-5 h-full">
                        {
                            isAccountSettings ?
                                children :
                                <SubscriptionProtected
                                    currentSubscription={currentSubscription}
                                >
                                    {children}
                                </SubscriptionProtected>
                        }
                    </div>
                </OwnerProtected>
            </main>
        </SidebarProvider>
    )
}

export default OwnerLayoutClient;