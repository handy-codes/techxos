"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";

interface UserRoleUpdateProps {
  user: {
    id: string;
    role: string;
    name?: string | null;
    email?: string;
  };
}

export function UserRoleUpdate({ user }: UserRoleUpdateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const updateRole = async (newRole: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/live-courses/project-mgt/user/role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      toast.success("User role updated");
      router.refresh();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async () => {
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete user ${user.name || user.email}?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete user");
      }

      toast.success("User deleted successfully");
      
      // Force reload the page to reflect the changes
      window.location.reload();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={user.role}
        onChange={(e) => updateRole(e.target.value)}
        disabled={isLoading || isDeleting}
        className="border rounded px-2 py-1"
      >
        <option value="LEARNER">Learner</option>
        <option value="LECTURER">Lecturer</option>
        <option value="ADMIN">Admin</option>
        <option value="HEAD_ADMIN">Head Admin</option>
      </select>
      
      <button
        onClick={deleteUser}
        disabled={isLoading || isDeleting}
        className="p-1 text-red-500 hover:bg-red-100 rounded"
        title="Delete user"
      >
        <FiTrash2 size={18} />
      </button>
      
      {isLoading && <span className="text-sm text-gray-500">Updating...</span>}
      {isDeleting && <span className="text-sm text-gray-500">Deleting...</span>}
    </div>
  );
} 