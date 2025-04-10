import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseLayoutClient from "./CourseLayoutClient";

const CourseDetailsLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
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
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  return <CourseLayoutClient course={course} userId={userId}>{children}</CourseLayoutClient>;
};

export default CourseDetailsLayout;
