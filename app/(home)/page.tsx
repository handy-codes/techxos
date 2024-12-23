import { db } from "@/lib/db";
import getCoursesByCategory from "../actions/getCourses";
import Categories from "@/components/custom/Categories";
import CourseCard from "@/components/courses/CourseCard";
import Intro from "@/components/layout/Intro";
import FooterPage from "@/components/layout/Footer";
import Slider from "../../components/layout/slider/Slider";
import Welcome from "@/components/layout/Welcome";

export default async function Home() {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  const courses = await getCoursesByCategory(null);
  return (
    <>
    <Slider/>
    {/* <div className="mb-0 bg-[#1F1F1F] text-white"> */}
    <div className="mb-0 bg-[#1C1F2E] text-white">
      <Welcome/>
      <Intro/>
      <div className="md:mt-5 mb-0 md:px-10 xl:px-16 pb-16">
        <Categories categories={categories} selectedCategory={null} />
        <div className="flex flex-wrap gap-7 justify-center">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>   
      </div>
        <FooterPage/>   
    </div>
    </>
  );
}
