import { Course, Section } from "@prisma/client";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import Link from "next/link";

interface SectionMenuProps {
  course: Course & { sections: Section[] };
}

const SectionMenu = ({ course }: SectionMenuProps) => {
  return (
    <div className="z-60 md:hidden">
      <Sheet>
        <SheetTrigger>
          <Button>Chapters</Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <Link
            href={`/courses/${course.id}/overview`}
            className={`p-3 rounded-lg hover:bg-[#FFF8EB] text-[16px] mt-3`}
          >
            Overview
          </Link>
          <div className="overflow-y-auto max-h-screen flex flex-col gap-1 font-semibold text-[16px]">
            {course.sections
              .sort((a, b) => a.position - b.position) 
              .map((section) => (
                <Link
                  key={section.id}
                  href={`/courses/${course.id}/sections/${section.id}`}
                  className="p-3 rounded-lg hover:bg-[#FFF8EB] mt-1"
                >
                  {section.title}
                </Link>
              ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SectionMenu;
