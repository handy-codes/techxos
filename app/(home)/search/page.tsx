import CourseCard from "@/components/courses/CourseCard";
import { db } from "@/lib/db"
import { Course, Category, SubCategory, Section, Level } from "@prisma/client"

interface CourseWithDetails extends Course {
  category: Category;
  subCategory: SubCategory;
  level: Level;
  sections: Section[];
}

const SearchPage = async ({ searchParams }: { searchParams: { query: string }}) => {
  const queryText = searchParams.query || ''
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
      createdAt: 'desc'
    }
  }) as CourseWithDetails[];

  return (
    <div className="px-4 py-6 md:px-10 xl:px-16">
      <p className="text-lg md:text-2xl font-semibold mb-10">Recommended courses for {queryText}</p>
      <div className="flex gap-4 flex-wrap">
        {courses.map((course: CourseWithDetails) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            instructor={null}
            level={course.level || null}
          />
        ))}
      </div>
    </div>
  )
}

export default SearchPage