import Image from "next/image";
import { dummyData } from "./dummyData";
import Link from "next/link";

interface CourseItem {
  id: number;
  img: string;
  title: string;
  comment: string;
  link?: string;
  reading: string;
}

export default function Courses() {
  return (
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="container mx-auto px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {dummyData.map((item: CourseItem) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:z-10"
                >
                  <div className="relative w-full  h-[30vh]">
                    <Image
                      src={item.img}
                      alt={`Card ${item.id}`}
                      fill // Fill the parent container
                      className="object-cover" // Ensure the image covers the area
                      sizes="(max-width: 640px) 100vw, (min-width: 640px) 40vh, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" // Responsive sizes
                    />
                  </div>
                  <div className="py-4 px-6 flex flex-col font-bold space-y-2 text-[#003E8F] text-left">
                    <h1 className="text-[24px] mb-2">{item.title}</h1>
                    <p className="text-black font-semibold flex text-left">{item.comment}</p>
                    <Link href={item.link || "#"} className="py-4 text-left flex">{item.reading}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  );
}