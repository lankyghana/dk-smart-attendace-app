import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, Clock, Mail, Shield, LogOut } from "lucide-react";

export const TeacherPendingApproval = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in flex items-center justify-center">
      <Card className="w-full max-w-md glass shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Account Pending Approval</CardTitle>
            <CardDescription>
              Your teacher account is waiting for admin approval
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-yellow-800">Registration Submitted</p>
                <p className="text-sm text-yellow-700">
                  Your teacher registration has been submitted successfully. An administrator needs to approve your account before you can access teaching features.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-foreground">What happens next?</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Admin reviews your registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Account gets approved and activated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>You receive email notification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Full teacher access is granted</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-blue-800">Email Notification</p>
                  <p className="text-sm text-blue-700">
                    You'll receive an email confirmation once your account is approved. This usually takes 1-2 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Check Status Again
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/30"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Need help? Contact the administrator</p>
              <a href="mailto:admin@university.edu" className="text-primary hover:underline">
                admin@university.edu
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
