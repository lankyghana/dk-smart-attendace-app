import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Download, RefreshCw, Clock, MapPin, Calendar } from "lucide-react";
import QRCode from "qrcode";

interface Class {
  id: string;
  name: string;
  code: string;
  location: string;
  schedule: string;
}

interface QRCodeGeneratorProps {
  classData: Class;
  onClose: () => void;
}

export const QRCodeGenerator = ({ classData, onClose }: QRCodeGeneratorProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [expiryTime, setExpiryTime] = useState<Date>(new Date());
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQRCode = async () => {
    setIsGenerating(true);
    
    try {
      // Create QR data with security token and timestamp
      const qrData = {
        classId: classData.id,
        className: classData.name,
        classCode: classData.code,
        location: classData.location,
        timestamp: Date.now(),
        expiresAt: Date.now() + (5 * 60 * 1000), // 5 minutes from now
        token: Math.random().toString(36).substring(2, 15), // Security token
      };

      const qrString = JSON.stringify(qrData);
      const qrCodeDataUrl = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: "hsl(var(--foreground))",
          light: "hsl(var(--background))",
        },
        errorCorrectionLevel: 'M',
      });

      setQrCodeUrl(qrCodeDataUrl);
      setExpiryTime(new Date(Date.now() + (5 * 60 * 1000)));
      setTimeLeft(300);

      toast({
        title: "QR Code Generated!",
        description: "Students can now scan this code to mark attendance",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.download = `${classData.code}_${classData.name}_QR_${new Date().toISOString().split('T')[0]}.png`;
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded!",
      description: "QR code has been saved to your device",
    });
  };

  useEffect(() => {
    // Generate initial QR code
    generateQRCode();

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Class Info */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">{classData.name}</h3>
            <Badge variant="default">{classData.code}</Badge>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            {classData.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{classData.location}</span>
              </div>
            )}
            {classData.schedule && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{classData.schedule}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Generated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Display */}
      <div className="text-center space-y-4">
        {qrCodeUrl && (
          <div className="inline-block p-6 bg-white rounded-xl shadow-elevated">
            <img 
              src={qrCodeUrl} 
              alt="Attendance QR Code"
              className="mx-auto"
            />
          </div>
        )}

        {/* Expiry Timer */}
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {timeLeft > 0 ? (
              <>Expires in <span className="font-mono font-bold text-foreground">{formatTime(timeLeft)}</span></>
            ) : (
              <span className="text-destructive font-medium">QR Code Expired</span>
            )}
          </span>
        </div>

        {timeLeft <= 0 && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm font-medium">
              This QR code has expired for security reasons. Generate a new one to continue.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={generateQRCode}
          disabled={isGenerating}
          className="flex-1 bg-gradient-primary"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </>
          )}
        </Button>
        
        <Button
          onClick={downloadQRCode}
          variant="outline"
          disabled={!qrCodeUrl || timeLeft <= 0}
          className="flex-1"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>

      <div className="text-center">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};