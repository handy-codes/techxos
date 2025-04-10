import { auth } from &quot;@clerk/nextjs/server&quot;;
import { redirect } from &quot;next/navigation&quot;;

import CreateSectionForm from &quot;@/components/sections/CreateSectionForm&quot;;
import { db } from &quot;@/lib/db&quot;;

const CourseCurriculumPage = async ({ params }: { params: { courseId: string }}) => {
  const { userId } = auth()

  if (!userId) {
    return redirect(&quot;/sign-in&quot;)
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      instructorId: userId,
    },
    include: {
      sections: {
        orderBy: {
          position: &quot;asc&quot;,
        },
      },
    },
  });

  if (!course) {
    return redirect(&quot;/instructor/courses&quot;)
  }

  return (
    <CreateSectionForm course={course} />
  );
}

export default CourseCurriculumPage;