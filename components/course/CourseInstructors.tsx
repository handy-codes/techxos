import React from "react";
import Image from "next/image";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

interface Instructor {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

interface CourseInstructorsProps {
  instructors: Instructor[];
}

export default function CourseInstructors({ instructors }: CourseInstructorsProps) {
  return (
    <section className="container mx-auto p-4 mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Meet Your Instructors</h2>
        <p className="text-gray-600">
          Learn from industry experts with years of experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={instructor.imageUrl}
                  alt={instructor.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {instructor.name}
              </h3>
              <p className="text-blue-600 font-medium mb-2">{instructor.role}</p>
              <p className="text-gray-600 mb-4">{instructor.bio}</p>
              <div className="flex space-x-4">
                {instructor.linkedinUrl && (
                  <a
                    href={instructor.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaLinkedin className="w-6 h-6" />
                  </a>
                )}
                {instructor.twitterUrl && (
                  <a
                    href={instructor.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <FaTwitter className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 