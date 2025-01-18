"use client";

import { useUser } from "@clerk/nextjs";
import { Typewriter } from "react-simple-typewriter";

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
      <div className="flex flex-wrap px-3 sm:gap-2 items-center justify-start">
        <div className="px-2 sm:pl-7 pt-4 flex items-center justify-start flex-wrap gap-2 mb-3 welcome-shadow">
          <h1 className="text-[white] font-bold text-3xl sm:text-3xl">
            {getGreeting()},
          </h1>
          <span className="text-[#03FF01] font-bold text-3xl sm:text-3xl">
            {getDisplayName()}
          </span>
        </div>
        <div className="px-2 sm:pl-7 pt-2 sm:pt-4 flex items-center flex-wrap gap-2 mb-3 welcome-shadow">
          {showTypical && (
            <div className="text-[white] font-bold text-[26px] sm:text-3xl">
              Welcome back. You can{" "}
              {/* <span className="text-[#D9DD03]"> */}
              <span className="text-[#ebeb4c]">
              <Typewriter
                words={[
                  "Take a Course",
                  "Publish a Course",
                  "Join our Team",
                  "Contact Sales"
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
    )
  );
};

export default Welcome;
