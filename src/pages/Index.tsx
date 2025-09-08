import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAppStore } from "@/stores/appStore";
import { getComponentForTabAndRole } from "@/config/componentRegistry";
import { TeacherPendingApproval } from "@/components/teacher/TeacherPendingApproval";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard"; // Fallback component

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const { 
    activeTab, 
    isTeacherApproved, 
    setActiveTab, 
    getDefaultTab, 
    getAvailableTabs 
  } = useAppStore();

  // Initialize default tab based on user role
  useEffect(() => {
    if (user?.role) {
      const defaultTab = getDefaultTab(user.role);
      setActiveTab(defaultTab);
    }
  }, [user?.role, getDefaultTab, setActiveTab]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!isAuthenticated || !user) {
    navigate("/auth");
    return null;
  }

  // Check if teacher needs approval
  const needsApproval = user.role === "teacher" && !isTeacherApproved;
  
  // Get the component to render based on current tab and user role
  const CurrentComponent = getComponentForTabAndRole(activeTab, user.role!) || Dashboard;
  
  // Get available tabs for current user
  const availableTabs = getAvailableTabs(user.role!, isTeacherApproved);

  // Render teacher pending approval if needed
  if (needsApproval) {
    return (
      <div className="flex min-h-screen bg-background">
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <div className="w-full max-w-screen-2xl mx-auto container-responsive">
            <div className="text-wrap">
              <TeacherPendingApproval />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main application layout
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        userRole={user.role!}
        availableTabs={availableTabs}
      />
      <main className="
        flex-1 transition-all duration-300 ease-in-out
        md:ml-64
        p-3 sm:p-4 md:p-6 lg:p-8
        min-w-0 overflow-x-hidden
      ">
        <div className="w-full max-w-screen-2xl mx-auto container-responsive">
          <div className="text-wrap">
            <CurrentComponent />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
