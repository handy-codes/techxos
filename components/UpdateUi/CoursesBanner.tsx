import Image from &apos;next/image&apos;
import React from &apos;react&apos;

const WelcomeBanner = () => {
  return (
    // <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-500 to-teal-700&quot;>
    <section className=&quot;relative py-20 px-4 sm:px-6 lg:px-8 bg-[#5835F9]&quot;>
      <div className=&quot;max-w-7xl mx-auto&quot;>
        <div className=&quot;grid lg:grid-cols-2 gap-12 items-center&quot;>
          {/* Image div moved to first position */}
          <div className=&quot;relative h-96 rounded-2xl overflow-hidden shadow-xl order-first lg:order-none&quot;>
            <Image
              src=&quot;https://images.pexels.com/photos/5198239/pexels-photo-5198239.jpeg?auto=compress&cs=tinysrgb&w=600&quot;
              alt=&quot;Team Collaboration&quot;
              fill
              className=&quot;object-cover&quot;
              priority
              sizes=&quot;(max-width: 768px) 100vw, 50vw&quot;
            />
          </div>
          
          {/* Text content div */}
          <div className=&quot;text-white&quot;>
            <h1 className=&quot;text-4xl sm:text-5xl font-bold mb-6&quot;>
              On-campus Module
            </h1>
            <p className=&quot;text-xl mb-8">
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