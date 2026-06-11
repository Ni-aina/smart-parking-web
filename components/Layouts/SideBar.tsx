"use client";

import { logOut } from "@/actions/auth.action";
import {
    Sidebar,
    SidebarFooter,
    SidebarHeader
} from "@/components/ui/sidebar";
import {
    LoaderCircle,
    LogOut,
    UserCircle
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import OwnerProtected from "../OwnerProtected";
import { SideBarItems } from "./SideBarItems";
import { useTranslation } from "@/context/LanguageContext";

const SideBarLayout = () => {
    const [isPending, setIsPending] = useState(false)
    const { t } = useTranslation()

    const handleSignOut = async () => {
        try {
            setIsPending(true)
            await logOut()
        } catch {

        } finally {
            setIsPending(false)
        }
    }

    return (
        <Sidebar className="bg-black/95 border-none shadow-white/10 shadow-sm">
            <div className="flex flex-col bg-black/95 text-white w-full h-full gap-5 lg:gap-8 p-5">
                <SidebarHeader>
                    <div className="flex justify-center mt-3">
                        <div className="relative w-36 h-12">
                            <Image
                                src="/images/smart-parking.png"
                                alt="Smart parking"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                            />
                        </div>
                    </div>
                </SidebarHeader>
                <OwnerProtected>
                    <SideBarItems />
                </OwnerProtected>
                <SidebarFooter className="gap-4">
                    <button
                        className="flex items-center space-x-3 cursor-pointer hover:opacity-70 disabled:cursor-not-allowed"
                        onClick={handleSignOut}
                        disabled={isPending}
                    >
                        <UserCircle />
                        <h1>{t("sidebar.signOut")}</h1>
                        {
                            isPending ?
                                <LoaderCircle size={20} /> :
                                <LogOut size={20} />
                        }
                    </button>
                </SidebarFooter>
            </div>
        </Sidebar>
    )
}

export default SideBarLayout