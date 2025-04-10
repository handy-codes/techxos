import getCoursesByCategory from &quot;@/app/actions/getCourses&quot;;
import CourseCard from &quot;@/components/courses/CourseCard&quot;;
import Categories from &quot;@/components/custom/Categories&quot;;
import { db } from &quot;@/lib/db&quot;;
import { Category, Course } from &quot;@prisma/client&quot;;

const CoursesByCategory = async ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const categories = await db.category.findMany({
    orderBy: {
      name: &quot;asc&quot;,
    },
  }) as Category[];

  const courses = await getCoursesByCategory(params.categoryId) as Course[];

  return (
    <div className="md:mt-5 md:px-10 xl:px-16 pb-16&quot;>
      <Categories categories={categories} selectedCategory={params.categoryId} />
      <div className=&quot;flex flex-wrap gap-7 justify-center">
        {courses.map((course: Course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesByCategory;
