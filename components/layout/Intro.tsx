import Image from 'next/image'
import React from 'react'

export default function Intro() {
  return (
    // <div className='p-8'>
    //     <div className="flex-row-reverse flex flex-wrap max-sm:gap-4 justify-center max-w-7xl mx-auto">
    //       <div className="radius bg-[#003B65] p-6 w-[90vw] sm:w-[45vw] h-[75vh] flex sm:content-center flex-col sm:items-center sm:justify-center">
    //         <h1 className='text-white text-[21px] font-medium sm:text-3xl'>Redefining Learning</h1>
    //         <p className='text-[#ABBECC] sm:text-justify pt-3 pb-3 text-[18px]'> 
    //           Techxos is a dedicated online learning App. Made of local content, you can access well-curated courses ranging from Coding to Accounting, Tourism & Aviation,
    //           as well as in preparatory courses for ICAN, UTME, SSCE exams and so much more. Learn at your own pace.
    //         </p>
    //       </div> 
    //       <div className=" max-sm:rounded-lg sm:inline-block w-[90vw] sm:w-[45vw] h-[75vh] ">
    //         <Image className='radius2 max-sm:border-4 max-sm:border-[#1a2e05] w-[100%] h-[85%] overflow-hidden object-cover' src={'/wandyboss2.jpg'} width={700} height={600} alt=''/>
    //         <div className="w-[100%] p-6 h-[15%] flex flex-col justify-center items-center bg-lime-950 py-4 text-white">
    //          <p className='text-xl'>Jonadab Omonigho</p>
    //          <p>Founder, CEO Techxos</p>
    //          {/* <p>HighKlass Intl Schools </p> */}
    //         </div>
    //       </div>
    //     </div>
    // </div>
    <div className="p-3 sm:p-8">
      <div className="bg-[#1A2E05] text-[#bdf086] h-[40vh] p-4 sm:p-8 gap-2 sm:gap-2 radius flex flex-col items-center">
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

