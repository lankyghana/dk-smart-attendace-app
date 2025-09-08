import { supabase } from "@/integrations/supabase/client";

export interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  class_name: string;
  instructor_id: string;
  attendance_code: string;
  timestamp: string;
  status: 'present' | 'late' | 'absent';
  location?: string;
}

export interface AttendanceSession {
  id: string;
  class_id: string;
  class_name: string;
  instructor_id: string;
  session_code: string;
  start_time: string;
  end_time: string;
  location?: string;
  is_active: boolean;
}

export class AttendanceService {
  // Mark attendance for a student using localStorage for now
  static async markAttendance(attendanceData: {
    classId: string;
    className: string;
    classCode: string;
    token: string;
    timestamp: number;
    expiresAt: number;
  }): Promise<{ success: boolean; message: string; record?: AttendanceRecord }> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, message: "User not authenticated" };
      }

      // Validate expiry time
      if (Date.now() > attendanceData.expiresAt) {
        return { success: false, message: "Attendance code has expired" };
      }

      // Get existing attendance records from localStorage
      const existingRecords = this.getLocalAttendanceRecords();
      
      // Check if attendance already marked for this session
      const isDuplicate = existingRecords.some(record => 
        record.student_id === user.id &&
        record.class_id === attendanceData.classId &&
        record.attendance_code === attendanceData.token
      );

      if (isDuplicate) {
        return { success: false, message: "Attendance already marked for this session" };
      }

      // Determine status based on timing
      const sessionStart = attendanceData.timestamp;
      const currentTime = Date.now();
      const timeDiff = currentTime - sessionStart;
      const graceMinutes = 15 * 60 * 1000; // 15 minutes grace period

      let status: 'present' | 'late' = 'present';
      if (timeDiff > graceMinutes) {
        status = 'late';
      }

      // Create attendance record
      const attendanceRecord: AttendanceRecord = {
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        student_id: user.id,
        class_id: attendanceData.classId,
        class_name: attendanceData.className,
        instructor_id: 'instructor_' + attendanceData.classId,
        attendance_code: attendanceData.token,
        timestamp: new Date().toISOString(),
        status: status,
      };

      // Save to localStorage
      const updatedRecords = [...existingRecords, attendanceRecord];
      localStorage.setItem('attendance_records', JSON.stringify(updatedRecords));

      return { 
        success: true, 
        message: `Attendance marked as ${status}`,
        record: attendanceRecord 
      };

    } catch (error) {
      console.error('Attendance service error:', error);
      return { success: false, message: "An unexpected error occurred" };
    }
  }

  // Get attendance records from localStorage
  static getLocalAttendanceRecords(): AttendanceRecord[] {
    try {
      const records = localStorage.getItem('attendance_records');
      return records ? JSON.parse(records) : [];
    } catch (error) {
      console.error('Error reading attendance records:', error);
      return [];
    }
  }

  // Get student's attendance records
  static async getStudentAttendance(studentId?: string): Promise<AttendanceRecord[]> {
    try {
      let userId = studentId;
      
      if (!userId) {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return [];
        userId = user.id;
      }

      const allRecords = this.getLocalAttendanceRecords();
      return allRecords
        .filter(record => record.student_id === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    } catch (error) {
      console.error('Error in getStudentAttendance:', error);
      return [];
    }
  }

  // Get attendance statistics for a student
  static async getAttendanceStats(studentId?: string): Promise<{
    totalClasses: number;
    attended: number;
    rate: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
  }> {
    try {
      const records = await this.getStudentAttendance(studentId);
      
      const totalClasses = records.length;
      const presentCount = records.filter(r => r.status === 'present').length;
      const lateCount = records.filter(r => r.status === 'late').length;
      const absentCount = records.filter(r => r.status === 'absent').length;
      const attended = presentCount + lateCount;
      const rate = totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : 0;

      return {
        totalClasses,
        attended,
        rate,
        presentCount,
        lateCount,
        absentCount
      };
    } catch (error) {
      console.error('Error calculating attendance stats:', error);
      return {
        totalClasses: 0,
        attended: 0,
        rate: 0,
        presentCount: 0,
        lateCount: 0,
        absentCount: 0
      };
    }
  }

  // Create attendance session (for instructors) - stored in localStorage for now
  static async createAttendanceSession(sessionData: {
    classId: string;
    className: string;
    instructorId: string;
    location?: string;
    durationMinutes?: number;
  }): Promise<{ success: boolean; session?: AttendanceSession; code?: string }> {
    try {
      const sessionCode = Math.random().toString(36).substring(2, 15);
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + (sessionData.durationMinutes || 15) * 60 * 1000);

      const session: AttendanceSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        class_id: sessionData.classId,
        class_name: sessionData.className,
        instructor_id: sessionData.instructorId,
        session_code: sessionCode,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        location: sessionData.location,
        is_active: true
      };

      // Save to localStorage
      const existingSessions = this.getLocalAttendanceSessions();
      const updatedSessions = [...existingSessions, session];
      localStorage.setItem('attendance_sessions', JSON.stringify(updatedSessions));

      return { success: true, session: session, code: sessionCode };
    } catch (error) {
      console.error('Error in createAttendanceSession:', error);
      return { success: false };
    }
  }

  // Get attendance sessions from localStorage
  static getLocalAttendanceSessions(): AttendanceSession[] {
    try {
      const sessions = localStorage.getItem('attendance_sessions');
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error reading attendance sessions:', error);
      return [];
    }
  }
}
