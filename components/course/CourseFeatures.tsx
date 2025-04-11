import React from "react";
import { FaCheckCircle, FaClock, FaCertificate, FaHeadset, FaLaptop, FaUsers } from "react-icons/fa";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface CourseFeaturesProps {
  features: Feature[];
}

export default function CourseFeatures({ features }: CourseFeaturesProps) {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Course Features</h2>
          <p className="text-gray-600">
            Everything you need to succeed in your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="text-blue-600 text-2xl">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Example usage with default features
export const defaultFeatures: Feature[] = [
  {
    icon: <FaClock />,
    title: "Lifetime Access",
    description: "Learn at your own pace with unlimited access to course materials",
  },
  {
    icon: <FaCertificate />,
    title: "Certificate of Completion",
    description: "Earn a certificate to showcase your new skills",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Support",
    description: "Get help whenever you need it from our support team",
  },
  {
    icon: <FaLaptop />,
    title: "Practical Projects",
    description: "Build real-world projects to apply what you learn",
  },
  {
    icon: <FaUsers />,
    title: "Community Access",
    description: "Join a community of learners and share your progress",
  },
  {
    icon: <FaCheckCircle />,
    title: "Money-Back Guarantee",
    description: "30-day money-back guarantee if you're not satisfied",
  },
]; 