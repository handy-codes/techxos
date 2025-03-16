import Image from 'next/image'

const ServicesPage = () => {
  const services = [
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
    <div className="min-h-screen mt-[8%] bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Digital Innovation Services
          </h1>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Our services range from providing seemless Learning Management System to empowering businesses with cutting-edge 
            technology solutions and digital transformation expertise. Request for a quote at sales@techxos.com
          </p>
          <div className="relative h-64 w-full">
            <Image
              src="/logo2.webp"
              alt="Technology Illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
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
                    />
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
                  src="data:image/jpeg;base64,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"
                  alt="Tech Consulting"
                  fill
                  className="object-contain"
                />
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
    </div>
  )
}

export default ServicesPage