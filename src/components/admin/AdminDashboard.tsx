import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeacherManagement } from "@/components/admin/TeacherManagement";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Shield,
  TrendingUp,
  Calendar,
  Clock,
  Building,
  UserCheck,
  AlertTriangle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock admin dashboard data
const systemStats = {
  totalUsers: 1247,
  totalTeachers: 42,
  totalStudents: 1205,
  totalClasses: 156,
  activeClasses: 134,
  pendingApprovals: 8,
  systemUptime: "99.9%",
  avgAttendance: 87.5
};

const attendanceTrends = [
  { month: "Jan", attendance: 85 },
  { month: "Feb", attendance: 88 },
  { month: "Mar", attendance: 82 },
  { month: "Apr", attendance: 90 },
  { month: "May", attendance: 87 },
  { month: "Jun", attendance: 92 },
  { month: "Jul", attendance: 89 },
  { month: "Aug", attendance: 91 },
  { month: "Sep", attendance: 88 }
];

const departmentStats = [
  { name: "Computer Science", teachers: 12, students: 340, color: "#3b82f6" },
  { name: "Mathematics", teachers: 8, students: 280, color: "#10b981" },
  { name: "Physics", teachers: 6, students: 220, color: "#f59e0b" },
  { name: "Chemistry", teachers: 7, students: 190, color: "#ef4444" },
  { name: "Biology", teachers: 5, students: 175, color: "#8b5cf6" },
  { name: "English", teachers: 4, students: 0, color: "#06b6d4" }
];

const recentActivities = [
  { type: "teacher_registered", message: "New teacher Dr. Emily Chen registered", time: "2 hours ago", icon: UserCheck },
  { type: "class_created", message: "Quantum Physics class created", time: "4 hours ago", icon: BookOpen },
  { type: "system_alert", message: "High attendance rate in Computer Science", time: "6 hours ago", icon: TrendingUp },
  { type: "approval_pending", message: "5 teacher accounts pending approval", time: "1 day ago", icon: AlertTriangle },
  { type: "class_completed", message: "Linear Algebra semester completed", time: "2 days ago", icon: Calendar }
];

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          System overview and management tools
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="teachers">Teacher Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Teachers</p>
                    <p className="text-2xl font-bold">{systemStats.totalTeachers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-full">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Classes</p>
                    <p className="text-2xl font-bold">{systemStats.activeClasses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 rounded-full">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Attendance</p>
                    <p className="text-2xl font-bold">{systemStats.avgAttendance}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Trends */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>System-wide Attendance Trends</CardTitle>
                <CardDescription>Monthly attendance rates across all classes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>Teachers and students by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: dept.color }}
                        />
                        <div>
                          <p className="font-medium">{dept.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {dept.teachers} teachers • {dept.students} students
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{dept.teachers + dept.students}</p>
                        <p className="text-xs text-muted-foreground">total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent System Activities</CardTitle>
              <CardDescription>Latest updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">{activity.message}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers">
          <TeacherManagement />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>Coming soon - Advanced reporting and insights</CardDescription>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Advanced analytics features will be available soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">System configuration panel coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
