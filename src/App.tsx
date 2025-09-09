import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import AdminPage from "./pages/Admin";
import RoleGuard from "@/components/ui/RoleGuard";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Signup: Only for teacher or student roles */}
              <Route
                path="/signup"
                element={
                  <RoleGuard allowedRoles={["teacher", "student"]} fallback="/login">
                    <Signup />
                  </RoleGuard>
                }
              />

              {/* Admin: Only for admin role */}
              <Route
                path="/admin"
                element={
                  <RoleGuard allowedRoles={["admin"]} fallback="/login">
                    <AdminPage />
                  </RoleGuard>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
