import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  QrCode, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  LogOut
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

// Mock data for charts
const attendanceData = [
  { day: "Mon", present: 85, absent: 15 },
  { day: "Tue", present: 92, absent: 8 },
  { day: "Wed", present: 78, absent: 22 },
  { day: "Thu", present: 88, absent: 12 },
  { day: "Fri", present: 95, absent: 5 },
];

const weeklyTrends = [
  { week: "Week 1", attendance: 88 },
  { week: "Week 2", attendance: 92 },
  { week: "Week 3", attendance: 85 },
  { week: "Week 4", attendance: 90 },
];

const classDistribution = [
  { name: "Present", value: 88, color: "hsl(var(--success))" },
  { name: "Late", value: 7, color: "hsl(var(--warning))" },
  { name: "Absent", value: 5, color: "hsl(var(--destructive))" },
];

const recentClasses = [
  { id: "1", name: "Computer Science 101", time: "09:00 AM", students: 45, attended: 42 },
  { id: "2", name: "Data Structures", time: "11:00 AM", students: 38, attended: 35 },
  { id: "3", name: "Web Development", time: "02:00 PM", students: 52, attended: 49 },
];

export const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen p-3 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-responsive-2xl font-bold text-foreground text-wrap">
            Welcome back, Admin
          </h1>
          <p className="text-responsive-sm text-muted-foreground mt-1 text-wrap">
            {currentTime.toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })} • {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="responsive-grid mb-6 sm:mb-8">
        <Card className="glass shadow-card hover:shadow-elevated transition-spring animate-slide-up touch-target">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-responsive-sm font-medium text-muted-foreground text-wrap">Total Students</CardTitle>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-responsive-xl font-bold">1,234</div>
            <p className="text-responsive-xs text-success flex items-center gap-1 mt-1 text-wrap">
              <TrendingUp className="h-3 w-3 flex-shrink-0" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass shadow-card hover:shadow-elevated transition-spring animate-slide-up [animation-delay:100ms] touch-target">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-responsive-sm font-medium text-muted-foreground text-wrap">Active Classes</CardTitle>
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-responsive-xl font-bold">18</div>
            <p className="text-responsive-xs text-muted-foreground mt-1 text-wrap">
              3 classes today
            </p>
          </CardContent>
        </Card>

        <Card className="glass shadow-card hover:shadow-elevated transition-spring animate-slide-up [animation-delay:200ms]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88.5%</div>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +2.1% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="glass shadow-card hover:shadow-elevated transition-spring animate-slide-up [animation-delay:300ms]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">QR Codes Generated</CardTitle>
            <QrCode className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground mt-1">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="glass shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Daily Attendance
            </CardTitle>
            <CardDescription>Student attendance for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
                <Bar dataKey="present" fill="hsl(var(--success))" radius={4} />
                <Bar dataKey="absent" fill="hsl(var(--destructive))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Attendance Trends
            </CardTitle>
            <CardDescription>Weekly attendance percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Classes
            </CardTitle>
            <CardDescription>Latest class sessions and attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{classItem.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {classItem.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{classItem.attended}/{classItem.students}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((classItem.attended / classItem.students) * 100)}% attendance
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Attendance Distribution
            </CardTitle>
            <CardDescription>Overall attendance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={classDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {classDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {classDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};