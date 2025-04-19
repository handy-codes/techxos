"use client";

import React from 'react';

const NewsMarquee = () => {
  const newsText = "Techxos launches today - with a free JSS Mathematics class.     Date 19th-20th April 2025.     Time 05:00pm - 06:30pm.     Venue: Online Zoom Meeting.     Enroll now at our Mathematics page.     And sign up for a free zoom.com account or download zoom app.     ";

  return (
    <div className="w-full bg-primary text-primary-foreground py-2 overflow-hidden mt-4">
      <div className="max-w-[1400px] mx-auto px-0 flex justify-end">
        <div className="w-full md:w-[50%] relative">
          {/* Top News Badge - positioned at the end */}
          <div className="absolute top-0 right-0 z-10">
            <div 
              className="bg-[#FF0000] text-white px-6 py-1 clip-news font-bold"
              style={{
                clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
              }}
            >
              Top News!
            </div>
          </div>

          {/* Smooth Scrolling Marquee */}
          <div className="w-full overflow-hidden flex items-center h-8 bg-white relative">
            <div className="marquee-track whitespace-nowrap inline-flex will-change-transform">
              <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
              <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
              <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
              <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind Custom Styles */}
      <style jsx>{`
        .marquee-track {
          animation: marquee 60s linear infinite;
          display: inline-flex;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default NewsMarquee; 


// "use client";

// import React from 'react';

// const NewsMarquee = () => {
//   const newsText = "Techxos launches e-learning with a free JSS Mathematics course.     Date 19th-20th April 2025.     Time 05:00pm - 06:00pm.     Enroll now at our Mathematics page.     ";

//   return (
//     <div className="w-full bg-primary text-primary-foreground py-2 overflow-hidden mt-4">
//       <div className="max-w-[1400px] mx-auto px-0 flex justify-end">
//         <div className="w-full md:w-[50%] relative">
//           {/* Top News Badge - positioned at the end */}
//           <div className="absolute top-0 right-0 z-10">
//             <div 
//               className="bg-[#FF0000] text-white px-6 py-1 clip-news font-bold"
//               style={{
//                 clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
//               }}
//             >
//               Top News!
//             </div>
//           </div>

//           {/* Smooth Scrolling Marquee */}
//           <div className="w-full overflow-hidden flex items-center h-8 bg-white relative">
//             <div className="marquee-track whitespace-nowrap inline-flex will-change-transform">
//               <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
//               <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
//               <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
//               <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tailwind Custom Styles */}
//       <style jsx>{`
//         .marquee-track {
//           animation: marquee 40s linear infinite;
//           display: inline-flex;
//         }

//         @keyframes marquee {
//           0% {
//             transform: translateX(0%);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NewsMarquee; 