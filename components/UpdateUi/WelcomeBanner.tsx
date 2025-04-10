import Image from &apos;next/image&apos;
import React from &apos;react&apos;

const WelcomeBanner = () => {
  return (
          <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-500&quot;>
            <div className=&quot;max-w-7xl mx-auto&quot;>
              <div className=&quot;grid lg:grid-cols-2 gap-12 items-center&quot;>
                <div className=&quot;text-white&quot;>
                  <h1 className=&quot;text-4xl sm:text-5xl font-bold mb-6&quot;>
                    Empowering Future Professionals
                  </h1>
                  <p className=&quot;text-xl mb-8&quot;>
                    At Techxos Coding Academy, we bridge the gap between education and
                    real-world experience through our modern, in-demand Tech courses. In this section, checkout our video courses to learn on the go or
                    create and upload a quality course and earn as users purchase the course.
                  </p>
                </div>
                <div className=&quot;relative h-96 rounded-2xl overflow-hidden shadow-xl&quot;>
                  <Image
                    src=&quot;https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?auto=compress&cs=tinysrgb&w=600&quot;
                    alt=&quot;Team Collaboration&quot;
                    fill
                    className=&quot;object-cover&quot;
                    priority
                    sizes=&quot;(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </section>
    
  )
}

export default WelcomeBanner