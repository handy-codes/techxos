"use client";

import { useUser } from "@clerk/nextjs";
import { Typewriter } from "react-simple-typewriter";
import NewsMarquee from "./NewsMarquee";

const Welcome = () => {
  const { user } = useUser();

  const getDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    } else if (user?.username) {
      return user.username.charAt(0).toUpperCase() + user.username.slice(1);
    }
    return "";
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  const showTypical = true;

  return (
    user && (
      <div className="relative z-10">
        <div className="mt-[120px] flex max-sm:flex-col bg-[white] flex-wrap px-3 sm:gap-2 items-center justify-start border-t-2 border-[#E79D09]">
          <div className="px-2 sm:pl-7 pt-4 flex items-center content-center justify-start flex-wrap gap-2 mb-3 welcome-shadow">
            <h1 className="text-[#003E8F] font-bold text-3xl sm:text-2xl">
              {getGreeting()}
            </h1>
            <span className="text-[yellow] bg-[blue] shadow-md py-1 px-2 rounded-sm font-bold text-3xl sm:text-2xl">
              {getDisplayName()}
            </span>
          </div>
          <div className="px-2 sm:pl-7 pt-2 sm:pt-4 flex items-center flex-wrap gap-2 mb-3 welcome-shadow">
            {showTypical && (
              <div className="text-[#003E8F] font-bold text-[20px] sm:text-2xl">
                You can now{" "}
                <span className="text-[#BF5800]">
                  <Typewriter
                    words={[
                      "Train Onsite",
                      "Buy a Course OR",
                      "Train Online",
                      "Be an Instructor"
                    ]}
                    loop={Infinity}
                    cursor
                    cursorStyle="|"
                    typeSpeed={80}
                    deleteSpeed={50}
                    delaySpeed={3000}
                  />
                </span>
              </div>
            )}
          </div>
        </div>
        <NewsMarquee />
      </div>
    )
  );
};

export default Welcome;
