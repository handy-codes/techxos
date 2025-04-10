import AlertBanner from &quot;@/components/custom/AlertBanner&quot;;
import EditSectionForm from &quot;@/components/sections/EditSectionForm&quot;;
import { db } from &quot;@/lib/db&quot;;
import { auth } from &quot;@clerk/nextjs/server&quot;;
import { redirect } from &quot;next/navigation&quot;;

const SectionDetailsPage = async ({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect(&quot;/sign-in&quot;);
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      instructorId: userId,
    },
  });

  if (!course) {
    return redirect(&quot;/instructor/courses&quot;);
  }

  const section = await db.section.findUnique({
    where: {
      id: params.sectionId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
      resources: true,
    },
  });

  if (!section) {
    return redirect(`/instructor/courses/${params.courseId}/sections`);
  }

  const requiredFields = [section.title, section.description, section.videoUrl];
  const requiredFieldsCount = requiredFields.length;
  const missingFields = requiredFields.filter((field) => !Boolean(field)); // Return falsy values: undefined, null, 0, false, NaN, &apos;&apos;
  const missingFieldsCount = missingFields.length;
  const isCompleted = requiredFields.every(Boolean);

  return (
    <div className="px-10">
      <AlertBanner
        isCompleted={isCompleted}
        requiredFieldsCount={requiredFieldsCount}
        missingFieldsCount={missingFieldsCount}
      />
      <EditSectionForm
        section={section}
        courseId={params.courseId}
        isCompleted={isCompleted}
      />
    </div>
  );
};

export default SectionDetailsPage;
