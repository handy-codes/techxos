// import Image from 'next/image'
import React from 'react'

const Intro = () => {
  return (
    <div className='flex flex-col items-center justify-center py-10'>
      <h1 className='font-semibold text-[28px] text-[#003E8F] sm:text-[34px] md:text-5xl welcome-shadow'>Explore Our Courses</h1>
      <p className='text-[black] font-semibold text-justify text-[14px] max-sm:hidden md:px-44 md:text-[17px]'>
        Discover our comprehensive range of courses designed to help you master in-demand tech skills.
        From frontend development to data science, we offer courses that will take you from beginner to professional.
      </p>
      <p className='text-[black] font-semibold text-justify text-[15px] sm:text-[17px] sm:hidden'>
        Discover our comprehensive range of courses designed to help you master in-demand tech skills.
        From frontend development to data science, we offer courses that will take you from beginner to professional.
      </p>
      <p className='text-[black] font-semibold text-justify text-[14px] max-sm:hidden md:px-44 md:text-[17px]'>
        To upload and earn from your own quality course, <a href="mailto:sales@techxos.com" className='text-blue-900 font-bold'>contact sales</a>
      </p>
      {/* To upload and earn from your own quality course, please contact <span className='text-[#E79D09]'>sales@techxos.com.</span> */}
    </div>
  )
}

export default Intro

