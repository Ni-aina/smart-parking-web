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
    UserCircle,
    Users,
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
        <Sidebar className="bg-slate-950 border-slate-900 shadow-2xl p-5">
            <SidebarHeader className="bg-slate-950 text-white">
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
                    hover:text-white hover:bg-transparent hover:opacity-80" />
                </div>
            </SidebarHeader>
            <OwnerProtected>
                <SidebarContent className="bg-slate-950 text-white py-5">
                    <SidebarGroup className="p-0">
                        <Link
                            href={"/admin/dashboard"}
                            className={`
                            flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-80
                            ${pathname === "/admin/dashboard" && "bg-blue-950/30"}
                        `}
                        >
                            <Home />
                            <h1>Dashboard</h1>
                        </Link>
                    </SidebarGroup>
                    <SidebarGroup className="p-0">
                        <Link
                            href={"/admin/reservations"}
                            className={`
                            flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-80
                            ${pathname === "/admin/reservations" && "bg-blue-950/30"}
                        `}
                        >
                            <BookCheck />
                            <h1>Reservations</h1>
                        </Link>
                    </SidebarGroup>
                    <SidebarGroup className="p-0">
                        <Link
                            href={"/admin/payments"}
                            className={`
                            flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-80
                            ${pathname === "/admin/payments" && "bg-blue-950/30"}
                        `}
                        >
                            <Euro />
                            <h1>Payments</h1>
                        </Link>
                    </SidebarGroup>
                    <SidebarGroup className="p-0">
                        <Link
                            href={"/admin/parking-lots"}
                            className={`
                            flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-80
                            ${pathname === "/admin/parking-lots" && "bg-blue-950/30"}
                        `}
                        >
                            <SquareParking />
                            <h1>Parking Lots</h1>
                        </Link>
                    </SidebarGroup>
                    <SidebarGroup className="p-0">
                        <Link
                            href={"/admin/notifications"}
                            className={`
                            flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-80
                            ${pathname === "/admin/notifications" && "bg-blue-950/30"}
                        `}
                        >
                            <Bell />
                            <h1>Notifications</h1>
                        </Link>
                    </SidebarGroup>
                    <SidebarGroup className="p-0">
                        <Link
                            href={"/admin/messages"}
                            className={`
                            flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-80
                            ${pathname === "/admin/messages" && "bg-blue-950/30"}
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
                            <div className="flex w-full justify-between items-center gap-3 hover:opacity-80">
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
                                    href={"/admin/settings/users"}
                                    className={`
                                    flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-80
                                    ${pathname === "/admin/settings/users" && "bg-blue-950/30"}
                                `}
                                >
                                    <Users />
                                    <h1>Users</h1>
                                </Link>
                                <Link
                                    href={"/admin/settings/account"}
                                    className={`
                                    flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-80
                                    ${pathname === "/admin/settings/account" && "bg-blue-950/30"}
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

            <SidebarFooter className="bg-slate-950 text-white">
                <button
                    className="flex items-center space-x-3 cursor-pointer hover:opacity-80 disabled:cursor-not-allowed"
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
        </Sidebar>
    )
}

export default SideBarLayout;