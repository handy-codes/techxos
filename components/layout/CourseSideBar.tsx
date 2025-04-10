import { prisma } from "@/lib/db";
import { Course, Section } from "@prisma/client";
import Link from "next/link";
import { Progress } from "../ui/progress";

interface CourseSideBarProps {
  course: Course & { sections: Section[] };
  studentId: string;
}

const CourseSideBar = async ({ course, studentId }: CourseSideBarProps) => {
  const publishedSections = await prisma.section.findMany({
    where: {
      courseId: course.id,
      isPublished: true,
    },
    orderBy: {
      position: "asc",
    },
  });

  const publishedSectionIds = publishedSections.map((section) => section.id);

  const purchase = await prisma.purchase.findUnique({
    where: {
      customerId_courseId: {
        customerId: studentId,
        courseId: course.id,
      },
    },
  });

  const completedSections = await prisma.progress.count({
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
    <div className="hidden md:flex flex-col w-64 border-r shadow-md px-3 my-3 text-sm font-medium">
      <h1 className="text-lg font-bold text-center mb-4">{course.title}</h1>
      {purchase && (
        <div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs">{Math.round(progressPercentage)}% completed</p>
        </div>
      )}
      <Link
        href={`/courses/${course.id}/overview`}
        className={`p-3 rounded-lg hover:bg-[#FFF8EB] text-[16px] mt-3`}
      >
        Overview
      </Link>
      <div className="overflow-y-auto max-h-screen flex flex-col text-[16px] font-semibold">
        {publishedSections.map((section) => (
          <Link
            key={section.id}
            href={`/courses/${course.id}/sections/${section.id}`}
            className={`p-3 rounded-lg hover:bg-[#FFF8EB] text-[16px] mt-3 ${isActive ? 'bg-[#FFF8EB]' : ''}`}
          >
            {section.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseSideBar;



// import { db } from "@/lib/db";
// import { Course, Section } from "@prisma/client";
// import Link from "next/link";
// import { Progress } from "../ui/progress";
// import { CheckCircle, Lock, PlayCircle } from "lucide-react";
// import { usePathname } from "next/navigation";


// interface CourseSideBarProps {
//   course: Course & { sections: Section[] };
//   studentId: string;
// }

// const CourseSideBar = ({ course, studentId, publishedSections, completedSections, purchase }: CourseSideBarProps & { publishedSections: Section[], completedSections: number[], purchase: any }) => {
//   const pathname = usePathname();

//   const progressPercentage =
//   (completedSections.length / publishedSections.length) * 100;

//   return (
//     <div className="hidden md:flex flex-col w-64 border-r shadow-md px-3 my-3 text-sm font-medium">
//       <h1 className="text-lg font-bold text-center mb-4">{course.title}</h1>
//       {purchase && (
//         <div>
//           <Progress value={progressPercentage} className="h-2" />
//           <p className="text-xs">{Math.round(progressPercentage)}% completed</p>
//         </div>
//       )}
// <Link
//   href={`/courses/${course.id}/overview`}
//   className={`p-3 rounded-lg hover:bg-[#FFF8EB] text-[16px] mt-3`}
// >
//   Overview
// </Link>
// <div className="overflow-y-auto max-h-screen flex flex-col text-[16px] font-semibold">
//   {publishedSections.map((section) => {
//     const isLocked = section.locked;
//     const isCompleted = completedSections.includes(section.id);
//     const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle);
//     const isActive = pathname?.includes(section.id.toString());

//     return (
//       <Link
//         key={section.id} // Added key prop to fix the bug
//         href={`/courses/${course.id}/sections/${section.id}`}
//         className={`p-3 rounded-lg hover:bg-[#FFF8EB] text-[16px] mt-3 ${isActive ? 'bg-[#FFF8EB]' : ''}`}
//       >
//         <Icon className="mr-2" />
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
//       position: "asc",
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
