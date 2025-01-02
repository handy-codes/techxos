import Image from 'next/image'
import React from 'react'
import FooterPage from "@/components/layout/Footer";


const page = () => {
  return (
  <>
  <div className=''>
      <h1 className="ml-[5%] sm:ml-14 my-auto gap-2 mx-auto mt-8 text-3xl sm:text-4xl font-bold">Collaborating to <span className='text-[#003E8F] text-4xl sm:text-4xl font-extrabold'>Redefine</span> <br /> Learning</h1>
    <div className="flex-row-reverse mt-8  flex flex-wrap max-sm:gap-4 justify-center max-w-7xl mx-auto">
    <div className="radius content-center bg-[#003B65] p-6 w-[90vw] sm:w-[45vw] sm:h-[75vh] h-fit flex sm:content-center flex-col sm:items-center sm:justify-center">
        <h1 className='text-white text-[21px] font-medium sm:text-3xl'>Scale with Us</h1>
        <p className='text-[#ABBECC] sm:text-justify pt-3 pb-3 text-[18px]'> 
          Techxos is a dedicated online learning App. Made of local content, you can access well-curated courses ranging from Coding to Accounting, Tourism & Aviation,
          as well as in preparatory courses for ICAN, UTME, SSCE exams and so much more. Learn at your own pace.
        </p>
      </div> 
      <div className="radius2 max-sm:rounded-lg sm:inline-block w-[90vw] sm:w-[45vw] h-[75vh] ">
        <Image className='radius4 max-sm:border-2 max-sm:border-[#1a2e05] w-[100%] h-[85%] overflow-hidden object-cover' src={'/wandyboss2.jpg'} width={700} height={600} alt=''/>
        <div className=" w-[100%] p-6 h-[15%] flex flex-col justify-center items-center bg-lime-950 py-4 text-white">
         <p className='text-xl'>Jonadab Omonigho</p>
         <p className='text-[14px] sm:text-sm'>Founder, CEO Techxos</p>
        </div>
      </div>
    </div>


    {/* CTO SECTION */}
    <div className=" my-12 flex flex-wrap max-sm:gap-4 justify-center max-w-7xl mx-auto">
      <div className="radius3 content-center bg-[#003B65] p-6 w-[90vw] sm:w-[45vw] sm:h-[75vh] h-fit flex sm:content-center flex-col sm:items-center sm:justify-center">
          <h1 className='text-white text-[21px] font-medium sm:text-3xl'>Leaverage Tech | e-Learn Today</h1>
          <p className='text-[#ABBECC] sm:text-justify pt-3 pb-3 text-[18px]'> 
            When traditional 9-5pm work schedule leaves you with little time and energy to develop yourself
            further or to read and pass your college or professional exams, Techxos has got you covered. Your instructors never sleep!
          </p>
      </div> 
      <div className=" max-sm:rounded-lg sm:inline-block w-[90vw] sm:w-[45vw] h-[75vh] ">
        <Image className='radius5 max-sm:border-2 max-sm:border-[#1a2e05] w-[100%] h-[85%] overflow-hidden object-cover' src={'/owo.jpg'} width={700} height={600} alt=''/>
        <div className="w-[100%] p-6 h-[15%] flex flex-col justify-center items-center bg-lime-950 py-4 text-white">
         <p className='text-xl'>Emeka Owo</p>
         <div className="flex items-center pb-1 gap-2 max-sm:gap-0justify-between ">
          <p className='text-[14px] sm:text-sm'>CTO & Co-founder, at Techxos</p>
          <a href="https://www.linkedin.com/in/emeka-owo-204aaa2a5" target='_blank'>          
              <Image className='rounded-full' src={'/linkedin4.png'} width={23} height={23} alt=''/>
          </a>
         </div>
        </div>
      </div>
    </div>
    <FooterPage/>
  </div>
  </>


  )
}

export default page


