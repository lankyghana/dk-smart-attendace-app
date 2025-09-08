import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createDemoUsersDirectly } from "@/utils/seedUsers";
import { Loader2 } from "lucide-react";

export const DemoSetup = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateDemoUsers = async () => {
    setIsCreating(true);
    try {
      await createDemoUsersDirectly();
      toast({
        title: "Demo users created!",
        description: "You can now use the demo login credentials.",
      });
    } catch (error) {
      toast({
        title: "Error creating demo users",
        description: "Please check the console for details.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Demo Setup</CardTitle>
        <CardDescription>
          Create demo user accounts for testing the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>Demo accounts that will be created:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>👨‍🎓 Student: john@university.edu / student123</li>
              <li>👨‍🏫 Teacher: mike@university.edu / teacher123</li>
              <li>👑 Admin: sarah@university.edu / admin123</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleCreateDemoUsers}
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Demo Users...
              </>
            ) : (
              "Create Demo Users"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
