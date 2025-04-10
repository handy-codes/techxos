import Image from &quot;next/image&quot;;
import {
  GlobeAltIcon,
  LightBulbIcon,
  UserGroupIcon,
  BriefcaseIcon,
} from &quot;@heroicons/react/24/outline&quot;;
import { FaLinkedin } from &quot;react-icons/fa&quot;; // Importing LinkedIn icon from react-icons

interface Step {
  step: string;
  description: string;
}

interface TeamMember {
  role: string;
  name: string;
  image: string;
  linkedin?: string;
}

const AboutPage = () => {
  const internshipSteps: Step[] = [
    {
      step: &quot;Skill Assessment&quot;,
      description:
        &quot;Evaluate your current skills and identify areas for improvement.&quot;,
    },
    {
      step: &quot;Project-based Learning&quot;,
      description:
        &quot;Engage in hands-on projects to apply your knowledge.&quot;,
    },
    {
      step: &quot;Mentorship&quot;,
      description:
        &quot;Receive guidance and support from industry experts.&quot;,
    },
    {
      step: &quot;Placement&quot;,
      description: &quot;Secure a position in a reputable company.&quot;,
    },
  ];

  const teamMembers: TeamMember[] = [
    {
      role: &quot;CEO&quot;,
      name: &quot;Jonadab Areuya&quot;,
      image: &quot;/wandyboss2.jpg&quot;,
    },
    {
      role: &quot;CTO&quot;,
      name: &quot;Emeka Owo&quot;,
      image: &quot;/owo-blow.jpg&quot;,
      linkedin: &quot;https://www.linkedin.com/in/emeka-owo-204aaa2a5/&quot;,
    },
    {
      role: &quot;Head of Training&quot;,
      name: &quot;Nicholas Okoye&quot;,
      image:
        &quot;https://media.licdn.com/dms/image/v2/D4D03AQHRNTL3J6Dm_Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1689285926292?e=1747267200&v=beta&t=pndPPGTyAe57MImlcc-FwGc2Ob1u7LCUOGND4qCipak&quot;,
      linkedin: &quot;https://www.linkedin.com/in/obi-okoye-65b7381b3/&quot;,
    },
  ];

  return (
    <div className="min-h-screen mt-32 bg-gray-50&quot;>
      {/* Hero Section */}
      <section className=&quot;relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700&quot;>
        <div className=&quot;max-w-7xl mx-auto&quot;>
          <div className=&quot;grid lg:grid-cols-2 gap-12 items-center&quot;>
            <div className=&quot;text-white&quot;>
              <h1 className=&quot;text-4xl sm:text-5xl font-bold mb-6&quot;>
                Empowering Future Professionals
              </h1>
              <p className=&quot;text-xl mb-8&quot;>
                TechXos is a dynamic and user-friendly learning management
                system designed to empower individuals and businesses with
                seamless access to high-quality online education.
              </p>
              <p className=&quot;text-xl mb-8&quot;>
                We believe in making learning accessible, efficient, and
                impactful, helping users skill up with every ease!
              </p>
            </div>
            <div className=&quot;relative h-96 rounded-2xl overflow-hidden shadow-xl&quot;>
              <Image
                src=&quot;https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?auto=compress&cs=tinysrgb&w=600&quot;
                // src=&quot;https://images.pexels.com/photos/3727457/pexels-photo-3727457.jpeg?auto=compress&cs=tinysrgb&w=600&quot;
                alt=&quot;Team Collaboration&quot;
                fill
                className=&quot;object-cover&quot;
                priority
                sizes=&quot;(max-width: 768px) 100vw, 50vw&quot;
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className=&quot;py-16 bg-white&quot;>
        <div className=&quot;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8&quot;>
          <div className=&quot;grid grid-cols-1 md:grid-cols-4 gap-8 text-center&quot;>
            <div className=&quot;p-6 bg-blue-50 rounded-xl transition hover:bg-blue-100&quot;>
              <UserGroupIcon className=&quot;h-12 w-12 mx-auto text-blue-600&quot; />
              <h3 className=&quot;mt-4 text-3xl font-bold&quot;>500+</h3>
              <p className=&quot;mt-2 text-gray-600&quot;>Students Trained</p>
            </div>
            <div className=&quot;p-6 bg-purple-50 rounded-xl transition hover:bg-purple-100&quot;>
              <BriefcaseIcon className=&quot;h-12 w-12 mx-auto text-purple-600&quot; />
              <h3 className=&quot;mt-4 text-3xl font-bold&quot;>100+</h3>
              <p className=&quot;mt-2 text-gray-600&quot;>Internship Placements</p>
            </div>
            <div className=&quot;p-6 bg-green-50 rounded-xl transition hover:bg-green-100&quot;>
              <GlobeAltIcon className=&quot;h-12 w-12 mx-auto text-green-600&quot; />
              <h3 className=&quot;mt-4 text-3xl font-bold&quot;>85%</h3>
              <p className=&quot;mt-2 text-gray-600&quot;>Employment Rate</p>
            </div>
            <div className=&quot;p-6 bg-orange-50 rounded-xl transition hover:bg-orange-100&quot;>
              <LightBulbIcon className=&quot;h-12 w-12 mx-auto text-orange-600&quot; />
              <h3 className=&quot;mt-4 text-3xl font-bold&quot;>10+</h3>
              <p className=&quot;mt-2 text-gray-600&quot;>Industry Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className=&quot;py-20 bg-gray-50&quot;>
        <div className=&quot;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8&quot;>
          <div className=&quot;grid lg:grid-cols-2 gap-12 items-center&quot;>
            <div className=&quot;relative h-96 rounded-2xl overflow-hidden shadow-xl&quot;>
              <Image
                src=&quot;https://images.pexels.com/photos/7689877/pexels-photo-7689877.jpeg?auto=compress&cs=tinysrgb&w=600&quot;
                alt=&quot;Internship Program&quot;
                fill
                className=&quot;object-cover&quot;
                sizes=&quot;(max-width: 768px) 100vw, 50vw&quot;
              />
            </div>
            <div className=&quot;prose lg:prose-xl&quot;>
              <h2 className=&quot;text-3xl font-bold text-gray-900 mb-6&quot;>
                Our Mission
              </h2>
              <p className=&quot;text-gray-600 mb-4&quot;>
                To provide transformative learning experiences that prepare
                students for successful careers through hands-on training and
                real-world internships.
              </p>
              <h3 className=&quot;text-xl font-semibold mt-8 mb-4&quot;>
                What Makes Us Different
              </h3>
              <ul className=&quot;list-disc pl-6 space-y-3&quot;>
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
      <section className=&quot;py-20 bg-white&quot;>
        <div className=&quot;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8&quot;>
          <h2 className=&quot;text-3xl font-bold text-center mb-16&quot;>
            Internship Journey
          </h2>
          <div className=&quot;flex flex-col md:flex-row justify-between gap-8&quot;>
            {internshipSteps.map(({ step, description }: Step, index: number) => (
              <div key={step} className=&quot;relative flex-1 text-center&quot;>
                <div className=&quot;mb-4&quot;>
                  <div className=&quot;w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto&quot;>
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div className=&quot;hidden md:block absolute top-8 left-1/2 w-full h-1 bg-gray-200 -z-10&quot; />
                  )}
                </div>
                <h3 className=&quot;text-xl font-semibold mb-2&quot;>{step}</h3>
                <p className=&quot;text-gray-600&quot;>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className=&quot;py-20 bg-gray-50&quot;>
        <div className=&quot;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8&quot;>
          <h2 className=&quot;text-3xl font-bold text-center mb-12&quot;>
            Meet Our Leadership
          </h2>
          <div className=&quot;grid md:grid-cols-3 gap-8&quot;>
            {teamMembers.map(({ role, name, image, linkedin }: TeamMember) => (
              <div
                key={role}
                className=&quot;bg-white rounded-xl shadow-lg overflow-hidden transition hover:shadow-xl&quot;
              >
                <div className=&quot;relative h-64&quot;>
                  <Image
                    src={image}
                    alt={role}
                    fill
                    className=&quot;object-cover&quot;
                    sizes=&quot;(max-width: 768px) 100vw, 33vw&quot;
                  />
                </div>
                <div className=&quot;p-6&quot;>
                  <h3 className=&quot;text-xl font-bold&quot;>{name}</h3>
                  <div className=&quot;flex items-center gap-2&quot;>
                    <p className=&quot;text-gray-600&quot;>{role}</p>
                    {linkedin && (
                      <a
                        href={linkedin}
                        target=&quot;_blank&quot;
                        rel=&quot;noopener noreferrer&quot;
                        className=&quot;text-blue-600 hover:text-blue-800&quot;
                      >
                        <FaLinkedin className=&quot;w-5 h-5" />
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
