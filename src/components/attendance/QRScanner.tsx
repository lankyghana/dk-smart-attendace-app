import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, X, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (result: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let codeReader: BrowserMultiFormatReader | null = null;

    const startScanner = async () => {
      if (!isOpen || !webcamRef.current) return;

      try {
        // Always request camera permission immediately
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        stream.getTracks().forEach(track => track.stop()); // Stop the test stream

        setIsScanning(true);
        setError(null);

        codeReader = new BrowserMultiFormatReader();
        // Get video element from webcam
        const videoElement = webcamRef.current.video;
        if (!videoElement) return;

        // Start continuous scanning
        codeReader.decodeFromVideoDevice(undefined, videoElement, (result, error) => {
          if (result) {
            const scannedText = result.getText();
            toast({
              title: "QR Code Scanned!",
              description: "Attendance code detected successfully",
            });
            onScanSuccess(scannedText);
            onClose();
          }
          if (error && error.name !== 'NotFoundException') {
            console.error('Scanning error:', error);
          }
        });
      } catch (err) {
        setHasPermission(false);
        setError('Camera access denied. Please allow camera permissions and try again.');
        toast({
          title: "Camera Access Denied",
          description: "Please allow camera permissions to scan QR codes",
          variant: "destructive",
        });
      }
    };

    if (isOpen) {
      setHasPermission(null); // Reset permission state every time dialog opens
      setError(null);
      startScanner();
    }

    return () => {
      if (codeReader) {
        codeReader.reset();
      }
      setIsScanning(false);
    };
  }, [isOpen, onScanSuccess, onClose, toast]);

  const handleClose = () => {
    setIsScanning(false);
    setError(null);
    onClose();
  };

  const requestPermission = async () => {
    setError(null);
    setHasPermission(null);
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      setError(null);
    } catch (err) {
      setHasPermission(false);
      setError('Camera access denied. Please allow camera permissions in your browser settings.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Scan QR Code
          </DialogTitle>
          <DialogDescription>
            Position the QR code within the camera frame to mark your attendance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {hasPermission === false ? (
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">Camera Permission Required</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {error || "We need access to your camera to scan QR codes"}
                  </p>
                </div>
                <Button onClick={requestPermission} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Allow Camera Access
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              <div className="aspect-square bg-black rounded-lg overflow-hidden">
                {hasPermission && (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    className="w-full h-full object-cover"
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 400,
                      height: 400,
                      facingMode: "environment"
                    }}
                  />
                )}
              </div>
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="relative w-full h-full">
                  {/* Corner brackets */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary rounded-tl-lg"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary rounded-br-lg"></div>
                  
                  {/* Center square */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary/50 rounded-lg"></div>
                </div>
              </div>

              {isScanning && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-2 rounded-full text-sm font-medium">
                  Scanning for QR code...
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            {hasPermission && (
              <Button variant="outline" onClick={requestPermission} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Make sure the QR code is well-lit and clearly visible within the frame
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
