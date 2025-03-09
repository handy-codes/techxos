import Image from 'next/image'
import React from 'react'

const WelcomeBanner = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-500 to-teal-700">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image div moved to first position */}
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl order-first lg:order-none">
            <Image
              src="https://media.istockphoto.com/id/1437931505/photo/businessman-digital-tablet-or-strategy-planning-in-hotel-conference-lobby-or-airport-travel.jpg?b=1&s=612x612&w=0&k=20&c=6w-GCbKnm5eKoWql1jxUN2DuJAKpZpI4d98F_nU8M5g="
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
              Empowering Future Professionals
            </h1>
            <p className="text-xl mb-8">
              At Wandytex Skill Acquisition Center, we bridge the gap between education and
              real-world experience through our comprehensive skill
              development programs. Checkout our array of courses. swwwwlw
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WelcomeBanner