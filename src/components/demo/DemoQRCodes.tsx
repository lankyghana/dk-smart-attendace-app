import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Copy } from "lucide-react";

export const DemoQRCodes = () => {
  const { toast } = useToast();

  const demoQRData = [
    {
      name: "Mathematics 101",
      code: "MATH101",
      data: JSON.stringify({
        classId: "class_math_101",
        className: "Mathematics 101",
        classCode: "MATH101",
        location: "Room A101",
        timestamp: Date.now(),
        expiresAt: Date.now() + (5 * 60 * 1000), // 5 minutes from now
        token: "demo_math_token_123",
      })
    },
    {
      name: "Physics 201",
      code: "PHYS201", 
      data: JSON.stringify({
        classId: "class_physics_201",
        className: "Physics 201",
        classCode: "PHYS201",
        location: "Lab B205",
        timestamp: Date.now(),
        expiresAt: Date.now() + (5 * 60 * 1000),
        token: "demo_physics_token_456",
      })
    },
    {
      name: "Chemistry Lab",
      code: "CHEM_LAB",
      data: JSON.stringify({
        classId: "class_chemistry_lab",
        className: "Chemistry Lab",
        classCode: "CHEM_LAB",
        location: "Lab C301",
        timestamp: Date.now(),
        expiresAt: Date.now() + (5 * 60 * 1000),
        token: "demo_chem_token_789",
      })
    }
  ];

  const copyToClipboard = (data: string, className: string) => {
    navigator.clipboard.writeText(data).then(() => {
      toast({
        title: "Copied!",
        description: `${className} attendance code copied to clipboard`,
      });
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Demo QR Codes for Testing
        </CardTitle>
        <CardDescription>
          Use these sample QR codes to test the attendance marking functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {demoQRData.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{item.name}</h3>
              <span className="text-sm text-muted-foreground">{item.code}</span>
            </div>
            <div className="bg-muted p-2 rounded text-xs font-mono mb-2 break-all">
              {item.data}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(item.data, item.name)}
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy QR Code Data
            </Button>
          </div>
        ))}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">How to Test:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Copy any QR code data above</li>
            <li>2. Go to the Student Attendance page</li>
            <li>3. Paste the data into the "Attendance Code" field</li>
            <li>4. Click "Mark Present" to test the functionality</li>
            <li>5. Or click "Scan QR Code" to test the camera scanner</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
