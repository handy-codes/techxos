import { db } from &quot;@/lib/db&quot;;
import { Course, Section } from &quot;@prisma/client&quot;;
import Link from &quot;next/link&quot;;
import { Progress } from &quot;../ui/progress&quot;;

interface CourseSideBarProps {
  course: Course & { sections: Section[] };
  studentId: string;
}

const CourseSideBar = async ({ course, studentId }: CourseSideBarProps) => {
  const publishedSections = await db.section.findMany({
    where: {
      courseId: course.id,
      isPublished: true,
    },
    orderBy: {
      position: &quot;asc&quot;,
    },
  });

  const publishedSectionIds = publishedSections.map((section) => section.id);

  const purchase = await db.purchase.findUnique({
    where: {
      customerId_courseId: {
        customerId: studentId,
        courseId: course.id,
      },
    },
  });

  const completedSections = await db.progress.count({
    where: {
      studentId,
      sectionId: {
        in: publishedSectionIds,
      },
      isCompleted: true,
    },
  });

  const progressPercentage =
    (completedSections / publishedSectionIds.length) * 100;

  return (
    <div className="hidden md:flex flex-col w-64 border-r shadow-md px-3 my-3 text-sm font-medium&quot;>
      <h1 className=&quot;text-lg font-bold text-center mb-4&quot;>{course.title}</h1>
      {purchase && (
        <div>
          <Progress value={progressPercentage} className=&quot;h-2&quot; />
          <p className=&quot;text-xs&quot;>{Math.round(progressPercentage)}% completed</p>
        </div>
      )}
      <Link
        href={`/courses/${course.id}/overview`}
        className={`p-3 rounded-lg hover:bg-[#FFF8EB] text-[16px] mt-3`}
      >
        Overview
      </Link>
      <div className=&quot;overflow-y-auto max-h-screen flex flex-col text-[16px] font-semibold&quot;>
        {publishedSections.map((section) => (
          <Link
            key={section.id}
            href={`/courses/${course.id}/sections/${section.id}`}
            className=&quot;p-3 rounded-lg hover:bg-[#FFF8EB] mt-2&quot;
          >
            {section.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseSideBar;



// import { db } from &quot;@/lib/db&quot;;
// import { Course, Section } from &quot;@prisma/client&quot;;
// import Link from &quot;next/link&quot;;
// import { Progress } from &quot;../ui/progress&quot;;
// import { CheckCircle, Lock, PlayCircle } from &quot;lucide-react&quot;;
// import { usePathname } from &quot;next/navigation&quot;;


// interface CourseSideBarProps {
//   course: Course & { sections: Section[] };
//   studentId: string;
// }

// const CourseSideBar = ({ course, studentId, publishedSections, completedSections, purchase }: CourseSideBarProps & { publishedSections: Section[], completedSections: number[], purchase: any }) => {
//   const pathname = usePathname();

//   const progressPercentage =
//   (completedSections.length / publishedSections.length) * 100;

//   return (
//     <div className=&quot;hidden md:flex flex-col w-64 border-r shadow-md px-3 my-3 text-sm font-medium&quot;>
//       <h1 className=&quot;text-lg font-bold text-center mb-4&quot;>{course.title}</h1>
//       {purchase && (
//         <div>
//           <Progress value={progressPercentage} className=&quot;h-2&quot; />
//           <p className=&quot;text-xs&quot;>{Math.round(progressPercentage)}% completed</p>
//         </div>
//       )}
// <Link
//   href={`/courses/${course.id}/overview`}
//   className={`p-3 rounded-lg hover:bg-[#FFF8EB] text-[16px] mt-3`}
// >
//   Overview
// </Link>
// <div className=&quot;overflow-y-auto max-h-screen flex flex-col text-[16px] font-semibold&quot;>
//   {publishedSections.map((section) => {
//     const isLocked = section.locked;
//     const isCompleted = completedSections.includes(section.id);
//     const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle);
//     const isActive = pathname?.includes(section.id.toString());

//     return (
//       <Link
//         key={section.id} // Added key prop to fix the bug
//         href={`/courses/${course.id}/sections/${section.id}`}
//         className={`p-3 rounded-lg hover:bg-[#FFF8EB] text-[16px] mt-3 ${isActive ? &apos;bg-[#FFF8EB]&apos; : &apos;&apos;}`}
//       >
//         <Icon className=&quot;mr-2&quot; />
//         {section.title}
//       </Link>
//     );
//   })}
//       </div>
//     </div>
//   );
// };

// const fetchCourseSideBarData = async (course: Course, studentId: string) => {
//   const publishedSections = await db.section.findMany({
//     where: {
//       courseId: course.id,
//       isPublished: true,
//     },
//     orderBy: {
//       position: &quot;asc",
//     },
//   });

//   const publishedSectionIds = publishedSections.map((section) => section.id);

//   const purchase = await db.purchase.findUnique({
//     where: {
//       customerId_courseId: {
//         customerId: studentId,
//         courseId: course.id,
//       },
//     },
//   });

//   const completedSections = await db.progress.findMany({
//     where: {
//       studentId,
//       sectionId: {
//         in: publishedSectionIds,
//       },
//       isCompleted: true,
//     },
//     select: {
//       sectionId: true,
//     },
//   }).then(progress => progress.map(p => p.sectionId));

//   return { publishedSections, purchase, completedSections };
// };

// export const getServerSideProps = async (context: any) => {
//   const { course, studentId } = context.params;
//   const { publishedSections, purchase, completedSections } = await fetchCourseSideBarData(course, studentId);

//   return {
//     props: {
//       course,
//       studentId,
//       publishedSections,
//       completedSections,
//       purchase,
//     },
//   };
// };


// export default CourseSideBar;
