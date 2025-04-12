import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface CurriculumItem {
  title: string;
  description: string;
  duration: string;
  topics: string[];
}

interface CourseCurriculumProps {
  curriculumItems: CurriculumItem[];
  courseName: string;
}

export default function CourseCurriculum({
  curriculumItems,
  courseName,
}: CourseCurriculumProps) {
  return (
    <section className="container mx-auto p-4 mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Course Curriculum</h2>
        <p className="text-gray-600">
          Comprehensive learning path for {courseName}
        </p>
      </div>

      <div className="grid gap-6">
        {curriculumItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {item.duration}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">What you&apos;ll learn:</h4>
              <ul className="space-y-2">
                {item.topics.map((topic, topicIndex) => (
                  <li key={topicIndex} className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 