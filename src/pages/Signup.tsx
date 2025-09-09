import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md glass shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 flex items-center justify-center">
            <img 
              src="/dk-logo-large.svg" 
              alt="DK Smart Attendance Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Join Smart Attendance</CardTitle>
            <CardDescription>Sign up for your teacher or student account</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* Signup form goes here */}
          <p className="text-gray-500 text-center">Signup functionality coming soon for teachers and students.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
