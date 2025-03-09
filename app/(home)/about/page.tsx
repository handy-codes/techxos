import Image from "next/image";
import {
  GlobeAltIcon,
  LightBulbIcon,
  UserGroupIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

const AboutPage = () => {
  return (
    <div className="min-h-screen mt-32 bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Empowering Future Professionals
              </h1>
              <p className="text-xl mb-8">
                At Wandytex Academy, we bridge the gap between education and
                real-world experience through our comprehensive skill
                development programs.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.pexels.com/photos/1181370/pexels-photo-1181370.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Team Collaboration"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-blue-50 rounded-xl transition hover:bg-blue-100">
              <UserGroupIcon className="h-12 w-12 mx-auto text-blue-600" />
              <h3 className="mt-4 text-3xl font-bold">5,000+</h3>
              <p className="mt-2 text-gray-600">Students Trained</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl transition hover:bg-purple-100">
              <BriefcaseIcon className="h-12 w-12 mx-auto text-purple-600" />
              <h3 className="mt-4 text-3xl font-bold">1,200+</h3>
              <p className="mt-2 text-gray-600">Internship Placements</p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl transition hover:bg-green-100">
              <GlobeAltIcon className="h-12 w-12 mx-auto text-green-600" />
              <h3 className="mt-4 text-3xl font-bold">85%</h3>
              <p className="mt-2 text-gray-600">Employment Rate</p>
            </div>
            <div className="p-6 bg-orange-50 rounded-xl transition hover:bg-orange-100">
              <LightBulbIcon className="h-12 w-12 mx-auto text-orange-600" />
              <h3 className="mt-4 text-3xl font-bold">50+</h3>
              <p className="mt-2 text-gray-600">Industry Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.pexels.com/photos/7689877/pexels-photo-7689877.jpeg?auto=compress&cs=tinysrgb&w=600"
                // src="/images/internship.jpg"
                alt="Internship Program"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="prose lg:prose-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-4">
                To provide transformative learning experiences that prepare
                students for successful careers through hands-on training and
                real-world internships.
              </p>
              <h3 className="text-xl font-semibold mt-8 mb-4">
                What Makes Us Different
              </h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>Industry-aligned curriculum</li>
                <li>Personalized career coaching</li>
                <li>Guaranteed internship placement</li>
                <li>Cutting-edge learning facilities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Internship Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Internship Journey
          </h2>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {[
              "Skill Assessment",
              "Custom Training",
              "Mentorship",
              "Placement",
            ].map((step, index) => (
              <div key={step} className="relative flex-1 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-gray-200 -z-10" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step}</h3>
                <p className="text-gray-600">
                  Comprehensive {step.toLowerCase()} program
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Leadership
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { role: "CEO", name: "Jonadab Areuya", image: "/wandyboss2.jpg" },
              { role: "CTO", name: "Phil Abioye", image: "https://images.pexels.com/photos/6584748/pexels-photo-6584748.jpeg?auto=compress&cs=tinysrgb&w=600" },
              {
                role: "Head of Training",
                name: "Alice Johnson",
                image: "https://images.pexels.com/photos/8872479/pexels-photo-8872479.jpeg?auto=compress&cs=tinysrgb&w=600",
              },
            ].map(({ role, name, image }) => (
              <div
                key={role}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition hover:shadow-xl"
              >
                <div className="relative h-64">
                  <Image
                    src={image}
                    alt={role}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{name}</h3>
                  <p className="text-gray-600">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;





// import Image from "next/image";
// import React from "react";
// // import FooterPage from "@/components/layout/Footer";

// const page = () => {
//   return (
//     <>
//       <div className="">
//         <h1 className="ml-[5%] sm:ml-14 my-auto gap-2 mx-auto mt-8 text-3xl sm:text-4xl font-bold">
//           Collaborating to{" "}
//           <span className="text-[#003E8F] text-4xl sm:text-4xl font-semibold">
//             Redefine
//           </span>
//           <br /> Learning
//         </h1>
//         <div className="flex-row-reverse mt-8  flex flex-wrap max-sm:gap-4 justify-center max-w-7xl mx-auto">
//           <div className="radiuser content-center bg-[#003B65] p-6 w-[90vw] sm:w-[45vw] sm:h-[75vh] h-fit flex sm:content-center flex-col sm:items-center sm:justify-center">
//             <h1 className="text-white text-[21px] font-medium sm:text-3xl">
//               Scale with Us
//             </h1>
//             <p className="text-[#ABBECC] sm:text-justify pt-3 pb-3 text-[18px]">
//               Techxos is a dedicated online learning App. Made of local content,
//               you can access well-curated courses ranging from Coding to
//               Accounting, Tourism & Aviation, as well as in preparatory courses
//               for ICAN, UTME, SSCE exams and so much more. Learn at your own
//               pace.
//             </p>
//           </div>
//           <div className="radius2 max-sm:rounded-lg sm:inline-block w-[90vw] sm:w-[45vw] h-[75vh] ">
//             <Image
//               className="radius4 max-sm:border-2 max-sm:border-[#1a2e05] w-[100%] h-[85%] overflow-hidden object-cover"
//               src={"/wandyboss2.jpg"}
//               width={700}
//               height={600}
//               alt=""
//             />
//             <div className=" w-[100%] p-6 h-[15%] flex flex-col justify-center items-center bg-lime-950 py-4 text-white">
//               <p className="text-xl">Jonadab Omonigho</p>
//               <p className="text-[14px] sm:text-sm">Founder, CEO Techxos</p>
//             </div>
//           </div>
//         </div>

//         {/* CTO SECTION */}
//         <div className=" my-12 flex flex-wrap max-sm:gap-4 justify-center max-w-7xl mx-auto">
//           <div className="radius3 content-center bg-[#003B65] p-6 w-[90vw] sm:w-[45vw] sm:h-[75vh] h-fit flex sm:content-center flex-col sm:items-center sm:justify-center">
//             <h1 className="text-white text-[21px] font-medium sm:text-3xl">
//               Leaverage Tech | e-Learn Today
//             </h1>
//             <p className="text-[#ABBECC] sm:text-justify pt-3 pb-3 text-[18px]">
//               When traditional 9-5pm work schedule leaves you with little time
//               and energy to develop yourself further or to read and pass your
//               college or professional exams, Techxos has got you covered. Your
//               instructors never sleep!
//             </p>
//           </div>
//           <div className=" max-sm:rounded-lg sm:inline-block w-[90vw] sm:w-[45vw] h-[75vh] ">
//             <Image
//               className="radius5 max-sm:border-2 max-sm:border-[#1a2e05] w-[100%] h-[85%] overflow-hidden object-cover"
//               src={"/owo.jpg"}
//               width={700}
//               height={600}
//               alt=""
//             />
//             <div className="w-[100%] p-6 h-[15%] flex flex-col justify-center items-center bg-lime-950 py-4 text-white">
//               <p className="text-xl">Emeka Owo</p>
//               <div className="flex items-center pb-1 gap-2 max-sm:gap-0justify-between ">
//                 <p className="text-[14px] sm:text-sm">
//                   CTO & Co-founder, at Techxos
//                 </p>
//                 <a
//                   href="https://www.linkedin.com/in/emeka-owo-204aaa2a5"
//                   target="_blank"
//                 >
//                   <Image
//                     className="rounded-full"
//                     src={"/linkedin4.png"}
//                     width={23}
//                     height={23}
//                     alt=""
//                   />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* <FooterPage /> */}
//       </div>
//     </>
//   );
// };

// export default page;
