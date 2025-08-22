import { Button } from "@/components/ui/button";
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logoutUser } from "@/store/slices/authSlice";
import {
  Download,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  Upload,
  Users
} from "lucide-react";
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Products", url: "/dashboard/products", icon: Package },
  { title: "History", url: "/dashboard/history", icon: History },
];

const adminItems = [
  { title: "Users", url: "/dashboard/users", icon: Users },
  { title: "Create Product", url: "/dashboard/create-product", icon: PlusCircle },
  { title: "Product Entry", url: "/dashboard/product-entry", icon: Upload },
  { title: "Product Withdrawal", url: "/dashboard/product-withdrawal", icon: Download },
  { title: "System Logs", url: "/dashboard/logs", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const user = auth?.user;
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary font-medium shadow-md" 
      : "hover:bg-accent/60 transition-colors";

  const [isLogoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const handleLogoutClick = () => {
    setLogoutDialogVisible(true);
  };

  const confirmLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
    setLogoutDialogVisible(false);
  };

  const cancelLogout = () => {
    setLogoutDialogVisible(false);
  };

  const isAdmin = user?.role === 'admin';
  const collapsed = state === 'collapsed';

  return (
    <Sidebar
      className={`${
        collapsed ? "w-16" : "w-64"
      } border-r bg-card/50 backdrop-blur-sm`}
    >
      <SidebarHeader className="border-b border-border/50 p-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                Inventory Management
              </h2>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto">
            <Package className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <Button
          variant="ghost"
          size={collapsed ? "sm" : "default"}
          onClick={handleLogoutClick}
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
      {isLogoutDialogVisible && (
        <ConfirmationDialog
          isOpen={isLogoutDialogVisible}
          title="Confirm Logout"
          description="Are you sure you want to logout?"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </Sidebar>
  );
}