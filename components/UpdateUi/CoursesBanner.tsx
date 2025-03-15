import Image from 'next/image'
import React from 'react'

const WelcomeBanner = () => {
  return (
    // <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-500 to-teal-700">
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#5835F9]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image div moved to first position */}
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl order-first lg:order-none">
            <Image
              src="https://images.pexels.com/photos/5198239/pexels-photo-5198239.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Team Collaboration"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          {/* Text content div */}
          <div className="text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              On-campus Module
            </h1>
            <p className="text-xl mb-8">
              In our cozy training environment, we guide you hands-on, every step of the way, to ensure you get the best out of your learning experience. 
              Check out the following courses that you can enroll for, in-person.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WelcomeBanner