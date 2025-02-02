// import Image from 'next/image'
import React from 'react'

export default function Intro() {
  return (
    <div className="px-4 py-4 sm:p-8">
      <div className="bg-[white] text-[black] h-fit border border-[#003E8F] borders p-4 sm:p-8 gap-2 sm:gap-2 radius flex flex-col items-center">
      {/* <div className="bg-[#010101] border border-[#ECEFF1] borders text-[#E79D09] h-[40vh] p-4 sm:p-8 gap-2 sm:gap-2 radius flex flex-col items-center"> */}
        <h1 className='font-semibold text-[28px] text-[#003E8F] sm:text-[34px] md:text-5xl welcome-shadow'>Explore Our Courses</h1>
        <p className='text-[black] font-semibold text-justify text-[14px] max-sm:hidden md:px-44 md:text-[17px]'>
          Techxos is a dedicated online learning App. Made of local content, you can choose from our below well-curated 
          courses ranging from Coding to Accounting, Tourism & Aviation,
          as well as preparatory courses for ICAN, UTME, SSCE exams and so much more.<br/><br/>
        To upload and earn from your own quality course, <a href="mailto:sales@techxos.com" className='text-blue-900 font-bold'>contact sales</a></p>

        <p className='text-[black] font-semibold text-justify text-[15px] sm:text-[17px] sm:hidden'>
          Check out our well-curated 
          courses just for you - from Coding to Accounting, Tourism & Aviation,
          as well as preparatory courses for ICAN, UTME, SSCE exams etc.<br/><br/>
          To upload and earn from your own quality course, <a href="mailto:sales@techxos.com" className='text-blue-900 font-bold'>contact sales</a>
          {/* To upload and earn from your own quality course, please contact <span className='text-[#E79D09]'>sales@techxos.com.</span> */}
        </p>
      </div>
    </div>
  )
}

