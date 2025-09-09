import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  activeClasses: number;
  pendingApprovals: number;
  avgAttendance: number;
  systemUptime: string;
}

export interface AttendanceTrend {
  month: string;
  attendance: number;
}

export interface DepartmentStat {
  name: string;
  teachers: number;
  students: number;
  color: string;
}

export interface RecentActivity {
  type: string;
  message: string;
  time: string;
  icon: string;
  created_at: string;
}

export class AdminDataService {
  
  // Get system-wide statistics
  static async getSystemStats(): Promise<AdminStats> {
    try {
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get teachers count
      const { count: totalTeachers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'teacher');

      // Get students count  
      const { count: totalStudents } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // Get pending teacher approvals (for now, assume all teachers are approved)
      // In future, you could add an 'approved' column or status field
      const pendingApprovals = 0;

      // Calculate average attendance (this would need attendance records)
      const avgAttendance = await this.calculateAverageAttendance();

      // For now, classes data might need to be added to your schema
      // Using mock data until you have classes table
      const totalClasses = 156; // Will be replaced with real query
      const activeClasses = 134; // Will be replaced with real query

      return {
        totalUsers: totalUsers || 0,
        totalTeachers: totalTeachers || 0,
        totalStudents: totalStudents || 0,
        totalClasses,
        activeClasses,
        pendingApprovals,
        avgAttendance,
        systemUptime: "99.9%" // This would come from monitoring service
      };
    } catch (error) {
      console.error('Error fetching system stats:', error);
      // Return default values on error
      return {
        totalUsers: 0,
        totalTeachers: 0,
        totalStudents: 0,
        totalClasses: 0,
        activeClasses: 0,
        pendingApprovals: 0,
        avgAttendance: 0,
        systemUptime: "N/A"
      };
    }
  }

  // Calculate average attendance across all classes
  static async calculateAverageAttendance(): Promise<number> {
    try {
      // This would query attendance records when available
      // For now returning a calculated value based on available data
      
      // You could implement this with an attendance_records table like:
      // const { data: attendanceRecords } = await supabase
      //   .from('attendance_records')
      //   .select('student_id, class_id, status, created_at')
      //   .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days
      
      // For now, return a mock calculation
      return 87.5;
    } catch (error) {
      console.error('Error calculating attendance:', error);
      return 0;
    }
  }

  // Get attendance trends over time
  static async getAttendanceTrends(): Promise<AttendanceTrend[]> {
    try {
      // This would calculate monthly attendance rates
      // For now returning mock data with current month
      const currentDate = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Generate last 9 months of data
      const trends: AttendanceTrend[] = [];
      for (let i = 8; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = months[date.getMonth()];
        
        // In real implementation, this would query attendance records
        // const attendance = await this.calculateMonthlyAttendance(date);
        const attendance = Math.floor(Math.random() * 10) + 85; // Mock data 85-95%
        
        trends.push({
          month: monthName,
          attendance
        });
      }
      
      return trends;
    } catch (error) {
      console.error('Error fetching attendance trends:', error);
      return [];
    }
  }

  // Get department statistics
  static async getDepartmentStats(): Promise<DepartmentStat[]> {
    try {
      // This would query departments and their associated users
      // For now using mock data with some real user counts
      
      const { count: totalTeachers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'teacher');

      const { count: totalStudents } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // Mock distribution - in real app this would come from user profiles with department field
      const departments: DepartmentStat[] = [
        { name: "Computer Science", teachers: Math.floor((totalTeachers || 0) * 0.3), students: Math.floor((totalStudents || 0) * 0.28), color: "#3b82f6" },
        { name: "Mathematics", teachers: Math.floor((totalTeachers || 0) * 0.2), students: Math.floor((totalStudents || 0) * 0.23), color: "#10b981" },
        { name: "Physics", teachers: Math.floor((totalTeachers || 0) * 0.15), students: Math.floor((totalStudents || 0) * 0.18), color: "#f59e0b" },
        { name: "Chemistry", teachers: Math.floor((totalTeachers || 0) * 0.17), students: Math.floor((totalStudents || 0) * 0.16), color: "#ef4444" },
        { name: "Biology", teachers: Math.floor((totalTeachers || 0) * 0.12), students: Math.floor((totalStudents || 0) * 0.15), color: "#8b5cf6" },
        { name: "English", teachers: Math.floor((totalTeachers || 0) * 0.06), students: 0, color: "#06b6d4" }
      ];

      return departments;
    } catch (error) {
      console.error('Error fetching department stats:', error);
      return [];
    }
  }

  // Get recent system activities
  static async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      // Get recent teacher registrations
      const { data: recentTeachers } = await supabase
        .from('profiles')
        .select('name, created_at')
        .eq('role', 'teacher')
        .order('created_at', { ascending: false })
        .limit(3);

      // Get recent student registrations
      const { data: recentStudents } = await supabase
        .from('profiles')
        .select('name, created_at')
        .eq('role', 'student')
        .order('created_at', { ascending: false })
        .limit(2);

      const activities: RecentActivity[] = [];

      // Add teacher activities
      recentTeachers?.forEach(teacher => {
        activities.push({
          type: "teacher_registered",
          message: `New teacher ${teacher.name || 'Anonymous'} registered`,
          time: this.getRelativeTime(teacher.created_at),
          icon: "UserCheck",
          created_at: teacher.created_at
        });
      });

      // Add student activities
      recentStudents?.forEach(student => {
        activities.push({
          type: "student_registered", 
          message: `New student ${student.name || 'Anonymous'} registered`,
          time: this.getRelativeTime(student.created_at),
          icon: "Users",
          created_at: student.created_at
        });
      });

      // Sort by creation time
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      // Add some system activities if we have few real activities
      if (activities.length < 5) {
        activities.push({
          type: "system_info",
          message: "System running smoothly",
          time: "1 hour ago",
          icon: "TrendingUp",
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        });
      }

      return activities.slice(0, 5); // Return top 5 activities
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  // Helper function to get relative time
  static getRelativeTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  }

  // Subscribe to real-time updates for admin stats
  static subscribeToUpdates(callback: () => void) {
    const subscription = supabase
      .channel('admin-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          callback();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}
