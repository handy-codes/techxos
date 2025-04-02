import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { UserRoleUpdate } from "./user-role-update";

export default async function AdminUsersPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Get current user to check if they're an admin
  const currentUser = await db.liveClassUser.findUnique({
    where: { id: userId }
  });

  if (!currentUser || !["HEAD_ADMIN", "ADMIN"].includes(currentUser.role)) {
    redirect("/");
  }

  // Get all users
  const users = await db.liveClassUser.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <UserRoleUpdate user={user} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 