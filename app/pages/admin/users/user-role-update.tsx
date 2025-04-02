"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserRoleUpdateProps {
  user: {
    id: string;
    role: string;
  };
}

export function UserRoleUpdate({ user }: UserRoleUpdateProps) {
  const [isLoading, setIsLoading] = useState(false);
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

      router.refresh();
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={user.role}
        onChange={(e) => updateRole(e.target.value)}
        disabled={isLoading}
        className="border rounded px-2 py-1"
      >
        <option value="LEARNER">Learner</option>
        <option value="LECTURER">Lecturer</option>
        <option value="ADMIN">Admin</option>
        <option value="HEAD_ADMIN">Head Admin</option>
      </select>
      {isLoading && <span className="text-sm text-gray-500">Updating...</span>}
    </div>
  );
} 