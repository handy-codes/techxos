import { Course, Purchase } from "@prisma/client";

export type PurchaseWithCourse = Purchase & {
  course: Course;
}; 