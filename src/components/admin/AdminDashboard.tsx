import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeacherManagement } from "@/components/admin/TeacherManagement";
import { BrandManagement } from "@/components/admin/BrandManagement";
import { useAdminStats, useAttendanceTrends, useDepartmentStats, useRecentActivities } from "@/hooks/useAdminData";
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

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Use custom hooks to fetch live data
  const { stats, loading: statsLoading, error: statsError } = useAdminStats();
  const { trends, loading: trendsLoading } = useAttendanceTrends();
  const { departments, loading: deptLoading } = useDepartmentStats();
  const { activities, loading: activitiesLoading } = useRecentActivities();

  // Loading state
  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (statsError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading dashboard: {statsError}</p>
        </div>
      </div>
    );
  }

  // Use live data or fallback to defaults
  const systemStats = stats || {
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalClasses: 0,
    activeClasses: 0,
    pendingApprovals: 0,
    systemUptime: "N/A",
    avgAttendance: 0
  };

  const attendanceTrends = trends.length > 0 ? trends : [
    { month: "No Data", attendance: 0 }
  ];

  const departmentStats = departments.length > 0 ? departments : [
    { name: "No Departments", teachers: 0, students: 0, color: "#gray" }
  ];

  const recentActivities = activities.length > 0 ? activities : [
    { type: "system_info", message: "No recent activities", time: "N/A", icon: "Clock", created_at: new Date().toISOString() }
  ];

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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="teachers">Teacher Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="branding">Brand Management</TabsTrigger>
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
                {trendsLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading trends...</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={attendanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>Teachers and students by department</CardDescription>
              </CardHeader>
              <CardContent>
                {deptLoading ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading departments...</p>
                    </div>
                  </div>
                ) : (
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
                )}
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
              {activitiesLoading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading activities...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => {
                    // Map string icon names to actual icon components
                    const getIcon = (iconName: string) => {
                      switch (iconName) {
                        case 'UserCheck': return UserCheck;
                        case 'Users': return Users;
                        case 'TrendingUp': return TrendingUp;
                        case 'Clock': return Clock;
                        case 'BookOpen': return BookOpen;
                        case 'Calendar': return Calendar;
                        default: return Users;
                      }
                    };
                  
                  const Icon = getIcon(activity.icon);
                  
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
              )}
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

        <TabsContent value="branding" className="space-y-6">
          <BrandManagement />
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
