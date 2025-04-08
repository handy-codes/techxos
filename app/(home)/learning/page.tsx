import CourseCardWrapper from "@/components/courses/CourseCardWrapper"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

type Course = {
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
}

type Category = {
  id: string;
  name: string;
}

type SubCategory = {
  id: string;
  name: string;
}

type Section = {
  id: string;
  title: string;
  isPublished: boolean;
}

interface CourseWithDetails extends Course {
  category: Category;
  subCategory: SubCategory;
  sections: Section[];
}

interface PurchaseWithCourse {
  id: string;
  customerId: string;
  courseId: string;
  course: CourseWithDetails;
}

export default async function LearningPage() {
  const { userId } = auth()

  if (!userId) {
    return redirect('/sign-in')
  }

  const purchasedCourses = await db.purchase.findMany({
    where: {
      customerId: userId,
    },
    include: {
      course: {
        include: {
          category: true,
          subCategory: true,
          sections: {
            where: {
              isPublished: true,
            },
          }
        }
      }
    }
  }) as PurchaseWithCourse[]

  return (
    <div className="px-4 py-6 md:mt-5 md:px-10 xl:px-16">
      <h1 className="text-2xl font-bold">
        Your courses
      </h1>
      <div className="flex flex-wrap gap-7 mt-7">
        {purchasedCourses.map((purchase) => (
          <CourseCardWrapper key={purchase.course.id} course={purchase.course} />
        ))}
      </div>
    </div>
  )
}