import SideBar from "@/components/Layouts/SideBar";
import { 
    SidebarProvider, 
    SidebarTrigger 
} from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <SideBar />
            <main className="p-5">
                <SidebarTrigger className="text-white cursor-pointer hover:text-white hover:bg-transparent hover:opacity-80" />
                {children}
            </main>
        </SidebarProvider>
    )
}

export default AdminLayout;