import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Shield, Loader2 } from "lucide-react";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student");
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Welcome back!",
          description: `Successfully logged in as ${role}`,
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md glass shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Smart Attendance</CardTitle>
            <CardDescription>Sign in to your admin dashboard</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={(value) => setRole(value as "student" | "teacher" | "admin")} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="teacher" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Teacher
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="space-y-4">
              <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                <p><strong>Demo Student:</strong> john@university.edu</p>
                <p><strong>Password:</strong> student123</p>
              </div>
            </TabsContent>

            <TabsContent value="teacher" className="space-y-4">
              <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                <p><strong>Demo Teacher:</strong> mike@university.edu</p>
                <p><strong>Password:</strong> teacher123</p>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                <p><strong>Demo Admin:</strong> sarah@university.edu</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-smooth"
              />
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
                `Sign in as ${role}`
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};