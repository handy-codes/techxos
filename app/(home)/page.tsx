import { db } from &quot;@/lib/db&quot;;
import getCoursesByCategory from &quot;../actions/getCourses&quot;;
import Categories from &quot;@/components/custom/Categories&quot;;
import CourseCard from &quot;@/components/courses/CourseCard&quot;;
// import Intro from &quot;@/components/layout/Intro&quot;;
// import Slider from &quot;../../components/layout/slider/Slider&quot;;
// import Welcome from &quot;@/components/layout/Welcome&quot;;
// import OnsiteClass from &quot;@/components/layout/OnsiteClass&quot;;
// import WhatsAppLink from &quot;@/components/layout/WhatsAppLink&quot;;
import ScrollToTopButton from &quot;@/components/layout/ScrollToTopButton&quot;;
import HeroSection from &quot;@/components/layout/HeroSection&quot;;
// import FooterPage from &quot;@/components/layout/Footer&quot;;
import Courses from &quot;@/components/layout/Courses&quot;;
import WelcomeBanner from &quot;@/components/UpdateUi/WelcomeBanner&quot;;
import CoursesBanner from &quot;@/components/UpdateUi/CoursesBanner&quot;;
import Slider from &quot;@/components/layout/Slider&quot;;
import Testimonials from &quot;@/components/layout/Testimonials&quot;;
import { Category, Course, SubCategory } from &quot;@prisma/client&quot;;

// import TestimonialSection from &quot;@/components/layout/TestimonialSection&quot;;

interface CategoryWithSubCategories extends Category {
  subCategories: SubCategory[];
}

export default async function Home() {
  const categories = await db.category.findMany({
    orderBy: {
      name: &quot;asc&quot;,
    },
    include: {
      subCategories: {
        orderBy: {
          name: &quot;asc&quot;,
        },
      },
    },
  }) as CategoryWithSubCategories[];

  const courses = await getCoursesByCategory(null) as Course[];
  return (
    <main className="&quot;>
      {/* <Welcome /> */}
      <Slider />
      {/* <div className=&quot;mb-0 bg-[#1F1F1F] text-white&quot;> */}
      <div className=&quot;mb-0 bg-[white] text-white&quot;>
        {/* <div className=&quot;mb-0 bg-[#1C1F2E] text-white&quot;> */}
        <WelcomeBanner />
        <div className=&quot;md:mt-5 mb-0 md:px-10 xl:px-16 pb-16&quot;>
          {/* <span className=&quot;text-2xl md:text-3xl bg-black p-8 font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500 text-transparent bg-clip-text&quot;>
            WandyTex
          </span> */}
          <Categories categories={categories} selectedCategory={null} />
          <div className=&quot;flex flex-wrap gap-7 justify-center">
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
