import getCoursesByCategory from "@/app/actions/getCourses";
import CourseCard from "@/components/courses/CourseCard";
import Categories from "@/components/custom/Categories";
import { db } from "@/lib/db";
import { Category, Course, Level } from "@prisma/client";

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
  
  // Fetch level information for each course
  const coursesWithLevels = await Promise.all(
    courses.map(async (course) => {
      let level = null;
      if (course.levelId) {
        const levelData = await db.level.findUnique({
          where: { id: course.levelId },
        });
        if (levelData) {
          level = { name: levelData.name };
        }
      }
      return { ...course, level };
    })
  );

  return (
    <div className="md:mt-5 md:px-10 xl:px-16 pb-16">
      <Categories categories={categories} selectedCategory={params.categoryId} />
      <div className="flex flex-wrap gap-7 justify-center">
        {coursesWithLevels.map((course) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            instructor={null} 
            level={course.level} 
          />
        ))}
      </div>
    </div>
  );
};

export default CoursesByCategory;
