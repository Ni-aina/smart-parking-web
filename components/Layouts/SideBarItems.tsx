import {
    SidebarContent,
    SidebarGroup
} from "@/components/ui/sidebar";
import {
    Bell,
    BookCheck,
    ChevronLeft,
    ChevronRight,
    Euro,
    Home,
    MessageCircle,
    Settings,
    SquareParking,
    Truck,
    UserPen,
    UserStar
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/context/LanguageContext";

export const SideBarItems = () => {
    const [isOpenSettings, setIsOpenSettings] = useState(false)
    const pathname = usePathname()
    const { t } = useTranslation()

    const handleOpenSettings = () => {
        setIsOpenSettings(prev => !prev)
    }

    useEffect(() => {
        if (!pathname.startsWith("/owner/settings")) {
            setIsOpenSettings(false)
            return
        }
        setIsOpenSettings(true)
    }, [pathname])

    return (
        <SidebarContent>
            <SidebarGroup className="p-0">
                <Link
                    href="/owner/dashboard"
                    className={`
                        flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                        ${pathname === "/owner/dashboard" && "bg-white/10"}
                    `}
                >
                    <Home />
                    <h1>{t("sidebar.dashboard")}</h1>
                </Link>
            </SidebarGroup>
            <SidebarGroup className="p-0">
                <Link
                    href="/owner/reservations"
                    className={`
                        flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                        ${pathname === "/owner/reservations" && "bg-white/10"}
                    `}
                >
                    <BookCheck />
                    <h1>{t("sidebar.reservations")}</h1>
                </Link>
            </SidebarGroup>
            <SidebarGroup className="p-0">
                <Link
                    href="/owner/transactions"
                    className={`
                        flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                        ${pathname === "/owner/transactions" && "bg-white/10"}
                    `}
                >
                    <Euro />
                    <h1>{t("sidebar.transactions")}</h1>
                </Link>
            </SidebarGroup>
            <SidebarGroup className="p-0">
                <Link
                    href="/owner/parking-lots"
                    className={`
                        flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                        ${pathname === "/owner/parking-lots" && "bg-white/10"}
                    `}
                >
                    <SquareParking />
                    <h1>{t("sidebar.parkingLots")}</h1>
                </Link>
            </SidebarGroup>
            <SidebarGroup className="p-0">
                <Link
                    href="/owner/notifications"
                    className={`
                        flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                        ${pathname === "/owner/notifications" && "bg-white/10"}
                    `}
                >
                    <Bell />
                    <h1>{t("sidebar.notifications")}</h1>
                </Link>
            </SidebarGroup>
            <SidebarGroup className="p-0">
                <Link
                    href="/owner/messages"
                    className={`
                        flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                        ${pathname === "/owner/messages" && "bg-white/10"}
                    `}
                >
                    <MessageCircle />
                    <h1>{t("sidebar.messages")}</h1>
                </Link>
            </SidebarGroup>
            <SidebarGroup className="flex flex-col gap-3">
                <div
                    className="flex items-center space-x-5 cursor-pointer"
                    onClick={handleOpenSettings}
                >
                    <Settings />
                    <div className="flex w-full justify-between items-center gap-3 hover:opacity-70">
                        <h1>{t("sidebar.settings")}</h1>
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
                            href="/owner/settings/agents"
                            className={`
                                flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                                ${pathname === "/owner/settings/agents" && "bg-white/10"}
                            `}
                        >
                            <UserPen />
                            <h1>{t("sidebar.agents")}</h1>
                        </Link>
                        <Link
                            href="/owner/settings/types"
                            className={`
                                flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                                ${pathname === "/owner/settings/types" && "bg-white/10"}
                            `}
                            prefetch
                        >
                            <Truck />
                            <h1>{t("sidebar.types")}</h1>
                        </Link>
                        <Link
                            href="/owner/settings/account"
                            className={`
                                flex items-center space-x-3 px-3 py-2 rounded-sm hover:opacity-70
                                ${pathname === "/owner/settings/account" && "bg-white/10"}
                            `}
                        >
                            <UserStar />
                            <h1>{t("sidebar.account")}</h1>
                        </Link>
                    </div>
                }
            </SidebarGroup>
        </SidebarContent>
    )
}
