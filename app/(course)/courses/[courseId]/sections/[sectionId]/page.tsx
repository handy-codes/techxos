import SectionsDetails from &quot;@/components/sections/SectionsDetails&quot;;
import { db } from &quot;@/lib/db&quot;;
import { auth } from &quot;@clerk/nextjs/server&quot;;
import { Resource } from &quot;@prisma/client&quot;;
import { redirect } from &quot;next/navigation&quot;;

const SectionDetailsPage = async ({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) => {
  const { courseId, sectionId } = params;
  const { userId } = auth();

  if (!userId) {
    return redirect(&quot;/sign-in&quot;);
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      isPublished: true,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
      },
    },
  });

  if (!course) {
    return redirect(&quot;/&quot;);
  }

  const section = await db.section.findUnique({
    where: {
      id: sectionId,
      courseId,
      isPublished: true,
    },
  });

  if (!section) {
    return redirect(`/courses/${courseId}/overview`);
  }

  const purchase = await db.purchase.findUnique({
    where: {
      customerId_courseId: {
        customerId: userId,
        courseId,
      },
    },
  });

  let muxData = null;
  let resources: Resource[] = [];

  if (section.isFree || purchase) {
    muxData = await db.muxData.findUnique({
      where: {
        sectionId,
      },
    });
  }

  if (purchase) {
    resources = await db.resource.findMany({
      where: {
        sectionId,
      },
    });
  }

  const progress = await db.progress.findUnique({
    where: {
      studentId_sectionId: {
        studentId: userId,
        sectionId,
      },
    },
  });

  return (
    <SectionsDetails
      course={course}
      section={section}
      purchase={purchase}
      muxData={muxData}
      resources={resources}
      progress={progress}
    />
  );
};

export default SectionDetailsPage;
