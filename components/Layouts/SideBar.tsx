import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    BookCheck,
    Euro,
    Home,
    LogOut,
    Settings
} from "lucide-react";

const SideBar = () => {

    return (
        <Sidebar className="bg-slate-950 p-5 shadow-2xl">
            <SidebarHeader className="bg-slate-950 text-white">
                <div className="flex justify-between items-center gap-3">
                    <h1>Smart Parking</h1>
                    <SidebarTrigger className="sm:hidden text-white cursor-pointer hover:text-white hover:bg-transparent hover:opacity-80" />
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-slate-950 text-white py-5">
                <SidebarGroup>
                    <div className="flex items-center space-x-3">
                        <Home />
                        <h1>Dashboard</h1>
                    </div>
                </SidebarGroup>
                <SidebarGroup>
                    <div className="flex items-center space-x-3">
                        <BookCheck />
                        <h1>Reservations</h1>
                    </div>
                </SidebarGroup>
                <SidebarGroup>
                    <div className="flex items-center space-x-3">
                        <Euro />
                        <h1>Finances</h1>
                    </div>
                </SidebarGroup>
                <SidebarGroup>
                    <div className="flex items-center space-x-3">
                        <Settings />
                        <h1>Settings</h1>
                    </div>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="bg-slate-950 text-white">
                <div className="flex items-center space-x-3">
                    <h1>Logout</h1>
                    <LogOut size={16} />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default SideBar;