import EditCourseForm from &quot;@/components/courses/EditCourseForm&quot;;
import AlertBanner from &quot;@/components/custom/AlertBanner&quot;;
import { db } from &quot;@/lib/db&quot;;
import { auth } from &quot;@clerk/nextjs/server&quot;;
import { redirect } from &quot;next/navigation&quot;;
import { Course, Section, Category, SubCategory, Level } from &quot;@prisma/client&quot;;

interface CourseWithSections extends Course {
  sections: Section[];
}

interface CategoryWithSubCategories extends Category {
  subCategories: SubCategory[];
}

const CourseBasics = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect(&quot;/sign-in&quot;);
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      instructorId: userId,
    },
    include: {
      sections: true,
    },
  }) as CourseWithSections | null;

  if (!course) {
    return redirect(&quot;/instructor/courses&quot;);
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: &quot;asc&quot;,
    },
    include: {
      subCategories: true,
    },
  }) as CategoryWithSubCategories[];

  const levels = await db.level.findMany();

  const requiredFields = [
    course.title,
    course.description,
    course.categoryId,
    course.subCategoryId,
    course.levelId,
    course.imageUrl,
    course.price,
    course.sections.some((section: Section) => section.isPublished),
  ];
  const requiredFieldsCount = requiredFields.length;
  const missingFields = requiredFields.filter((field) => !Boolean(field));
  const missingFieldsCount = missingFields.length;
  const isCompleted = requiredFields.every(Boolean);

  return (
    <div className="px-10 -mt-[-12%] mb-[12%]">
      <AlertBanner
        isCompleted={isCompleted}
        missingFieldsCount={missingFieldsCount}
        requiredFieldsCount={requiredFieldsCount}
      />
      <EditCourseForm
        course={course}
        categories={categories.map((category: CategoryWithSubCategories) => ({
          label: category.name,
          value: category.id,
          subCategories: category.subCategories.map((subcategory: SubCategory) => ({
            label: subcategory.name,
            value: subcategory.id,
          })),
        }))}
        levels={levels.map((level: Level) => ({
          label: level.name,
          value: level.id,
        }))}
        isCompleted={isCompleted}
      />
    </div>
  );
};

export default CourseBasics;
