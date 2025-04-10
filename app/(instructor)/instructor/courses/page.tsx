import { auth } from &quot;@clerk/nextjs/server&quot;;
import Link from &quot;next/link&quot;;
import { redirect } from &quot;next/navigation&quot;;

import { Button } from &quot;@/components/ui/button&quot;;
import { db } from &quot;@/lib/db&quot;;
import { DataTable } from &quot;@/components/custom/DataTable&quot;;
import { columns } from &quot;@/components/courses/Columns&quot;;

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect(&quot;/sign-in&quot;);
  }

  const courses = await db.course.findMany({
    where: {
      instructorId: userId,
    },
    orderBy: {
      createdAt: &quot;desc&quot;,
    },
  });

  return (
    <div className="px-6 py-4&quot;>
      <Link href=&quot;/instructor/create-course&quot;>
        <Button>Create New Course</Button>
      </Link>

      <div className=&quot;mt-5">
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
};

export default CoursesPage;
