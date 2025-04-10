import CreateCourseForm from "@/components/courses/CreateCourseForm"
import { db } from "@/lib/db"
import { Category, SubCategory } from "@prisma/client"

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
      name: "asc"
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