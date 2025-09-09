import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, X, RotateCcw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (result: string) => void;
}

type PermissionState = 'unknown' | 'granted' | 'denied' | 'requesting';

export const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>('unknown');
  const [codeReader, setCodeReader] = useState<BrowserMultiFormatReader | null>(null);
  const { toast } = useToast();

  // Request camera permission
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      setPermissionState('requesting');
      setError(null);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Prefer back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Permission granted, stop the test stream
      stream.getTracks().forEach(track => track.stop());
      setPermissionState('granted');
      return true;
    } catch (err: any) {
      console.error('Camera permission error:', err);
      setPermissionState('denied');
      
      let errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please click the camera icon in your browser\'s address bar and allow camera access.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported in this browser. Please use Chrome, Firefox, or Safari.';
      }
      
      setError(errorMessage);
      toast({
        title: "Camera Access Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Initialize QR scanner
  const initializeScanner = useCallback(async () => {
    if (!webcamRef.current?.video || permissionState !== 'granted') {
      return;
    }

    try {
      setIsScanning(true);
      setError(null);
      
      const reader = new BrowserMultiFormatReader();
      setCodeReader(reader);
      
      // Start continuous scanning
      reader.decodeFromVideoDevice(undefined, webcamRef.current.video, (result, error) => {
        if (result) {
          const scannedText = result.getText();
          console.log('QR Code scanned:', scannedText);
          
          toast({
            title: "QR Code Scanned!",
            description: "Attendance code detected successfully",
          });
          
          onScanSuccess(scannedText);
          handleClose();
        }
        
        if (error && error.name !== 'NotFoundException') {
          console.error('Scanning error:', error);
        }
      });
    } catch (err) {
      console.error('Scanner initialization error:', err);
      setError('Failed to initialize QR scanner. Please try again.');
      setIsScanning(false);
    }
  }, [permissionState, onScanSuccess, toast]);

  // Handle webcam ready
  const handleWebcamReady = useCallback(() => {
    console.log('Webcam ready, initializing scanner...');
    // Small delay to ensure video element is properly initialized
    setTimeout(() => {
      initializeScanner();
    }, 500);
  }, [initializeScanner]);

  // Handle webcam error
  const handleWebcamError = useCallback((error: string | DOMException) => {
    console.error('Webcam error:', error);
    setPermissionState('denied');
    setError('Failed to access camera. Please check permissions and try again.');
  }, []);

  // Main effect for permission handling
  useEffect(() => {
    if (isOpen && permissionState === 'unknown') {
      requestCameraPermission();
    }
  }, [isOpen, permissionState, requestCameraPermission]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (codeReader) {
        codeReader.reset();
      }
      setIsScanning(false);
    };
  }, [codeReader]);

  const handleClose = () => {
    if (codeReader) {
      codeReader.reset();
      setCodeReader(null);
    }
    setIsScanning(false);
    setError(null);
    setPermissionState('unknown');
    onClose();
  };

  const handleRetryPermission = () => {
    setPermissionState('unknown');
    setError(null);
    requestCameraPermission();
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
          {permissionState === 'denied' ? (
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                <div>
                  <h3 className="font-semibold">Camera Permission Required</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {error || "We need access to your camera to scan QR codes"}
                  </p>
                </div>
                <Button onClick={handleRetryPermission} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : permissionState === 'requesting' ? (
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
                <div>
                  <h3 className="font-semibold">Requesting Camera Access</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please allow camera access when prompted
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              <div className="aspect-square bg-black rounded-lg overflow-hidden">
                {permissionState === 'granted' && (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    className="w-full h-full object-cover"
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: { ideal: 1280 },
                      height: { ideal: 720 },
                      facingMode: "environment"
                    }}
                    onUserMedia={handleWebcamReady}
                    onUserMediaError={handleWebcamError}
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
            {permissionState === 'denied' && (
              <Button variant="outline" onClick={handleRetryPermission} className="flex-1">
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
