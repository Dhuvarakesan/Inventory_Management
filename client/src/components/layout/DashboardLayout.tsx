import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAppSelector } from "@/hooks/redux";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

const DashboardLayout = () => {
  const auth = useAppSelector((state) => state.auth);
  const isAuthenticated = auth?.isAuthenticated;

  const { isDialogVisible, onConfirm, onCancel } = useSessionManager();
  const [isLogoutDialogVisible, setLogoutDialogVisible] = useState(false); // State for logout dialog

  const handleLogout = () => {
    setLogoutDialogVisible(true);
  };

  const confirmLogout = () => {
    onCancel(); // Call the logout function
    setLogoutDialogVisible(false);
  };

  const cancelLogout = () => {
    setLogoutDialogVisible(false);
  };

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
              <button onClick={handleLogout} className="text-red-500">
                Logout
              </button>
            </div>
          </header>
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
      {isDialogVisible && (
        <ConfirmationDialog
          isOpen={isDialogVisible}
          title="Session Expiring"
          description="Your session is about to expire. Do you want to extend it?"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      )}
      {isLogoutDialogVisible && (
        <ConfirmationDialog
          isOpen={isLogoutDialogVisible}
          title="Confirm Logout"
          description="Are you sure you want to logout?"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </SidebarProvider>
  );
};

export default DashboardLayout;
