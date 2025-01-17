"use client";

// import React, { useState, useEffect } from "react";
// import Typical from "react-typical";
import { useUser } from "@clerk/nextjs";
import { Typewriter } from 'react-simple-typewriter';


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

  // const [showTypical, setShowTypical] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowTypical(true);
  //   }, 2000); // 2000 milliseconds (2 seconds) delay

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    user && (
      <div className="flex flex-wrap sm:gap-2 items-center justify-start">
        <div className="px-2 sm:pl-7 pt-4 flex items-center justify-start flex-wrap gap-2 mb-3 welcome-shadow">
          <h1 className="text-[white] text-3xl sm:text-3xl">
            {getGreeting()},
          </h1>
          <span className="text-[#03FF01] text-3xl sm:text-3xl">
            {getDisplayName()}
          </span>
        </div>
        <div className="px-2 sm:pl-7 pt-2 sm:pt-4 flex items-center flex-wrap gap-2 mb-3 welcome-shadow">
          {showTypical && (
            <div className="text-[#D9DD03] font-bold text-[22px] sm:text-3xl">
              <Typewriter
                words={["Welcome back to the platform!"]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default Welcome;
