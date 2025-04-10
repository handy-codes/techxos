"use client&quot;;

import { useState } from &quot;react&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import { FiTrash2 } from &quot;react-icons/fi&quot;;
import { toast } from &quot;react-hot-toast&quot;;

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
      const response = await fetch(&quot;/api/live-courses/project-mgt/user/role&quot;, {
        method: &quot;PUT&quot;,
        headers: {
          &quot;Content-Type&quot;: &quot;application/json&quot;,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error(&quot;Failed to update role&quot;);
      }

      toast.success(&quot;User role updated&quot;);
      router.refresh();
    } catch (error) {
      console.error(&quot;Error updating role:&quot;, error);
      toast.error(&quot;Failed to update role&quot;);
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
        method: &quot;DELETE&quot;,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || &quot;Failed to delete user&quot;);
      }

      toast.success(&quot;User deleted successfully&quot;);
      
      // Force reload the page to reflect the changes
      window.location.reload();
    } catch (error: any) {
      console.error(&quot;Error deleting user:&quot;, error);
      toast.error(error.message || &quot;Failed to delete user&quot;);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className=&quot;flex items-center space-x-2&quot;>
      <select
        value={user.role}
        onChange={(e) => updateRole(e.target.value)}
        disabled={isLoading || isDeleting}
        className=&quot;border rounded px-2 py-1&quot;
      >
        <option value=&quot;LEARNER&quot;>Learner</option>
        <option value=&quot;LECTURER&quot;>Lecturer</option>
        <option value=&quot;ADMIN&quot;>Admin</option>
        <option value=&quot;HEAD_ADMIN&quot;>Head Admin</option>
      </select>
      
      <button
        onClick={deleteUser}
        disabled={isLoading || isDeleting}
        className=&quot;p-1 text-red-500 hover:bg-red-100 rounded&quot;
        title=&quot;Delete user&quot;
      >
        <FiTrash2 size={18} />
      </button>
      
      {isLoading && <span className=&quot;text-sm text-gray-500&quot;>Updating...</span>}
      {isDeleting && <span className=&quot;text-sm text-gray-500">Deleting...</span>}
    </div>
  );
} 