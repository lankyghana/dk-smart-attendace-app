import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { QRScanner } from "./QRScanner";
import { AttendanceService, AttendanceRecord } from "@/services/attendanceService";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  QrCode,
  Calendar,
  BookOpen,
  TrendingUp
} from "lucide-react";

// Mock student attendance data
const studentClasses = [
  {
    id: "1",
    className: "Mathematics 101",
    instructor: "Dr. Smith",
    schedule: "Mon, Wed, Fri 9:00 AM",
    nextClass: "2025-09-09 09:00",
    attendanceRate: 92,
    totalClasses: 25,
    attended: 23,
    status: "active"
  },
  {
    id: "2", 
    className: "Physics 201",
    instructor: "Prof. Johnson",
    schedule: "Tue, Thu 2:00 PM",
    nextClass: "2025-09-10 14:00",
    attendanceRate: 88,
    totalClasses: 20,
    attended: 17,
    status: "active"
  },
  {
    id: "3",
    className: "Chemistry Lab",
    instructor: "Dr. Wilson",
    schedule: "Wed 3:00 PM",
    nextClass: "2025-09-11 15:00", 
    attendanceRate: 95,
    totalClasses: 15,
    attended: 14,
    status: "active"
  }
];

export const StudentAttendance = () => {
  const [qrCode, setQrCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [attendanceStats, setAttendanceStats] = useState({
    totalClasses: 0,
    attended: 0,
    rate: 0,
    presentCount: 0,
    lateCount: 0,
    absentCount: 0
  });
  const { toast } = useToast();

  // Load attendance data on component mount
  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      const records = await AttendanceService.getStudentAttendance();
      const stats = await AttendanceService.getAttendanceStats();
      
      setRecentAttendance(records.slice(0, 5)); // Show last 5 records
      setAttendanceStats(stats);
    } catch (error) {
      console.error('Error loading attendance data:', error);
    }
  };

  const markAttendance = async (attendanceCode: string) => {
    if (!attendanceCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter or scan a valid attendance code",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Parse the QR code data (assuming it's JSON format from QRCodeGenerator)
      let attendanceData;
      try {
        attendanceData = JSON.parse(attendanceCode);
        
        // Validate QR code structure and expiry
        if (attendanceData.expiresAt && Date.now() > attendanceData.expiresAt) {
          toast({
            title: "Code Expired",
            description: "This QR code has expired. Please ask your instructor for a new one.",
            variant: "destructive",
          });
          return;
        }
        
        // Validate required fields
        if (!attendanceData.classId || !attendanceData.classCode) {
          throw new Error("Invalid QR code format");
        }
        
        // Use AttendanceService to mark attendance
        const result = await AttendanceService.markAttendance(attendanceData);
        
        if (result.success) {
          toast({
            title: "Attendance Marked!",
            description: result.message,
          });
          setQrCode("");
          
          // Refresh attendance data
          await loadAttendanceData();
        } else {
          toast({
            title: "Failed to Mark Attendance",
            description: result.message,
            variant: "destructive",
          });
        }
        
      } catch (parseError) {
        // If it's not JSON, treat it as a simple code and simulate validation
        const enrolledClassCodes = studentClasses.map(cls => cls.className.replace(/\s+/g, '_').toUpperCase());
        const isValidCode = enrolledClassCodes.some(code => attendanceCode.toUpperCase().includes(code)) ||
                           attendanceCode.includes('MATH101') || 
                           attendanceCode.includes('PHYS201') ||
                           attendanceCode.includes('CHEM_LAB');

        if (isValidCode) {
          // Create a mock attendance record for simple codes
          const mockData = {
            classId: `class_${Date.now()}`,
            className: "Unknown Class",
            classCode: attendanceCode,
            token: attendanceCode,
            timestamp: Date.now(),
            expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes from now
          };
          
          const result = await AttendanceService.markAttendance(mockData);
          
          if (result.success) {
            toast({
              title: "Attendance Marked!",
              description: result.message,
            });
            setQrCode("");
            await loadAttendanceData();
          } else {
            toast({
              title: "Failed to Mark Attendance",
              description: result.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Invalid Code",
            description: "The attendance code is invalid or not for your enrolled classes",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQRScanSuccess = (scannedCode: string) => {
    setQrCode(scannedCode);
    markAttendance(scannedCode);
  };

  const handleManualSubmit = () => {
    markAttendance(qrCode);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-800 border-green-200";
      case "late": return "bg-yellow-100 text-yellow-800 border-yellow-200";  
      case "absent": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present": return <CheckCircle className="h-4 w-4" />;
      case "late": return <Clock className="h-4 w-4" />;
      case "absent": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const overallAttendanceRate = attendanceStats.rate;

  return (
    <div className="min-h-screen p-3 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-responsive-2xl font-bold text-foreground text-wrap">My Attendance</h1>
        <p className="text-responsive-sm text-muted-foreground mt-1 text-wrap">
          Track your class attendance and mark yourself present
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Enrolled Classes</p>
                <p className="text-2xl font-bold">{studentClasses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Attendance</p>
                <p className="text-2xl font-bold">{overallAttendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-full">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Classes Attended</p>
                <p className="text-2xl font-bold">{attendanceStats.attended}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-full">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Classes</p>
                <p className="text-2xl font-bold">{attendanceStats.totalClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* QR Code Scanner */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Mark Attendance
            </CardTitle>
            <CardDescription>
              Scan QR code or enter the code provided by your instructor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Attendance Code</label>
              <Input
                placeholder="Enter QR code or attendance code"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              />
            </div>
            <Button 
              className="w-full bg-gradient-primary hover:shadow-glow"
              onClick={handleManualSubmit}
              disabled={isSubmitting || !qrCode.trim()}
            >
              {isSubmitting ? "Marking..." : "Mark Present"}
            </Button>
            <div className="text-center">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowQRScanner(true)}
              >
                <QrCode className="h-4 w-4" />
                Scan QR Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Your latest attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendance.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(record.status)}
                    <div>
                      <p className="font-medium text-sm">{record.class_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(record.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(record.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {recentAttendance.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <QrCode className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No attendance records yet</p>
                  <p className="text-xs">Start marking your attendance to see records here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Classes */}
      <Card className="glass mt-8">
        <CardHeader>
          <CardTitle>My Classes</CardTitle>
          <CardDescription>Overview of your enrolled classes and attendance rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {studentClasses.map((cls) => (
              <Card key={cls.id} className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{cls.className}</CardTitle>
                  <CardDescription>{cls.instructor}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Attendance Rate</span>
                    <Badge variant={cls.attendanceRate >= 90 ? "default" : cls.attendanceRate >= 75 ? "secondary" : "destructive"}>
                      {cls.attendanceRate}%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Classes Attended</span>
                    <span className="text-sm font-medium">{cls.attended}/{cls.totalClasses}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Schedule</span>
                    <p className="text-sm">{cls.schedule}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Next Class</span>
                    <p className="text-sm font-medium">
                      {new Date(cls.nextClass).toLocaleDateString("en-US", { 
                        weekday: "short", 
                        month: "short", 
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* QR Scanner Dialog */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScanSuccess}
      />
    </div>
  );
};
