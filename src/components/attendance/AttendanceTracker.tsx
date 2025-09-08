import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Download,
  Filter,
  Calendar,
  Users
} from "lucide-react";

// Mock attendance data
const attendanceRecords = [
  {
    id: "1",
    studentId: "STU001",
    studentName: "Alice Johnson",
    classId: "CS101",
    className: "Computer Science 101",
    timestamp: new Date("2024-01-15T09:05:00"),
    status: "present" as const,
    location: "Room A-101",
  },
  {
    id: "2", 
    studentId: "STU002",
    studentName: "Bob Smith",
    classId: "CS101",
    className: "Computer Science 101", 
    timestamp: new Date("2024-01-15T09:03:00"),
    status: "present" as const,
    location: "Room A-101",
  },
  {
    id: "3",
    studentId: "STU003", 
    studentName: "Carol Davis",
    classId: "CS101",
    className: "Computer Science 101",
    timestamp: new Date("2024-01-15T09:15:00"),
    status: "late" as const,
    location: "Room A-101",
  },
  {
    id: "4",
    studentId: "STU004",
    studentName: "David Wilson", 
    classId: "CS201",
    className: "Data Structures",
    timestamp: new Date("2024-01-15T11:02:00"),
    status: "present" as const,
    location: "Lab B-205",
  },
  {
    id: "5",
    studentId: "STU005",
    studentName: "Eva Brown",
    classId: "WEB301", 
    className: "Web Development",
    timestamp: null,
    status: "absent" as const,
    location: "Computer Lab C-301",
  },
];

const classStats = [
  {
    classId: "CS101",
    className: "Computer Science 101",
    totalStudents: 45,
    present: 35,
    late: 5,
    absent: 5,
    attendanceRate: 89,
  },
  {
    classId: "CS201", 
    className: "Data Structures",
    totalStudents: 38,
    present: 32,
    late: 3,
    absent: 3,
    attendanceRate: 92,
  },
  {
    classId: "WEB301",
    className: "Web Development", 
    totalStudents: 52,
    present: 41,
    late: 6,
    absent: 5,
    attendanceRate: 90,
  },
];

export const AttendanceTracker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "all" || record.classId === selectedClass;
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "late":
        return <Clock className="h-4 w-4 text-warning" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      present: "default",
      late: "secondary", 
      absent: "destructive",
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  const exportAttendance = () => {
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Student ID,Student Name,Class,Status,Timestamp\n" +
      filteredRecords.map(record => 
        `${record.studentId},${record.studentName},${record.className},${record.status},${record.timestamp?.toISOString() || 'N/A'}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 animate-fade-in min-w-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-wrap">Attendance Tracking</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base text-wrap">Monitor and manage student attendance</p>
        </div>
        <Button 
          onClick={exportAttendance} 
          variant="outline" 
          className="flex items-center gap-2 touch-target mobile-full-width sm:w-auto"
        >
          <Download className="h-4 w-4" />
          <span className="text-wrap">Export CSV</span>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 text-sm">
          <TabsTrigger value="overview" className="text-wrap">Class Overview</TabsTrigger>
          <TabsTrigger value="records" className="text-wrap">Attendance Records</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {classStats.map((classItem, index) => (
              <Card 
                key={classItem.classId}
                className="glass shadow-card hover:shadow-elevated transition-spring animate-slide-up touch-target"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-3 p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-wrap">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <span className="min-w-0">{classItem.className}</span>
                  </CardTitle>
                  <CardDescription className="text-wrap">{classItem.classId}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground text-wrap">Attendance Rate</span>
                    <Badge variant={classItem.attendanceRate >= 90 ? "default" : "secondary"}>
                      {classItem.attendanceRate}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-success" />
                        Present
                      </span>
                      <span className="font-medium">{classItem.present}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-warning" />
                        Late
                      </span>
                      <span className="font-medium">{classItem.late}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-destructive" />
                        Absent
                      </span>
                      <span className="font-medium">{classItem.absent}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs text-muted-foreground mb-1">
                      {classItem.present + classItem.late} / {classItem.totalStudents} students
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${classItem.attendanceRate}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="records" className="space-y-4 sm:space-y-6">
          {/* Filters */}
          <Card className="glass shadow-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-wrap">Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-wrap">Search Students</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 touch-target"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-wrap">Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="touch-target">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="CS101">CS101 - Computer Science 101</SelectItem>
                      <SelectItem value="CS201">CS201 - Data Structures</SelectItem>
                      <SelectItem value="WEB301">WEB301 - Web Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-wrap">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="touch-target">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card className="glass shadow-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-wrap">Attendance Records</span>
              </CardTitle>
              <CardDescription className="text-wrap">
                Showing {filteredRecords.length} of {attendanceRecords.length} records
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="rounded-md border overflow-x-auto">
                <Table className="table-responsive">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Student</TableHead>
                      <TableHead className="mobile-hidden tablet-table-cell min-w-[120px]">Class</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="mobile-hidden sm:table-cell min-w-[100px]">Timestamp</TableHead>
                      <TableHead className="mobile-hidden lg:table-cell min-w-[100px]">Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="min-w-0">
                          <div>
                            <div className="font-medium text-wrap">{record.studentName}</div>
                            <div className="text-sm text-muted-foreground text-wrap">{record.studentId}</div>
                          </div>
                        </TableCell>
                        <TableCell className="mobile-hidden tablet-table-cell min-w-0">
                          <div>
                            <div className="font-medium text-wrap">{record.className}</div>
                            <div className="text-sm text-muted-foreground text-wrap">{record.classId}</div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-0">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(record.status)}
                            {getStatusBadge(record.status)}
                          </div>
                        </TableCell>
                        <TableCell className="mobile-hidden sm:table-cell min-w-0">
                          {record.timestamp ? (
                            <div>
                              <div className="font-medium text-wrap">
                                {record.timestamp.toLocaleDateString()}
                              </div>
                              <div className="text-sm text-muted-foreground text-wrap">
                                {record.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="mobile-hidden lg:table-cell text-sm text-muted-foreground text-wrap min-w-0">
                          {record.location}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};