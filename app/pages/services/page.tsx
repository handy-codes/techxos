import type { NextPage } from &apos;next&apos;;
import Image from &apos;next/image&apos;
import ScrollToTopButton from &apos;@/components/layout/ScrollToTopButton&apos;

interface Service {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const ServicesPage: NextPage = () => {
  const services: Service[] = [
    {
      title: &apos;LMS Development&apos;,
      description: &apos;Transform education with our custom Learning Management Systems tailored to your institutional needs.&apos;,
      icon: &apos;/icons/lms.svg&apos;,
      color: &apos;bg-blue-100&apos;
    },
    {
      title: &apos;Web Development&apos;,
      description: &apos;From stunning websites to complex web applications, we build digital experiences that convert.&apos;,
      icon: &apos;/icons/web.svg&apos;,
      color: &apos;bg-purple-100&apos;
    },
    {
      title: &apos;AI/ML Solutions&apos;,
      description: &apos;Leverage our Artificial Intelligence and Machine Learning solutions to optimize your business processes.&apos;,
      icon: &apos;/icons/ai.svg&apos;,
      color: &apos;bg-pink-100&apos;
    },
    {
      title: &apos;Mobile Apps&apos;,
      description: &apos;We build Native and cross-platform mobile applications that deliver seamless user experiences.&apos;,
      icon: &apos;/icons/mobile.svg&apos;,
      color: &apos;bg-green-100&apos;
    },
    {
      title: &apos;SaaS Development&apos;,
      description: &apos;Trust us for Scalable cloud-based solutions that grow with your business and user demands.&apos;,
      icon: &apos;/icons/saas.svg&apos;,
      color: &apos;bg-yellow-100&apos;
    },
    {
      title: &apos;Tech Consulting&apos;,
      description: &apos;Get strategic technology advisory services to drive your digital transformation journey.&apos;,
      icon: &apos;/icons/consulting.svg&apos;,
      color: &apos;bg-indigo-100&apos;
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50&quot;>
      {/* Hero Section */}
      <div className=&quot;relative bg-gradient-to-r from-blue-600 to-purple-700 py-20&quot;>
        <div className=&quot;container mx-auto px-4 text-center&quot;>
          <h1 className=&quot;text-4xl md:text-6xl font-bold text-white mb-6&quot;>
            Digital Innovation Services
          </h1>
          <p className=&quot;text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto&quot;>
            Our services range from providing seamless Learning Management System to empowering businesses with cutting-edge 
            technology solutions and digital transformation expertise. Request for a quote at sales@techxos.com
          </p>
          <div className=&quot;relative h-64 w-full&quot;>
            <Image
              src=&quot;/logo2.webp&quot;
              alt=&quot;Technology Illustration&quot;
              fill
              className=&quot;object-contain&quot;
            />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className=&quot;container mx-auto px-4 py-16&quot;>
        <div className=&quot;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8&quot;>
          {services.map((service: Service, index: number) => (
            <div
              key={index}
              className={`p-8 rounded-2xl transition-all duration-300 hover:transform hover:scale-105 ${service.color} hover:shadow-xl`}
            >
              <div className=&quot;mb-6&quot;>
                <div className=&quot;h-12 w-12 rounded-lg bg-white flex items-center justify-center&quot;>
                  <div className=&quot;relative h-8 w-8&quot;>
                    <Image
                      src={service.icon}
                      alt={service.title}
                      fill
                      className=&quot;object-contain&quot;
                    />
                  </div>
                </div>
              </div>
              <h3 className=&quot;text-2xl font-bold text-gray-800 mb-4&quot;>
                {service.title}
              </h3>
              <p className=&quot;text-gray-600 leading-relaxed&quot;>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Consulting Section */}
      <div className=&quot;bg-gray-100 py-16&quot;>
        <div className=&quot;container mx-auto px-4&quot;>
          <div className=&quot;flex flex-col md:flex-row items-center gap-8&quot;>
            <div className=&quot;md:w-1/2&quot;>
              <div className=&quot;relative h-64 w-full&quot;>
                <Image
                  src=&quot;/images/consulting.jpg&quot;
                  alt=&quot;Tech Consulting&quot;
                  fill
                  className=&quot;object-contain&quot;
                />
              </div>
            </div>
            <div className=&quot;md:w-1/2&quot;>
              <h2 className=&quot;text-3xl font-bold text-gray-800 mb-6&quot;>
                Strategic Technology Partnership
              </h2>
              <p className=&quot;text-gray-600 mb-6&quot;>
                Our expert consultants work as an extension of your team to provide:
              </p>
              <ul className=&quot;grid grid-cols-1 gap-4&quot;>
                <li className=&quot;flex items-center&quot;>
                  <span className=&quot;w-2 h-2 bg-blue-500 rounded-full mr-3&quot;></span>
                  Technology roadmap development
                </li>
                <li className=&quot;flex items-center&quot;>
                  <span className=&quot;w-2 h-2 bg-purple-500 rounded-full mr-3&quot;></span>
                  Digital transformation strategy
                </li>
                <li className=&quot;flex items-center&quot;>
                  <span className=&quot;w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  IT infrastructure optimization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  )
}

export default ServicesPage