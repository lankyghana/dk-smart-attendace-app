import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAppStore } from "@/stores/appStore";
import { getComponentForTabAndRole } from "@/config/componentRegistry";
import { TeacherPendingApproval } from "@/components/teacher/TeacherPendingApproval";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard"; // This serves as our fallback when other components aren't available

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

  // Let's set up the default tab based on what the user's role should see first
  useEffect(() => {
    if (user?.role) {
      const defaultTab = getDefaultTab(user.role);
      setActiveTab(defaultTab);
    }
  }, [user?.role, getDefaultTab, setActiveTab]);

  // Show a loading spinner while we're waiting for authentication to complete
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

  // If user isn't logged in, redirect them to the auth page
  if (!isAuthenticated || !user) {
    navigate("/auth");
    return null;
  }

  // Teachers need admin approval before they can access the full system
  const needsApproval = user.role === "teacher" && !isTeacherApproved;
  
  // Figure out which component to show based on the selected tab and user's role
  const CurrentComponent = getComponentForTabAndRole(activeTab, user.role!) || Dashboard;
  
  // Different user roles see different navigation tabs
  const availableTabs = getAvailableTabs(user.role!, isTeacherApproved);

  // If teacher is waiting for approval, show them a special message instead of the main app
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

  // Here's the main application layout with sidebar and content area
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
