import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

const recentAttendance = [
  { date: "2025-09-06", class: "Mathematics 101", status: "present", time: "09:05 AM" },
  { date: "2025-09-05", class: "Physics 201", status: "present", time: "02:03 PM" },
  { date: "2025-09-04", class: "Chemistry Lab", status: "present", time: "03:01 PM" },
  { date: "2025-09-04", class: "Mathematics 101", status: "present", time: "09:02 AM" },
  { date: "2025-09-03", class: "Physics 201", status: "late", time: "02:15 PM" },
];

export const StudentAttendance = () => {
  const [qrCode, setQrCode] = useState("");

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

  const overallAttendanceRate = Math.round(
    studentClasses.reduce((acc, cls) => acc + cls.attendanceRate, 0) / studentClasses.length
  );

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
                <p className="text-2xl font-bold">
                  {studentClasses.reduce((acc, cls) => acc + cls.attended, 0)}
                </p>
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
                <p className="text-2xl font-bold">
                  {studentClasses.reduce((acc, cls) => acc + cls.totalClasses, 0)}
                </p>
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
              />
            </div>
            <Button className="w-full bg-gradient-primary hover:shadow-glow">
              Mark Present
            </Button>
            <div className="text-center">
              <Button variant="outline" className="gap-2">
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
                      <p className="font-medium text-sm">{record.class}</p>
                      <p className="text-xs text-muted-foreground">{record.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{record.time}</p>
                  </div>
                </div>
              ))}
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
    </div>
  );
};
