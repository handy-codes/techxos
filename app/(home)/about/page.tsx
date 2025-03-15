import Image from "next/image";
import {
  GlobeAltIcon,
  LightBulbIcon,
  UserGroupIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { FaLinkedin } from "react-icons/fa"; // Importing LinkedIn icon from react-icons

const AboutPage = () => {
  return (
    <div className="min-h-screen mt-32 bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Empowering Future Professionals
              </h1>
              <p className="text-xl mb-8">
                TechXos is a dynamic and user-friendly learning management
                system designed to empower individuals and businesses with
                seamless access to high-quality online education.
              </p>
              <p className="text-xl mb-8">
                We believe in making learning accessible, efficient, and
                impactful, helping users skill up with every ease!
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?auto=compress&cs=tinysrgb&w=600"
                // src="https://images.pexels.com/photos/3727457/pexels-photo-3727457.jpeg?auto=compress&cs=tinysrgb&w=600"
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

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-blue-50 rounded-xl transition hover:bg-blue-100">
              <UserGroupIcon className="h-12 w-12 mx-auto text-blue-600" />
              <h3 className="mt-4 text-3xl font-bold">500+</h3>
              <p className="mt-2 text-gray-600">Students Trained</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl transition hover:bg-purple-100">
              <BriefcaseIcon className="h-12 w-12 mx-auto text-purple-600" />
              <h3 className="mt-4 text-3xl font-bold">100+</h3>
              <p className="mt-2 text-gray-600">Internship Placements</p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl transition hover:bg-green-100">
              <GlobeAltIcon className="h-12 w-12 mx-auto text-green-600" />
              <h3 className="mt-4 text-3xl font-bold">85%</h3>
              <p className="mt-2 text-gray-600">Employment Rate</p>
            </div>
            <div className="p-6 bg-orange-50 rounded-xl transition hover:bg-orange-100">
              <LightBulbIcon className="h-12 w-12 mx-auto text-orange-600" />
              <h3 className="mt-4 text-3xl font-bold">10+</h3>
              <p className="mt-2 text-gray-600">Industry Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.pexels.com/photos/7689877/pexels-photo-7689877.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Internship Program"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="prose lg:prose-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-4">
                To provide transformative learning experiences that prepare
                students for successful careers through hands-on training and
                real-world internships.
              </p>
              <h3 className="text-xl font-semibold mt-8 mb-4">
                What Makes Us Different
              </h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>Industry-aligned curriculum</li>
                <li>Personalized career coaching</li>
                <li>Guaranteed internship placement</li>
                <li>Cutting-edge learning facilities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Internship Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Internship Journey
          </h2>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {[
              {
                step: "Skill Assessment",
                description:
                  "Evaluate your current skills and identify areas for improvement.",
              },
              {
                step: "Project-based Learning",
                description:
                  "Engage in hands-on projects to apply your knowledge.",
              },
              {
                step: "Mentorship",
                description:
                  "Receive guidance and support from industry experts.",
              },
              {
                step: "Placement",
                description: "Secure a position in a reputable company.",
              },
            ].map(({ step, description }, index) => (
              <div key={step} className="relative flex-1 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-gray-200 -z-10" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Leadership
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                role: "CEO",
                name: "Jonadab Areuya",
                image: "/wandyboss2.jpg",
                // linkedin: "https://linkedin.com/in/jonadabareuya"
              },
              {
                role: "CTO",
                name: "Emeka Owo",
                image: "/owo-blow.jpg",
                // image: "https://images.pexels.com/photos/6584748/pexels-photo-6584748.jpeg?auto=compress&cs=tinysrgb&w=600",
                linkedin: "https://www.linkedin.com/in/emeka-owo-204aaa2a5/",
              },
              {
                role: "Head of Training",
                name: "Nicholas Okoye",
                image:
                  "https://media.licdn.com/dms/image/v2/D4D03AQHRNTL3J6Dm_Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1689285926292?e=1747267200&v=beta&t=pndPPGTyAe57MImlcc-FwGc2Ob1u7LCUOGND4qCipak",
                linkedin: "https://www.linkedin.com/in/obi-okoye-65b7381b3/",
              },
            ].map(({ role, name, image, linkedin }) => (
              <div
                key={role}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition hover:shadow-xl"
              >
                <div className="relative h-64">
                  <Image
                    src={image}
                    alt={role}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-600">{role}</p>
                    {linkedin && (
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <FaLinkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
