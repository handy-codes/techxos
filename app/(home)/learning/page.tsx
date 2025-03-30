// import CourseCard from "@/components/courses/CourseCard";
// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// // Define TypeScript types for the data structure
// interface PurchaseWithCourse {
//   course: {
//     id: string;
//     title: string;
//     instructorId: string;
//     subtitle: string | null;
//     description: string | null;
//     imageUrl: string | null;
//     price: number | null;
//     isPublished: boolean;
//     zoomLink: string | null;
//     categoryId: string;
//     subCategoryId: string;
//     levelId: string | null;
//     createdAt: Date;
//     updatedAt: Date;
//     category: {
//       id: string;
//       name: string;
//     } | null;
//     subCategory: {
//       id: string;
//       name: string;
//     } | null;
//     sections: Array<{
//       id: string;
//       title: string;
//       isPublished: boolean;
//     }>;
//   };
// }

// const LearningPage = async () => {
//   const { userId } = auth();

//   if (!userId) {
//     return redirect("/");
//   }

//   const purchasedCourses = await db.purchase.findMany({
//     where: {
//       userId: userId,
//     },
//     include: {
//       course: {
//         include: {
//           category: true,
//           subCategory: true,
//           sections: {
//             where: {
//               isPublished: true,
//             }
//           }
//         }
//       }
//     }
//   }) as PurchaseWithCourse[];

//   return (
//     <div className="px-4 py-6 mt-32 md:px-10 xl:px-16">
//       <h1 className="text-2xl font-bold">
//         Your courses
//       </h1>
//       <div className="flex flex-wrap gap-7 mt-7">
//         {purchasedCourses.length === 0 ? (
//           <div className="text-muted-foreground">
//             You have not purchased any courses yet
//           </div>
//         ) : (
//           purchasedCourses.map((purchase) => (
//             <CourseCard 
//               key={purchase.course.id} 
//               course={purchase.course} 
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default LearningPage;


// //import CourseCard from "@/components/courses/CourseCard"
// // import { db } from "@/lib/db"
// // import { auth } from "@clerk/nextjs/server"
// // import { redirect } from "next/navigation"

// // const LearningPage = async () => {
// //   const { userId } = auth()

// //   if (!userId) {
// //     return redirect('/sign-in')
// //   }

// //   const purchasedCourses = await db.purchase.findMany({
// //     where: {
// //       customerId: userId,
// //     },
// //     select: {
// //       course: {
// //         include: {
// //           category: true,
// //           subCategory: true,
// //           sections: {
// //             where: {
// //               isPublished: true,
// //             },
// //           }
// //         }
// //       }
// //     }
// //   })

// //   return (
// //     <div className="px-4 py-6 mt-32 md:px-10 xl:px-16">
// //       <h1 className="text-2xl font-bold">
// //         Your courses
// //       </h1>
// //       <div className="flex flex-wrap gap-7 mt-7">
// //         {purchasedCourses.map((purchase) => (
// //           <CourseCard key={purchase.course.id} course={purchase.course} />
// //         ))}
// //       </div>
// //     </div>
// //   )
// // }

// // export default LearningPage
