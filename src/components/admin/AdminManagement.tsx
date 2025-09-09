import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const AdminManagement: React.FC = () => {
  const { user } = useAuth();
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Only the main admin (e.g., with a specific email or flag) can add new admins
  const isMainAdmin = user?.role === "admin" && user?.email === "mainadmin@domain.com";

  const handleAddAdmin = async () => {
    setError(null);
    setSuccess(null);
    if (!isMainAdmin) {
      setError("Only the main admin can add new admins.");
      return;
    }
    if (!newAdminEmail) {
      setError("Please enter an email address.");
      return;
    }
    // TODO: Call backend API to add new admin with restricted permissions
    setSuccess(`Admin invite sent to ${newAdminEmail} (with restricted permissions)`);
    setNewAdminEmail("");
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Add New Admin</CardTitle>
      </CardHeader>
      <CardContent>
        {isMainAdmin ? (
          <>
            <Input
              type="email"
              placeholder="Admin email"
              value={newAdminEmail}
              onChange={e => setNewAdminEmail(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleAddAdmin} className="w-full mb-2">Add Admin</Button>
            {success && <div className="text-green-600 text-sm">{success}</div>}
            {error && <div className="text-red-600 text-sm">{error}</div>}
          </>
        ) : (
          <div className="text-red-600">Only the main admin can add new admins.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminManagement;
