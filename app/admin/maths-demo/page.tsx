import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import AdminCheck from "@/components/admin/AdminCheck";
import ModeToggle from "./components/mode-toggle";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export default async function MathsDemoPage() {
  const registrations = await db.mathsDemo.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch user information from Clerk
  const registrationsWithUserInfo = await Promise.all(
    registrations.map(async (registration) => {
      try {
        const user = await clerkClient.users.getUser(registration.userId);
        return {
          ...registration,
          userEmail: user.emailAddresses[0]?.emailAddress,
          userFirstName: user.firstName,
          userLastName: user.lastName,
        };
      } catch (error) {
        console.error(`Error fetching user info for ${registration.userId}:`, error);
        return registration;
      }
    })
  );

  return (
    <AdminCheck>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Maths Demo Registrations</h1>
          <ModeToggle />
        </div>
        <DataTable 
          columns={columns} 
          data={registrationsWithUserInfo as any[]} 
          searchKey="name" 
        />
      </div>
    </AdminCheck>
  );
} 