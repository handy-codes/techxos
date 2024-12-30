
// import { clerkClient } from "@clerk/nextjs/server";
// import Image from "next/image";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ReadText from "@/components/custom/ReadText";
import SectionMenu from "@/components/layout/SectionMenu";

const CourseOverview = async ({ params }: { params: { courseId: string } }) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
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
    return redirect("/");
  }

  // const instructor = await clerkClient.users.getUser(course.instructorId);

  let level;

  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }

  return (
    <div className="px-6 py-4 flex flex-col gap-5 text-lg max-sm:font-semibold bg-[#ECEFF1]">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <SectionMenu course={course} />
      </div>
      <p><span className="text-green-600 text-[20px] font-extrabold">You may proceed to Chapters </span  > or see overview below</p>
      <p className="font-bold">{course.subtitle}</p>

      {/* <div className="flex gap-2 items-center">
        <Image
          src={
            instructor.imageUrl
              ? instructor.imageUrl
              : "/avatar_placeholder.jpg"
          }
          alt={instructor.fullName ? instructor.fullName : "Instructor photo"}
          width={30}
          height={30}
          className="rounded-full"
        />
        <p className="font-bold">Instructor:</p>
        <p>{instructor.fullName}</p>
      </div> */}

      <div className="flex gap-2">
        <p className="">Price:</p>
        <p>NGN{course.price}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-bold">Level:</p>
        <p>{level?.name}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="">Description:</p>
        <ReadText value={course.description!} />
      </div>
    </div>
  );
};

export default CourseOverview;
