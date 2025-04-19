"use client";

import React from 'react';
import Link from 'next/link';

const NewsMarquee = () => {
  const newsText = "Techxos launches e-learning with a free JSS Mathematics course. Date 19th-20th April 2025. Time 05:00pm - 06:00pm. Enroll now at our Mathematics page. ";
  
  return (
    <div className="w-full bg-primary text-primary-foreground py-2 overflow-hidden mt-16">
      <div className="max-w-[1400px] mx-auto px-0 flex justify-end">
        <div className="w-full md:w-[50%] relative">
          {/* Top News Badge - positioned at the end */}
          <div className="absolute top-0 right-0 z-50">
            <div className="bg-[#FF0000] text-white px-6 py-1 clip-news font-bold" style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}>
              Top News!
            </div>
          </div>
          
          {/* News Marquee */}
          <div className="w-full overflow-hidden flex items-center h-8 bg-white">
            <div className="animate-marquee-right whitespace-nowrap inline-flex will-change-transform" style={{ paddingLeft: '50%' }}>
              <span className="inline-block mr-8 font-extrabold text-black">
                {newsText}
              </span>
              <span className="inline-block mr-8 font-extrabold text-black">
                {newsText}
              </span>
              <span className="inline-block mr-8 font-extrabold text-black">
                {newsText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsMarquee; 