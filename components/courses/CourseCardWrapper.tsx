import { clerkClient } from &quot;@clerk/nextjs/server&quot;;
import { db } from &quot;@/lib/db&quot;;
import CourseCard from &quot;./CourseCard&quot;;

interface CourseCardWrapperProps {
  course: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    isPublished: boolean;
    categoryId: string;
    subCategoryId: string;
    instructorId: string;
    levelId?: string;
  };
}

export default async function CourseCardWrapper({ course }: CourseCardWrapperProps) {
  const instructor = await clerkClient.users.getUser(course.instructorId);
  
  let level;
  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }

  return <CourseCard course={course} instructor={instructor} level={level} />;
} 