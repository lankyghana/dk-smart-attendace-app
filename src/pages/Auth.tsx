import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Shield, Loader2, Users } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, signup } = useAuth();
  const { toast } = useToast();

  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"teacher" | "admin" | "student">("student");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoadingForgotPassword, setIsLoadingForgotPassword] = useState(false);

  useEffect(() => {
    document.title = tab === "login" ? "Login • DK Smart Attendance" : "Sign up • DK Smart Attendance";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Login or sign up to DK Smart Attendance.");
  }, [tab]);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast({ 
          title: "Welcome back!", 
          description: `Successfully signed in as ${email}` 
        });
        navigate("/");
      } else {
        toast({ 
          title: "Login failed", 
          description: "Invalid credentials. Please check your email and password.", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Login error", 
        description: "Something went wrong. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error, needsConfirmation } = await signup(email, password, name, role);
      if (error) {
        toast({ 
          title: "Sign up failed", 
          description: error.message, 
          variant: "destructive" 
        });
      } else {
        if (needsConfirmation) {
          toast({
            title: "Check your email",
            description: "We sent you a confirmation link to complete your registration.",
          });
        } else {
          toast({
            title: "Account created!",
            description: "You can now sign in with your credentials.",
          });
        }
        setTab("login");
        setEmail("");
        setPassword("");
        setName("");
      }
    } catch (error) {
      toast({ 
        title: "Sign up error", 
        description: "Something went wrong. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingForgotPassword(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Reset link sent",
          description: "Check your email for a password reset link.",
        });
        setShowForgotPassword(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingForgotPassword(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "teacher":
        return <GraduationCap className="h-4 w-4" />;
      case "student":
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md glass shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Smart Attendance</CardTitle>
            <CardDescription>
              {tab === "login" ? "Sign in to your account" : "Create your account"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Sign up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="space-y-4">
                {!showForgotPassword ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <PasswordInput 
                        id="password" 
                        placeholder="Enter your password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="link"
                        className="px-0 font-normal text-sm text-muted-foreground hover:text-primary"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-primary hover:shadow-glow transition-spring" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resetEmail">Email</Label>
                      <Input 
                        id="resetEmail" 
                        type="email" 
                        placeholder="Enter your email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowForgotPassword(false)}
                      >
                        Back to login
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-primary hover:shadow-glow transition-spring" 
                        disabled={isLoadingForgotPassword}
                      >
                        {isLoadingForgotPassword ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                            Sending...
                          </>
                        ) : (
                          "Send reset link"
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your full name"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email2">Email</Label>
                  <Input 
                    id="email2" 
                    type="email" 
                    placeholder="Enter your email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password2">Password</Label>
                  <PasswordInput 
                    id="password2" 
                    placeholder="Create a password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    minLength={6}
                    showStrengthIndicator={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(value: "teacher" | "student") => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(role)}
                          <span className="capitalize">{role}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Student
                        </div>
                      </SelectItem>
                      <SelectItem value="teacher">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Teacher
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:shadow-glow transition-spring" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
