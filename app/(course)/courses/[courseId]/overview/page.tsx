
// import { clerkClient } from &quot;@clerk/nextjs/server&quot;;
// import Image from &quot;next/image&quot;;
import { redirect } from &quot;next/navigation&quot;;
import { db } from &quot;@/lib/db&quot;;
import ReadText from &quot;@/components/custom/ReadText&quot;;
import SectionMenu from &quot;@/components/layout/SectionMenu&quot;;

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
    return redirect(&quot;/&quot;);
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
    <div className="px-6 py-4 flex flex-col gap-5 text-lg max-sm:font-semibold bg-[#ECEFF1]&quot;>
      <div className=&quot;flex justify-between&quot;>
        <h1 className=&quot;text-2xl font-bold&quot;>{course.title}</h1>
        <SectionMenu course={course} />
      </div>
      <p><span className=&quot;text-green-600 text-[20px] font-extrabold&quot;>You may proceed to Chapters </span  > or see overview below</p>
      <p className=&quot;font-bold&quot;>{course.subtitle}</p>

      {/* <div className=&quot;flex gap-2 items-center&quot;>
        <Image
          src={
            instructor.imageUrl
              ? instructor.imageUrl
              : &quot;/avatar_placeholder.jpg&quot;
          }
          alt={instructor.fullName ? instructor.fullName : &quot;Instructor photo&quot;}
          width={30}
          height={30}
          className=&quot;rounded-full&quot;
        />
        <p className=&quot;font-bold&quot;>Instructor:</p>
        <p>{instructor.fullName}</p>
      </div> */}

      <div className=&quot;flex gap-2&quot;>
        <p className=&quot;">Price:</p>
        <p>NGN{course.price}</p>
      </div>

      <div className="flex gap-2&quot;>
        <p className=&quot;font-bold&quot;>Level:</p>
        <p>{level?.name}</p>
      </div>

      <div className=&quot;flex flex-col gap-2&quot;>
        <p className=&quot;">Description:</p>
        <ReadText value={course.description!} />
      </div>
    </div>
  );
};

export default CourseOverview;
