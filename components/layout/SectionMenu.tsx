import { Course, Section } from &quot;@prisma/client&quot;;
import React from &quot;react&quot;;
import { Sheet, SheetContent, SheetTrigger } from &quot;../ui/sheet&quot;;
import { Button } from &quot;../ui/button&quot;;
import Link from &quot;next/link&quot;;

interface SectionMenuProps {
  course: Course & { sections: Section[] };
}

const SectionMenu = ({ course }: SectionMenuProps) => {
  return (
    <div className="z-60 md:hidden&quot;>
      <Sheet>
        <SheetTrigger>
          <Button>Chapters</Button>
        </SheetTrigger>
        <SheetContent className=&quot;flex flex-col&quot;>
          <Link
            href={`/courses/${course.id}/overview`}
            className={`p-3 rounded-lg hover:bg-[#FFF8EB] text-[16px] mt-3`}
          >
            Overview
          </Link>
          <div className=&quot;overflow-y-auto max-h-screen flex flex-col gap-1 font-semibold text-[16px]&quot;>
            {course.sections
              .sort((a, b) => a.position - b.position) 
              .map((section) => (
                <Link
                  key={section.id}
                  href={`/courses/${course.id}/sections/${section.id}`}
                  className=&quot;p-3 rounded-lg hover:bg-[#FFF8EB] mt-1"
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
