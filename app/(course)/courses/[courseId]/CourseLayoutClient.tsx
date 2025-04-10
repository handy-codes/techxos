"use client";

import CourseSideBar from "@/components/layout/CourseSideBar";
import Topbar from "@/components/layout/Topbar";
import { Course, Section } from "@prisma/client";

interface CourseLayoutClientProps {
  children: React.ReactNode;
  course: Course & { sections: Section[] };
  userId: string;
}

const CourseLayoutClient = ({ children, course, userId }: CourseLayoutClientProps) => {
  return (
    <div className="h-full flex flex-col">
      <Topbar />
      <div className="flex-1 flex">
        <CourseSideBar course={course} studentId={userId} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default CourseLayoutClient; 