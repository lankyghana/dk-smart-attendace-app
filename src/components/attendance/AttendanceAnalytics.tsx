import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Calendar, Clock } from "lucide-react";

interface AttendanceAnalyticsProps {
  attendanceData: {
    totalStudents: number;
    presentToday: number;
    absentToday: number;
    averageAttendance: number;
    recentTrend: 'up' | 'down' | 'stable';
  };
}

export const AttendanceAnalytics: React.FC<AttendanceAnalyticsProps> = ({ attendanceData }) => {
  const { totalStudents, presentToday, absentToday, averageAttendance, recentTrend } = attendanceData;
  const attendanceRate = Math.round((presentToday / totalStudents) * 100);

  const getTrendColor = () => {
    switch (recentTrend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (recentTrend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
          <p className="text-xs text-muted-foreground">
            Enrolled in class
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{presentToday}</div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {attendanceRate}%
            </Badge>
            {" "}attendance rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{absentToday}</div>
          <p className="text-xs text-muted-foreground">
            Students not present
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageAttendance}%</div>
          <p className={`text-xs ${getTrendColor()}`}>
            {getTrendIcon()} {recentTrend === 'up' ? 'Improving' : recentTrend === 'down' ? 'Declining' : 'Stable'} trend
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
