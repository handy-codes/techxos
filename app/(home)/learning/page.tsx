import CourseCard from "@/components/courses/CourseCard"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Purchase, Course, Category, SubCategory, Section } from "@prisma/client"

interface CourseWithDetails extends Course {
  category: Category;
  subCategory: SubCategory;
  sections: Section[];
}

interface PurchaseWithCourse extends Purchase {
  course: CourseWithDetails;
}

const LearningPage = async () => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/sign-in')
  }

  const purchasedCourses = await db.purchase.findMany({
    where: {
      customerId: userId,
    },
    select: {
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
        {purchasedCourses.map((purchase: PurchaseWithCourse): JSX.Element => (
          <CourseCard key={purchase.course.id} course={purchase.course} />
        ))}
      </div>
    </div>
  )
}

export default LearningPage