import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { TopNavbar } from "./TopNavbar";

export function DashboardLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNavbar />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
