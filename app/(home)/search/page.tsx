import CourseCard from &quot;@/components/courses/CourseCard&quot;;
import { db } from &quot;@/lib/db&quot;
import { Course, Category, SubCategory, Section, Level } from &quot;@prisma/client&quot;

interface CourseWithDetails extends Course {
  category: Category;
  subCategory: SubCategory;
  level: Level;
  sections: Section[];
}

const SearchPage = async ({ searchParams }: { searchParams: { query: string }}) => {
  const queryText = searchParams.query || &apos;&apos;
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: queryText } },
        { category: { name: { contains: queryText } }},
        { subCategory: { name: { contains: queryText } }}
      ]
    },
    include: {
      category: true,
      subCategory: true,
      level: true,
      sections: {
        where: {
          isPublished: true,
        }
      }
    },
    orderBy: {
      createdAt: &apos;desc&apos;
    }
  }) as CourseWithDetails[];

  return (
    <div className="px-4 py-6 md:px-10 xl:px-16&quot;>
      <p className=&quot;text-lg md:text-2xl font-semibold mb-10&quot;>Recommended courses for {queryText}</p>
      <div className=&quot;flex gap-4 flex-wrap">
        {courses.map((course: CourseWithDetails) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

export default SearchPage