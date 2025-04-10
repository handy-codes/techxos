import CourseSideBar from &quot;@/components/layout/CourseSideBar&quot;;
import Topbar from &quot;@/components/layout/Topbar&quot;;
import { db } from &quot;@/lib/db&quot;;
import { auth } from &quot;@clerk/nextjs/server&quot;;
import { redirect } from &quot;next/navigation&quot;;

const CourseDetailsLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect(&quot;/sign-in&quot;);
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: &quot;asc&quot;,
        },
      },
    },
  });

  if (!course) {
    return redirect(&quot;/&quot;);
  }

  return (
    <div className="h-full flex flex-col&quot;>
      <Topbar />
      <div className=&quot;flex-1 flex&quot;>
        <CourseSideBar course={course} studentId={userId} />
        <div className=&quot;flex-1">{children}</div>
      </div>
    </div>
  );
};

export default CourseDetailsLayout;
