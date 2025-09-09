import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, Users, Download, Filter } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  attendanceStatus: 'present' | 'absent' | 'late';
  timestamp?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface LiveAttendanceTrackerProps {
  classId: string;
  className: string;
  students: Student[];
  onExportData: () => void;
}

export const LiveAttendanceTracker: React.FC<LiveAttendanceTrackerProps> = ({
  classId,
  className,
  students,
  onExportData
}) => {
  const [filter, setFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'time'>('name');

  const getStatusIcon = (status: Student['attendanceStatus']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: Student['attendanceStatus']) => {
    const variants = {
      present: 'default',
      late: 'secondary',
      absent: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const filteredStudents = students.filter(student => {
    if (filter === 'all') return true;
    return student.attendanceStatus === filter;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      // Sort by timestamp, putting present students first, then by time
      if (a.attendanceStatus === 'present' && b.attendanceStatus !== 'present') return -1;
      if (b.attendanceStatus === 'present' && a.attendanceStatus !== 'present') return 1;
      
      if (!a.timestamp && !b.timestamp) return 0;
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  const stats = {
    total: students.length,
    present: students.filter(s => s.attendanceStatus === 'present').length,
    late: students.filter(s => s.attendanceStatus === 'late').length,
    absent: students.filter(s => s.attendanceStatus === 'absent').length
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Late</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tracker */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Live Attendance - {className}</CardTitle>
              <CardDescription>
                Real-time attendance tracking
                {liveUpdates && (
                  <Badge variant="outline" className="ml-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                    Live
                  </Badge>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onExportData}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            {(['all', 'present', 'late', 'absent'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status}
                {status !== 'all' && (
                  <Badge variant="secondary" className="ml-1">
                    {status === 'present' ? stats.present : 
                     status === 'late' ? stats.late : 
                     status === 'absent' ? stats.absent : stats.total}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex gap-2 mb-4">
            <span className="text-sm font-medium">Sort by:</span>
            <Button
              variant={sortBy === 'name' ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              Name
            </Button>
            <Button
              variant={sortBy === 'time' ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy('time')}
            >
              Check-in Time
            </Button>
          </div>

          {/* Student List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sortedStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>
                      {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {student.timestamp && (
                    <span className="text-sm text-muted-foreground">
                      {formatTime(student.timestamp)}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    {getStatusIcon(student.attendanceStatus)}
                    {getStatusBadge(student.attendanceStatus)}
                  </div>
                </div>
              </div>
            ))}
            
            {sortedStudents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No students match the current filter
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
