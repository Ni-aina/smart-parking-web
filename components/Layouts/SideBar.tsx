"use client";

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
import { useState } from "react";

const SideBar = () => {
    const [isOpenSettings, setIsOpenSettings] = useState(false);
    const handleOpenSettings = () => setIsOpenSettings(prev => !prev);

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
            <SidebarContent className="bg-slate-950 text-white py-5">
                <SidebarGroup>
                    <Link href={"/admin"} className="flex items-center space-x-3">
                        <Home />
                        <h1>Dashboard</h1>
                    </Link>
                </SidebarGroup>
                <SidebarGroup>
                    <Link href={"/admin/reservations"} className="flex items-center space-x-3">
                        <BookCheck />
                        <h1>Reservations</h1>
                    </Link>
                </SidebarGroup>
                <SidebarGroup>
                    <Link href={"/admin/payments"} className="flex items-center space-x-3">
                        <Euro />
                        <h1>Payments</h1>
                    </Link>
                </SidebarGroup>
                <SidebarGroup>
                    <Link href={"/admin/parking-lots"} className="flex items-center space-x-3">
                        <SquareParking />
                        <h1>Parking Lots</h1>
                    </Link>
                </SidebarGroup>
                <SidebarGroup>
                    <Link href={"/admin/notifications"} className="flex items-center space-x-3">
                        <Bell />
                        <h1>Notifications</h1>
                    </Link>
                </SidebarGroup>
                <SidebarGroup>
                    <Link href={"/admin/messages"} className="flex items-center space-x-3">
                        <MessageCircle />
                        <h1>Messages</h1>
                    </Link>
                </SidebarGroup>
                <SidebarGroup className="flex flex-col gap-4">
                    <div className="flex items-center space-x-3 cursor-pointer"
                        onClick={handleOpenSettings}
                    >
                        <Settings />
                        <div className="flex w-full justify-between items-center gap-3">
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
                        <div className="flex flex-col ml-8 gap-3">
                            <Link href={"/admin/settings/users"} className="flex items-center space-x-3">
                                <Users />
                                <h1>Users</h1>
                            </Link>
                            <Link href={"/admin/settings/account"} className="flex items-center space-x-3">
                                <UserStar />
                                <h1>Account</h1>
                            </Link>
                        </div>
                    }
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="bg-slate-950 text-white">
                <Link href={"/"} className="flex items-center space-x-3">
                    <UserCircle />
                    <h1>Logout</h1>
                    <LogOut size={16} />
                </Link>
            </SidebarFooter>
        </Sidebar>
    )
}

export default SideBar;