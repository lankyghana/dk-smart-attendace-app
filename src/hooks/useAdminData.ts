import { useState, useEffect } from 'react';
import { AdminDataService, AdminStats, AttendanceTrend, DepartmentStat, RecentActivity } from '@/services/adminDataService';

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminDataService.getSystemStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Subscribe to real-time updates
    const unsubscribe = AdminDataService.subscribeToUpdates(() => {
      fetchStats();
    });

    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}

export function useAttendanceTrends() {
  const [trends, setTrends] = useState<AttendanceTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AdminDataService.getAttendanceTrends();
        setTrends(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trends');
        console.error('Error fetching attendance trends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  return { trends, loading, error };
}

export function useDepartmentStats() {
  const [departments, setDepartments] = useState<DepartmentStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AdminDataService.getDepartmentStats();
        setDepartments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch departments');
        console.error('Error fetching department stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, loading, error };
}

export function useRecentActivities() {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AdminDataService.getRecentActivities();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch activities');
        console.error('Error fetching recent activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Subscribe to real-time updates for activities
    const unsubscribe = AdminDataService.subscribeToUpdates(() => {
      fetchActivities();
    });

    // Refresh activities every 2 minutes
    const interval = setInterval(fetchActivities, 2 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return { activities, loading, error };
}
