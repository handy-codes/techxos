import Image from &quot;next/image&quot;;
import React from &quot;react&quot;;
import { FaRegClock } from &quot;react-icons/fa6&quot;;
import { AiFillSchedule } from &quot;react-icons/ai&quot;;
import { HiLocationMarker } from &quot;react-icons/hi&quot;;
import { IoMdOptions } from &quot;react-icons/io&quot;;

const OnsiteClass = () => {
  return (
    <div className="p-4  md:p-10 &quot;>
      <div className=&quot;bg-white md:p-4 lg:p-10 rounded-lg shadow-lg&quot;>
        <div className=&quot;flex flex-col gap-4 md:flex-row h-[80vh]  mx-auto&quot;>
          <div className=&quot;w-[90vw] py-24 md:py-0 md:w-[55vw] h-[80vh] md:h-[80vh] text-[black] max-md:p-3 p-2 md:p-6&quot;>
            <div className=&quot;mt-4 md:mt-0 mb-4 md:mb-2 lg:mb-6&quot;>
              <h1 className=&quot;text-2xl lg:text-4xl font-bold mb-[4px]&quot;>
                FRONTEND DEVELOPMENT COURSE
              </h1>
              <div className=&quot;h-[8px] w-[80px] md:w-[150px] bg-[#E79D09]&quot;></div>
            </div>
            <h1 className=&quot;text-3xl text-green-800 lg:text-4xl font-extrabold mb-4 md:mb-2 lg:mb-6&quot;>
              150,000 NGN
            </h1>
            <p className=&quot;text-justify font-semibold max-sm:mb-1&quot;>
              In 12 weeks, be absorbed in our extensive Frontend Web Development
              course. Master the art of using ReactJs, TailwindCSS and the Color
              Theory, to create Websites people will love.
            </p>
            {/* <div
              className=&quot;p-2 md:p-4 mt-2 md:mt-3 mb-1 hover:bg-green-700 hover:text-white transition border rounded-md border-green-700 inline-block bg-white font-bold&quot;
              style={{ border: &quot;2px solid #38a169&quot; }}
            > */}
          <div className=&quot;p-2 md:p-4 mt-2 md:mt-3 mb-1 shadow-md hover:bg-green-700 hover:text-white transition-all duration-500 border-2 border-[#38a169] rounded-md inline-block bg-white font-bold border-solid&quot;>
              <a
                href=&quot;https://wa.me/2349038984567&quot;
                target=&quot;_blank&quot;
                rel=&quot;noopener noreferrer&quot;
              >
                Contact an Advisor
              </a>
            </div>
            <div className=&quot;font-semibold&quot;>
              <div className=&quot;flex items-center gap-3 mt-3 md:mt-4&quot;>
                <FaRegClock className=&quot;text-[black] font-bold text-[22px]&quot; />
                <span>Duration: 12 weeks</span>
              </div>
              <div className=&quot;flex items-center gap-3 mt-3 md:mt-4&quot;>
                <AiFillSchedule className=&quot;text-[black] font-bold text-[24px]&quot; />
                <span>Schedule: 9 hours/week</span>
              </div>
              <div className=&quot;flex items-center gap-3 mt-3 md:mt-4&quot;>
                <HiLocationMarker className=&quot;text-[black] font-bold text-[27px]&quot; />
                <span>Location: In-person or online</span>
              </div>
              <div className=&quot;flex items-center gap-3 mt-3 md:mt-4&quot;>
                <IoMdOptions className=&quot;text-[black] font-bold text-[24px]&quot; />
                <span>
                  Options: Evening Class, Executive (one-to-one) class
                </span>
              </div>
            </div>
          </div>
          <div className=&quot;w-[90vw] hidden md:flex md:w-[35vw] h-[80vh] relative&quot;>
            <Image
              src=&quot;https://images.pexels.com/photos/6000134/pexels-photo-6000134.jpeg?auto=compress&cs=tinysrgb&w=600&quot;
              // src=&quot;/gomycode1.png&quot;
              className=&quot;rounded-lg object-cover&quot;
              alt=&quot;Onsite Class&quot;
              layout=&quot;fill"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnsiteClass;
