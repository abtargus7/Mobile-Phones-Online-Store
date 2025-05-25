import { Outlet } from "react-router-dom";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from '@/components/ui/sidebar'

//sidebar admin layout
const AdminLayout = () => {
    return (
        <div className="flex">
            <SidebarProvider>
                <AppSidebar />
                <div className="flex-1 p-5">
                    <Outlet /> {/* Admin pages will be rendered here */}
                </div>
            </SidebarProvider>

        </div>
    );
};

export default AdminLayout;
