import { auth } from &quot;@clerk/nextjs/server&quot;;
import { redirect } from &quot;next/navigation&quot;;
import { db } from &quot;@/lib/db&quot;;
import { UserRoleUpdate } from &quot;./user-role-update&quot;;

// Define the User type to fix the TypeScript error
type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

export default async function AdminUsersPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect(&quot;/sign-in&quot;);
  }

  // Get current user to check if they're an admin
  const currentUser = await db.liveClassUser.findUnique({
    where: { id: userId }
  });

  if (!currentUser || ![&quot;HEAD_ADMIN&quot;, &quot;ADMIN&quot;].includes(currentUser.role)) {
    redirect(&quot;/&quot;);
  }

  // Get all users
  const users = await db.liveClassUser.findMany({
    orderBy: { createdAt: &quot;desc&quot; }
  });

  return (
    <div className="p-6&quot;>
      <h1 className=&quot;text-2xl font-bold mb-6&quot;>Manage Users</h1>
      <div className=&quot;space-y-4&quot;>
        {users.map((user: User) => (
          <div key={user.id} className=&quot;border p-4 rounded-lg&quot;>
            <div className=&quot;flex justify-between items-center&quot;>
              <div>
                <p className=&quot;font-medium&quot;>{user.name}</p>
                <p className=&quot;text-sm text-gray-500">{user.email}</p>
              </div>
              <UserRoleUpdate user={user} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 