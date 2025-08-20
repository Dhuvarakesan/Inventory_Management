import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAppSelector } from "@/hooks/redux";
import { Navigate } from "react-router-dom";

const DashboardLayout = () => {
  const auth = useAppSelector((state) => state.auth);
  const isAuthenticated = auth?.isAuthenticated;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-card/80 backdrop-blur-sm px-6 shadow-sm">
            <SidebarTrigger className="hover:bg-accent rounded-md p-2 transition-colors" />
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              {/* Future: User menu, notifications, etc. */}
            </div>
          </header>
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;