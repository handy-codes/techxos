// import Image from 'next/image'
import React from 'react'

export default function Intro() {
  return (
    <div className="p-3 sm:p-8">
      <div className="bg-[#1A2E05] border border-[#ECEFF1] borders text-[#bbe98a] h-[40vh] p-4 sm:p-8 gap-2 sm:gap-2 radius flex flex-col items-center">
        <h1 className='sm:font-bold text-[28px] sm:text-[34px] md:text-5xl'>Our Course Gallery</h1>
        <p className='text-white text-justify text-[14px] max-sm:hidden md:px-44 md:text-[17px]'>
          Techxos is a dedicated online learning App. Made of local content, you can choose from our below well-curated 
          courses ranging from Coding to Accounting, Tourism & Aviation,
          as well as preparatory courses for ICAN, UTME, SSCE exams and so much more. Excell in your new-found career!
        </p>

        <p className='text-white text-justify text-[14px] sm:text-[17px] sm:hidden'>
          Expore our well-curated 
          courses - from Coding to Accounting, Tourism & Aviation,
          as well as preparatory courses for ICAN, UTME, SSCE exams and so much more. Excell in your new-found career!
        </p>
      </div>
    </div>
  )
}

