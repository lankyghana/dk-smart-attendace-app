import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/contexts/AuthContext";
import { TabConfig } from "@/stores/appStore";
import { tabMetadata } from "@/config/componentRegistry";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  QrCode,
  BarChart3,
  Settings,
  ChevronLeft,
  GraduationCap,
  Menu,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: UserRole;
  availableTabs: TabConfig[];
}

// Icon mapping for dynamic rendering
const iconMap = {
  LayoutDashboard,
  BookOpen,
  Users,
  QrCode,
  BarChart3,
} as const;
export const Sidebar = ({ activeTab, onTabChange, userRole, availableTabs }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logout, user } = useAuth();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const handleLogout = async () => {
    await logout();
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      default: return 'User';
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 glass shadow-card"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-40 h-full glass border-r transition-all duration-300 ease-in-out",
        "flex flex-col overflow-hidden", // Prevent content overflow
        isCollapsed ? "w-16" : "w-64",
        // Mobile responsive classes - better touch handling
        "max-w-[85vw] sm:max-w-none", // Prevent sidebar from being too wide on small screens
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        "touch-target" // Ensure good touch targets
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center gap-3 border-b border-border/50 px-3 sm:px-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-primary flex-shrink-0">
              <GraduationCap className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-responsive-sm font-semibold text-wrap">Smart Attendance</span>
                <span className="text-responsive-xs text-muted-foreground text-wrap">
                  {userRole === "student" ? "Student Portal" : userRole === "teacher" ? "Teacher Dashboard" : "Admin Panel"}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="ml-auto hidden md:flex touch-target"
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform duration-200",
                isCollapsed && "rotate-180"
              )} />
            </Button>
          </div>

          {/* User Info */}
          {!isCollapsed && (
            <div className="border-b border-border/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-medium text-primary">
                    {user?.name ? user.name.charAt(0).toUpperCase() : userRole.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-wrap">
                    {user?.name || getRoleDisplayName(userRole)}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize text-wrap">
                    {getRoleDisplayName(userRole)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {availableTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const metadata = tabMetadata[tab.id as keyof typeof tabMetadata];
              const IconComponent = iconMap[metadata?.icon as keyof typeof iconMap] || LayoutDashboard;

              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 transition-all duration-200 touch-target",
                    isCollapsed && "px-2 justify-center",
                    isActive && "bg-gradient-primary shadow-glow"
                  )}
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsMobileOpen(false);
                  }}
                >
                  <IconComponent className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-sm font-medium text-wrap">{metadata?.label || tab.label}</span>
                      {!isActive && metadata?.description && (
                        <span className="text-xs text-muted-foreground text-wrap">
                          {metadata.description}
                        </span>
                      )}
                    </div>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border/50 p-4 space-y-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 touch-target",
                isCollapsed && "px-2 justify-center"
              )}
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm text-wrap">Settings</span>}
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 touch-target",
                isCollapsed && "px-2 justify-center"
              )}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm text-wrap">Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};