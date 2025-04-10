'use client';

import { Gem } from &quot;lucide-react&quot;;
import Image from &quot;next/image&quot;;
import Link from &quot;next/link&quot;;

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    isPublished: boolean;
    categoryId: string;
    subCategoryId: string;
    instructorId: string;
    levelId?: string;
  };
  instructor: {
    imageUrl?: string;
    fullName?: string;
  } | null;
  level: {
    name: string;
  } | null;
}

const CourseCard = ({ course, instructor, level }: CourseCardProps) => {
  return (
    <Link
      href={`/courses/${course.id}/overview`}
      className=&quot;border rounded-lg cursor-pointer bg-[white] text-black&quot;
    >
      <Image
        src={course.imageUrl ? course.imageUrl : &quot;/image_placeholder.webp&quot;}
        alt={course.title}
        width={500}
        height={300}
        className=&quot;rounded-t-xl w-[320px] h-[180px] object-cover&quot;
      />
      <div className="px-4 py-3 flex flex-col gap-2&quot;>
        <h2 className=&quot;text-lg font-bold hover:[#FDAB04]&quot;>{course.title}</h2>
        <div className=&quot;flex justify-between text-sm font-medium&quot;>
          {instructor && (
            <div className=&quot;flex gap-2 items-center&quot;>
              <Image
                src={
                  instructor.imageUrl
                    ? instructor.imageUrl
                    : &quot;/avatar_placeholder.jpg&quot;
                }
                alt={
                  instructor.fullName ? instructor.fullName : &quot;Instructor photo&quot;
                }
                width={30}
                height={30}
                className=&quot;rounded-full&quot;
              />
              <p>{instructor.fullName}</p>
            </div>
          )}
          {level && (
            <div className=&quot;flex gap-2&quot;>
              <Gem size={20} />
              <p>{level.name}</p>
            </div>
          )}
        </div>

        <p className=&quot;text-sm font-bold">NGN {course.price}</p>
      </div>
    </Link>
  );
};

export default CourseCard;
