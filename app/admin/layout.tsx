"use client";

import SideBarLyout from "@/components/Layouts/SideBar";
import OwnerProtected from "@/components/OwnerProtected";
import {
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
    const { user } = useAuthContext();

    if (!user) return redirect("/auth/sign-in");

    return (
        <SidebarProvider>
            <SideBarLyout />
            <main className="relative w-full h-screen p-8">
                <OwnerProtected>
                    <SidebarTrigger
                        className="absolute top-0 left-0 text-white/80 cursor-pointer 
                        hover:text-white/80 hover:bg-transparent hover:opacity-80"
                    />
                    {children}
                </OwnerProtected>
            </main>
        </SidebarProvider>
    )
}

export default AdminLayout;