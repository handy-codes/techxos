import { prisma } from "@/lib/db";
import getCoursesByCategory from "../actions/getCourses";
import Categories from "@/components/custom/Categories";
import CourseCard from "@/components/courses/CourseCard";
// import Intro from "@/components/layout/Intro";
// import Slider from "../../components/layout/slider/Slider";
// import Welcome from "@/components/layout/Welcome";
// import OnsiteClass from "@/components/layout/OnsiteClass";
// import WhatsAppLink from "@/components/layout/WhatsAppLink";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import HeroSection from "@/components/layout/HeroSection";
// import FooterPage from "@/components/layout/Footer";
import Courses from "@/components/layout/Courses";
import WelcomeBanner from "@/components/UpdateUi/WelcomeBanner";
import CoursesBanner from "@/components/UpdateUi/CoursesBanner";
import Slider from "@/components/layout/Slider";
import Testimonials from "@/components/layout/Testimonials";
import { Category, Course, SubCategory } from "@prisma/client";

// import TestimonialSection from "@/components/layout/TestimonialSection";

interface CategoryWithSubCategories extends Category {
  subCategories: SubCategory[];
}

export default async function Home() {
  const categories = await prisma.category.findMany({
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
  }) as CategoryWithSubCategories[];

  const courses = await getCoursesByCategory(null) as Course[];
  return (
    <main className="">
      {/* <Welcome /> */}
      <Slider />
      {/* <div className="mb-0 bg-[#1F1F1F] text-white"> */}
      <div className="mb-0 bg-[white] text-white">
        {/* <div className="mb-0 bg-[#1C1F2E] text-white"> */}
        <WelcomeBanner />
        <div className="md:mt-5 mb-0 md:px-10 xl:px-16 pb-16">
          {/* <span className="text-2xl md:text-3xl bg-black p-8 font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500 text-transparent bg-clip-text">
            WandyTex
          </span> */}
          <Categories categories={categories} selectedCategory={null} />
          <div className="flex flex-wrap gap-7 justify-center">
            {courses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
        <CoursesBanner />
        <Courses />
        {/* <TestimonialSection/> */}
        {/* <OnsiteClass /> */}
        <HeroSection />
        <Testimonials />
        {/* <WhatsAppLink /> */}
        {/* <FooterPage/> */}
        <ScrollToTopButton />
      </div>
    </main>
  );
}
