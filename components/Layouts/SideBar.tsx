"use client";

import { logOut } from "@/actions/auth.action";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    Bell,
    BookCheck,
    ChevronLeft,
    ChevronRight,
    Euro,
    Home,
    LoaderCircle,
    LogOut,
    MessageCircle,
    Settings,
    SquareParking,
    Truck,
    UserCircle,
    UserPen,
    UserStar
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import OwnerProtected from "../OwnerProtected";

const SideBarLayout = () => {
    const [isPending, setIsPending] = useState(false);
    const [isOpenSettings, setIsOpenSettings] = useState(false);
    const pathname = usePathname();
    const handleOpenSettings = () => setIsOpenSettings(prev => !prev);

    const handleSignOut = async () => {
        try {
            setIsPending(true);
            await logOut();
        } catch {

        } finally {
            setIsPending(false);
        }
    }

    return (
        <Sidebar className="bg-black/95 border-none shadow-white/10 shadow-sm">
            <div className="flex flex-col bg-black/95 text-white w-full h-full gap-5 lg:gap-8 p-5">
                <SidebarHeader>
                    <div className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-3">
                            <Image
                                src={"/images/smart-parking.png"}
                                alt="Smart parking"
                                width={40}
                                height={40}
                            />
                            <h1>Smart Parking</h1>
                        </div>
                        <SidebarTrigger className="sm:hidden text-white cursor-pointer 
                        hover:text-white hover:bg-transparent hover:opacity-70" />
                    </div>
                </SidebarHeader>
                <OwnerProtected>
                    <SidebarContent>
                        <SidebarGroup className="p-0">
                            <Link
                                href={"/owner/dashboard"}
                                className={`
                                flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                                ${pathname === "/owner/dashboard" && "bg-blue-950/30"}
                            `}
                            >
                                <Home />
                                <h1>Dashboard</h1>
                            </Link>
                        </SidebarGroup>
                        <SidebarGroup className="p-0">
                            <Link
                                href={"/owner/reservations"}
                                className={`
                                flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                                ${pathname === "/owner/reservations" && "bg-blue-950/30"}
                            `}
                            >
                                <BookCheck />
                                <h1>Reservations</h1>
                            </Link>
                        </SidebarGroup>
                        <SidebarGroup className="p-0">
                            <Link
                                href={"/owner/payments"}
                                className={`
                                flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                                ${pathname === "/owner/payments" && "bg-blue-950/30"}
                            `}
                            >
                                <Euro />
                                <h1>Payments</h1>
                            </Link>
                        </SidebarGroup>
                        <SidebarGroup className="p-0">
                            <Link
                                href={"/owner/parking-lots"}
                                className={`
                                flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                                ${pathname === "/owner/parking-lots" && "bg-blue-950/30"}
                            `}
                            >
                                <SquareParking />
                                <h1>Parking Lots</h1>
                            </Link>
                        </SidebarGroup>
                        <SidebarGroup className="p-0">
                            <Link
                                href={"/owner/notifications"}
                                className={`
                                flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                                ${pathname === "/owner/notifications" && "bg-blue-950/30"}
                            `}
                            >
                                <Bell />
                                <h1>Notifications</h1>
                            </Link>
                        </SidebarGroup>
                        <SidebarGroup className="p-0">
                            <Link
                                href={"/owner/messages"}
                                className={`
                                flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                                ${pathname === "/owner/messages" && "bg-blue-950/30"}
                            `}
                            >
                                <MessageCircle />
                                <h1>Messages</h1>
                            </Link>
                        </SidebarGroup>
                        <SidebarGroup className="flex flex-col gap-3">
                            <div className="flex items-center space-x-5 cursor-pointer"
                                onClick={handleOpenSettings}
                            >
                                <Settings />
                                <div className="flex w-full justify-between items-center gap-3 hover:opacity-70">
                                    <h1>Settings</h1>
                                    {
                                        !isOpenSettings ?
                                            <ChevronRight /> :
                                            <ChevronLeft />
                                    }
                                </div>
                            </div>
                            {
                                isOpenSettings &&
                                <div className="flex flex-col ml-5">
                                    <Link
                                        href={"/owner/settings/agents"}
                                        className={`
                                            flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                                            ${pathname === "/owner/settings/agents" && "bg-blue-950/30"}
                                        `}
                                    >
                                        <UserPen />
                                        <h1>Agents</h1>
                                    </Link>
                                    <Link
                                        href={"/owner/settings/types"}
                                        className={`
                                            flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                                            ${pathname === "/owner/settings/types" && "bg-blue-950/30"}
                                        `}
                                        prefetch
                                    >
                                        <Truck />
                                        <h1>Types</h1>
                                    </Link>
                                    <Link
                                        href={"/owner/settings/account"}
                                        className={`
                                        flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                                        ${pathname === "/owner/settings/account" && "bg-blue-950/30"}
                                    `}
                                    >
                                        <UserStar />
                                        <h1>Account</h1>
                                    </Link>
                                </div>
                            }
                        </SidebarGroup>
                    </SidebarContent>
                </OwnerProtected>
                <SidebarFooter>
                    <button
                        className="flex items-center space-x-3 cursor-pointer hover:opacity-70 disabled:cursor-not-allowed"
                        onClick={handleSignOut}
                        disabled={isPending}
                    >
                        <UserCircle />
                        <h1>Logout</h1>
                        {
                            isPending ?
                                <LoaderCircle
                                    size={20}
                                /> :
                                <LogOut size={20} />
                        }
                    </button>
                </SidebarFooter>
            </div>
        </Sidebar>
    )
}

export default SideBarLayout;