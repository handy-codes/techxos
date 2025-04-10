import { db } from &quot;@/lib/db&quot;
import { Course } from &quot;@prisma/client&quot;

const getCoursesByCategory = async (categoryId: string | null): Promise<Course[]> => {
  const whereClause: any = {
    ...(categoryId ? { categoryId, isPublished: true } : { isPublished: true }),
  }
  const courses = await db.course.findMany({
    where: whereClause,
    include: {
      category: true,
      subCategory: true,
      level: true,
      sections: {
        where: {
          isPublished: true,
        }
      },
    },
    orderBy: {
      createdAt: &quot;desc&quot;,
    },
  })

  return courses
}

export default getCoursesByCategory