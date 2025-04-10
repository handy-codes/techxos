import Image from &quot;next/image&quot;;
import { dummyData } from &quot;./dummyData&quot;;
import Link from &quot;next/link&quot;;

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
        <div className="min-h-screen bg-gray-100 py-8&quot;>
          <div className=&quot;container mx-auto px-10&quot;>
            <div className=&quot;grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8&quot;>
              {dummyData.map((item: CourseItem) => (
                <div
                  key={item.id}
                  className=&quot;bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:z-10&quot;
                >
                  <div className=&quot;relative w-full  h-[30vh]&quot;>
                    <Image
                      src={item.img}
                      alt={`Card ${item.id}`}
                      fill // Fill the parent container
                      className=&quot;object-cover&quot; // Ensure the image covers the area
                      sizes=&quot;(max-width: 640px) 100vw, (min-width: 640px) 40vh, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw&quot; // Responsive sizes
                    />
                  </div>
                  <div className=&quot;py-4 px-6 flex flex-col font-bold space-y-2 text-[#003E8F] text-left&quot;>
                    <h1 className=&quot;text-[24px] mb-2&quot;>{item.title}</h1>
                    <p className=&quot;text-black font-semibold flex text-left&quot;>{item.comment}</p>
                    <Link href={item.link || &quot;#"} className="py-4 text-left flex">{item.reading}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  );
}