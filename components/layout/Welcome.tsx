"use client&quot;;

import { useUser } from &quot;@clerk/nextjs&quot;;
import { Typewriter } from &quot;react-simple-typewriter&quot;;

const Welcome = () => {
  const { user } = useUser();

  const getDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    } else if (user?.username) {
      return user.username.charAt(0).toUpperCase() + user.username.slice(1);
    }
    return &quot;";
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return &quot;Good morning&quot;;
    } else if (currentHour < 18) {
      return &quot;Good afternoon&quot;;
    } else {
      return &quot;Good evening&quot;;
    }
  };

  const showTypical = true;

  return (
    user && (
<div className="mt-[120px] flex max-sm:flex-col bg-[white] flex-wrap px-3 sm:gap-2 items-center justify-start border-t-2 border-[#E79D09]&quot;>      {/* <div className=&quot;flex bg-[#F7D15C] flex-wrap px-3 sm:gap-2 items-center justify-start&quot;> */}
      {/* <div className=&quot;flex bg-[#111827] flex-wrap px-3 sm:gap-2 items-center justify-start&quot;> */}
        <div className=&quot;px-2 sm:pl-7 pt-4 flex items-center content-center justify-start flex-wrap gap-2 mb-3 welcome-shadow&quot;>
          <h1 className=&quot;text-[#003E8F] font-bold text-3xl sm:text-2xl&quot;>
            {getGreeting()}
          </h1>
          {/* <span className=&quot;text-[#BF5800] font-bold text-3xl sm:text-2xl&quot;> */}
          {/* <span className=&quot;text-[#47D1FD] bg-[#0F172A] p-2 font-bold text-3xl sm:text-2xl&quot;> */}
          <span className=&quot;text-[yellow] bg-[blue] shadow-md py-1 px-2 rounded-sm font-bold text-3xl sm:text-2xl&quot;>
            {getDisplayName()}
          </span>
        </div>
        <div className=&quot;px-2 sm:pl-7 pt-2 sm:pt-4 flex items-center flex-wrap gap-2 mb-3 welcome-shadow&quot;>
          {showTypical && (
            <div className=&quot;text-[#003E8F] font-bold text-[20px] sm:text-2xl&quot;>
              You can now{&quot; "}
              {/* <span className="text-[#D9DD03]&quot;> */}
              <span className=&quot;text-[#BF5800]&quot;>
              <Typewriter
                words={[
                  &quot;Train Onsite&quot;,
                  &quot;Buy a Course OR&quot;,
                  &quot;Train Online&quot;,
                  &quot;Be an Instructor&quot;
                ]}
                loop={Infinity}
                cursor
                cursorStyle=&quot;|"
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
