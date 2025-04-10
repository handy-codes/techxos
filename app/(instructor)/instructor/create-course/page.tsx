import CreateCourseForm from &quot;@/components/courses/CreateCourseForm&quot;
import { db } from &quot;@/lib/db&quot;
import { Category, SubCategory } from &quot;@prisma/client&quot;

interface CategoryWithSubCategories extends Category {
  subCategories: SubCategory[];
}

interface CategoryOption {
  label: string;
  value: string;
  subCategories: {
    label: string;
    value: string;
  }[];
}

const CreateCoursePage = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      name: &quot;asc&quot;
    },
    include: {
      subCategories: true
    }
  }) as CategoryWithSubCategories[];

  return (
    <div>
      <CreateCourseForm categories={categories.map((category: CategoryWithSubCategories): CategoryOption => ({
        label: category.name,
        value: category.id,
        subCategories: category.subCategories.map((subcategory: SubCategory) => ({
          label: subcategory.name,
          value: subcategory.id
        }))
      }))} />
    </div>
  )
}

export default CreateCoursePage