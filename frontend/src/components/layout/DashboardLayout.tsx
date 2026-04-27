import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { TopNavbar } from "./TopNavbar";
import { BottomNavigation } from "./BottomNavigation";

export function DashboardLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar - visible only on desktop (md+) */}
            <div className="hidden md:flex">
                <DashboardSidebar />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header - visible on all screens */}
                <TopNavbar />

                {/* Content area with bottom nav space on mobile */}
                <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                    <Outlet />
                </main>
            </div>

            {/* Bottom navigation - visible only on mobile (below md) */}
            <div className="md:hidden">
                <BottomNavigation />
            </div>
        </div>
    );
}
