import getCoursesByCategory from "@/app/actions/getCourses";
import CourseCard from "@/components/courses/CourseCard";
import Categories from "@/components/custom/Categories";
import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";

const CoursesByCategory = async ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  }) as Category[];

  const courses = await getCoursesByCategory(params.categoryId) as Course[];

  return (
    <div className="md:mt-5 md:px-10 xl:px-16 pb-16">
      <Categories categories={categories} selectedCategory={params.categoryId} />
      <div className="flex flex-wrap gap-7 justify-center">
        {courses.map((course: Course) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            instructor={null} 
            level={course.level || null} 
          />
        ))}
      </div>
    </div>
  );
};

export default CoursesByCategory;
