import Image from 'next/image'
import React from 'react'
import FooterPage from "@/components/layout/Footer";


const page = () => {
  return (
  <>
  <div className=''>
    <div className="flex-row-reverse my-12  flex flex-wrap max-sm:gap-4 justify-center max-w-7xl mx-auto">
    <div className="radius content-center bg-[#003B65] p-6 w-[90vw] sm:w-[45vw] md:h-[75vh] h-fit flex sm:content-center flex-col sm:items-center sm:justify-center">
    <h1 className='text-white text-[21px] font-medium sm:text-3xl'>Redefining Learning</h1>
        <p className='text-[#ABBECC] sm:text-justify pt-3 pb-3 text-[18px]'> 
          Techxos is a dedicated online learning App. Made of local content, you can access well-curated courses ranging from Coding to Accounting, Tourism & Aviation,
          as well as in preparatory courses for ICAN, UTME, SSCE exams and so much more. Learn at your own pace.
        </p>
      </div> 
      <div className=" max-sm:rounded-lg sm:inline-block w-[90vw] sm:w-[45vw] h-[75vh] ">
        <Image className='radius2 max-sm:border-4 max-sm:border-[#1a2e05] w-[100%] h-[85%] overflow-hidden object-cover' src={'/wandyboss2.jpg'} width={700} height={600} alt=''/>
        <div className="w-[100%] p-6 h-[15%] flex flex-col justify-center items-center bg-lime-950 py-4 text-white">
         <p className='text-xl'>Jonadab Omonigho</p>
         <p>Founder, CEO Techxos</p>
         {/* <p>HighKlass Intl Schools </p> */}
        </div>
      </div>
    </div>


    {/* CTO SECTION */}
    <div className=" my-12 flex flex-wrap max-sm:gap-4 justify-center max-w-7xl mx-auto">
      <div className="radius content-center bg-[#003B65] p-6 w-[90vw] sm:w-[45vw] md:h-[75vh] h-fit flex sm:content-center flex-col sm:items-center sm:justify-center">
          <h1 className='text-white text-[21px] font-medium sm:text-3xl'>Leaverage Tech | eLearn now!</h1>
          <p className='text-[#ABBECC] sm:text-justify pt-3 pb-3 text-[18px]'> 
            When traditional 9-5pm work schedule leaves you with little time and energy to develop yourself
            further or to read and pass your college or professional exams, Techxos has got you covered!
          </p>
      </div> 
      <div className="max-sm:rounded-lg sm:inline-block w-[90vw] sm:w-[45vw] h-[75vh] ">
        <Image className='radius2 max-sm:border-4 max-sm:border-[#1a2e05] w-[100%] h-[85%] overflow-hidden object-cover' src={'/owo.jpg'} width={700} height={600} alt=''/>
        <div className="w-[100%] p-6 h-[15%] flex flex-col justify-center items-center bg-lime-950 py-4 text-white">
         <p className='text-xl'>Emeka Owo</p>
         <p>CTO & Cofounder, at Techxos</p>
         {/* <p>HighKlass Intl Schools </p> */}
        </div>
      </div>
    </div>
    <FooterPage/>
  </div>
  </>


  )
}

export default page