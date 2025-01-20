import Image from "next/image";
import React from "react";
import { FaRegClock } from "react-icons/fa6";
import { AiFillSchedule } from "react-icons/ai";
import { HiLocationMarker } from "react-icons/hi";
import { IoMdOptions } from "react-icons/io";

const OnsiteClass = () => {
  return (
    <div className="p-4  md:p-10 ">
      <div className="bg-white md:p-4 lg:p-10 rounded-lg shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row h-[80vh]  mx-auto">
          <div className="w-[90vw] py-24 md:py-0 md:w-[55vw] h-[80vh] md:h-[80vh] text-[black] max-md:p-3 p-2 md:p-6">
            <div className="mt-4 md:mt-0 mb-4 md:mb-2 lg:mb-6">
              <h1 className="text-2xl lg:text-4xl font-bold mb-[4px]">
                FRONTEND DEVELOPMENT COURSE
              </h1>
              <div className="h-[8px] w-[80px] md:w-[150px] bg-[#E79D09]"></div>
            </div>
            <h1 className="text-3xl text-green-800 lg:text-4xl font-extrabold mb-4 md:mb-2 lg:mb-6">
              150,000 NGN
            </h1>
            <p className="text-justify font-semibold">
              In 12 weeks, be absorbed in our extensive Frontend Web Development
              course. Master the art of using ReactJs, TailwindCSS and the Color
              Theory, to create Websites people will love.
            </p>
            <div className="font-semibold">
              <div className="flex items-center gap-3 mt-4 md:mt-4">
                <FaRegClock className="text-[black] font-bold text-[22px]" />
                <span>Duration: 12 weeks</span>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-4">
                <AiFillSchedule className="text-[black] font-bold text-[24px]" />
                <span>Schedule: 9 hours/week</span>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-4">
                <HiLocationMarker className="text-[black] font-bold text-[27px]" />
                <span>Location: In-person or online</span>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-4">
                <IoMdOptions className="text-[black] font-bold text-[24px]" />
                <span>
                  Options: Evening Class, Executive (one-to-one) class
                </span>
              </div>
            </div>
          </div>
          <div className="w-[90vw] hidden md:flex md:w-[35vw] h-[80vh] relative">
            <Image
              src="https://images.pexels.com/photos/6000134/pexels-photo-6000134.jpeg?auto=compress&cs=tinysrgb&w=600"
              // src="/gomycode1.png"
              className="rounded-lg object-cover"
              alt="Onsite Class"
              layout="fill"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnsiteClass;
