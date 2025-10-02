"use client";

import SideBarLyout from "@/components/Layouts/SideBar";
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
            <main className="p-5">
                <SidebarTrigger className="text-white cursor-pointer 
                hover:text-white hover:bg-transparent hover:opacity-80" />
                {children}
            </main>
        </SidebarProvider>
    )
}

export default AdminLayout;