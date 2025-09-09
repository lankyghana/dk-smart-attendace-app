import React from "react";
import RoleGuard from "@/components/ui/RoleGuard";
import AdminManagement from "@/components/admin/AdminManagement";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const AdminPage: React.FC = () => {
  return (
    <RoleGuard allowedRoles={["admin"]} fallback="/login">
      <div className="flex flex-col gap-8">
        <AdminDashboard />
        <AdminManagement />
      </div>
    </RoleGuard>
  );
};

export default AdminPage;
