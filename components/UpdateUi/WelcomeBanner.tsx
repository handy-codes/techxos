import Image from 'next/image'
import React from 'react'

const WelcomeBanner = () => {
  return (
          <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-500">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-white">
                  <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                    Empowering Future Professionals
                  </h1>
                  <p className="text-xl mb-8">
                    At Techxos Coding Academy, we bridge the gap between education and
                    real-world experience through our modern, in-demand Tech courses. In this section, checkout our video courses to learn on the go or
                    create and upload a quality course and earn as users purchase the course.
                  </p>
                </div>
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Team Collaboration"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </section>
    
  )
}

export default WelcomeBanner