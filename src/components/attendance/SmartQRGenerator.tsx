import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, MapPin, Timer, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SmartQRGeneratorProps {
  classId: string;
  className: string;
  teacherId: string;
  onQRGenerated: (qrData: string) => void;
}

interface QRConfig {
  attendanceWindow: number; // minutes
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // meters
  };
  expiresAt: Date;
}

export const SmartQRGenerator: React.FC<SmartQRGeneratorProps> = ({
  classId,
  className,
  teacherId,
  onQRGenerated
}) => {
  const [currentQR, setCurrentQR] = useState<string | null>(null);
  const [config, setConfig] = useState<QRConfig>({
    attendanceWindow: 30,
    expiresAt: new Date()
  });
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const { toast } = useToast();

  // Countdown timer for QR expiry
  useEffect(() => {
    if (!currentQR) return;

    const interval = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(0, Math.floor((config.expiresAt.getTime() - now.getTime()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        setCurrentQR(null);
        toast({
          title: "QR Code Expired",
          description: "Generate a new QR code for attendance",
          variant: "destructive"
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQR, config.expiresAt, toast]);

  const generateQRCode = async () => {
    try {
      let location;
      
      if (isLocationEnabled && navigator.geolocation) {
        location = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000
          });
        });
      }

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + config.attendanceWindow);

      const qrData = {
        classId,
        teacherId,
        sessionId: `${classId}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        location: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          radius: 50 // 50 meter radius
        } : undefined
      };

      const qrString = JSON.stringify(qrData);
      const encodedQR = btoa(qrString); // Base64 encode for QR

      setCurrentQR(encodedQR);
      setConfig(prev => ({ ...prev, expiresAt, location: qrData.location }));
      onQRGenerated(encodedQR);

      toast({
        title: "QR Code Generated",
        description: `Valid for ${config.attendanceWindow} minutes`,
      });

    } catch (error) {
      console.error('Failed to generate QR code:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate QR code. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (!currentQR) return 'bg-gray-100';
    if (timeLeft > 300) return 'bg-green-100'; // >5 mins
    if (timeLeft > 60) return 'bg-yellow-100'; // >1 min
    return 'bg-red-100'; // <1 min
  };

  const getStatusText = () => {
    if (!currentQR) return 'No active session';
    if (timeLeft > 300) return 'Active';
    if (timeLeft > 60) return 'Expiring soon';
    return 'About to expire';
  };

  return (
    <Card className={getStatusColor()}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Smart QR Generator
        </CardTitle>
        <CardDescription>
          Generate time-limited QR codes for {className}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentQR && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant={timeLeft > 60 ? "default" : "destructive"}>
                {getStatusText()}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Timer className="h-3 w-3" />
                {formatTime(timeLeft)}
              </div>
            </div>
            
            {config.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                Location-based verification enabled
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Attendance Window</label>
          <select 
            value={config.attendanceWindow}
            onChange={(e) => setConfig(prev => ({ ...prev, attendanceWindow: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={!!currentQR}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="location-check"
            checked={isLocationEnabled}
            onChange={(e) => setIsLocationEnabled(e.target.checked)}
            disabled={!!currentQR}
          />
          <label htmlFor="location-check" className="text-sm">
            Enable location verification
          </label>
        </div>

        <Button 
          onClick={generateQRCode} 
          className="w-full"
          disabled={!!currentQR && timeLeft > 60} // Allow regeneration in last minute
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {currentQR ? 'Regenerate QR Code' : 'Generate QR Code'}
        </Button>

        {currentQR && timeLeft <= 60 && (
          <p className="text-xs text-orange-600 text-center">
            QR code expiring soon. Click regenerate to extend session.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
