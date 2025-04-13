import type { NextPage } from 'next';
import Image from "next/image"
import ScrollToTopButton from '@/components/layout/ScrollToTopButton'

interface Service {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const ServicesPage: NextPage = () => {
  const services: Service[] = [
    {
      title: 'LMS Development',
      description: 'Transform education with our custom Learning Management Systems tailored to your institutional needs.',
      icon: '/icons/lms.svg',
      color: 'bg-blue-100'
    },
    {
      title: 'Web Development',
      description: 'From stunning websites to complex web applications, we build digital experiences that convert.',
      icon: '/icons/web.svg',
      color: 'bg-purple-100'
    },
    {
      title: 'AI/ML Solutions',
      description: 'Leverage our Artificial Intelligence and Machine Learning solutions to optimize your business processes.',
      icon: '/icons/ai.svg',
      color: 'bg-pink-100'
    },
    {
      title: 'Mobile Apps',
      description: 'We build Native and cross-platform mobile applications that deliver seamless user experiences.',
      icon: '/icons/mobile.svg',
      color: 'bg-green-100'
    },
    {
      title: 'SaaS Development',
      description: 'Trust us for Scalable cloud-based solutions that grow with your business and user demands.',
      icon: '/icons/saas.svg',
      color: 'bg-yellow-100'
    },
    {
      title: 'Tech Consulting',
      description: 'Get strategic technology advisory services to drive your digital transformation journey.',
      icon: '/icons/consulting.svg',
      color: 'bg-indigo-100'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Digital Innovation Services
          </h1>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Our services range from providing seamless Learning Management System to empowering businesses with cutting-edge 
            technology solutions and digital transformation expertise. Request for a quote at sales@techxos.com
          </p>
          <div className="relative h-64 w-full">
            <Image
              src="/logo2.webp"
              alt="Technology Illustration"
              fill
              className="object-contain"
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          </div>
        </div>
      </div>
      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: Service, index: number) => (
            <div
              key={index}
              className={`p-8 rounded-2xl transition-all duration-300 hover:transform hover:scale-105 ${service.color} hover:shadow-xl`}
            >
              <div className="mb-6">
                <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center">
                  <div className="relative h-8 w-8">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      fill
                      className="object-contain"
                      style={{
                        maxWidth: "100%",
                        height: "auto"
                      }} />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Tech Consulting Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="relative h-64 w-full">
                <Image
                  src="/images/consulting.jpg"
                  alt="Tech Consulting"
                  fill
                  className="object-contain"
                  style={{
                    maxWidth: "100%",
                    height: "auto"
                  }} />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Strategic Technology Partnership
              </h2>
              <p className="text-gray-600 mb-6">
                Our expert consultants work as an extension of your team to provide:
              </p>
              <ul className="grid grid-cols-1 gap-4">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Technology roadmap development
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Digital transformation strategy
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  IT infrastructure optimization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default ServicesPage