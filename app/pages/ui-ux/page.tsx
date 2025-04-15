"use client";
import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle, FaRegClock } from "react-icons/fa";
import { AiFillSchedule } from "react-icons/ai";
import { HiLocationMarker } from "react-icons/hi";
import { IoMdOptions } from "react-icons/io";
import { Loader2 } from "lucide-react";
import UiUx from "@/components/curriculum/Ui-Ux";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import JoinLiveClassButton from "@/components/course/JoinLiveClassButton";
import FlutterwavePayment from "@/components/payment/FlutterwavePayment";
import { useRouter } from "next/navigation";

interface LiveLecture {
  id: string;
  date: Date;
  recordingUrl: string | null;
  title: string | null;
  isRecorded: boolean;
}

interface LiveCourseWithLectures {
  id: string;
  zoomLink: string | null;
  lectures: LiveLecture[];
  hasAccess: boolean;
  studentEmail?: string;
  studentName?: string;
}

export default function Page() {
  const [formData, setFormData] = useState({
    courseTitle: "UI-UX Design",
    name: "",
    surname: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [lecture, setLecture] = useState<LiveCourseWithLectures | null>(null);
  const router = useRouter();

  const fetchLectureDetails = useCallback(async () => {
    try {
      console.log("Fetching lecture details...");
      const response = await axios.get("/api/live-courses/ui-ux/lecture");
      console.log("Lecture details response:", response.data);

      setLecture({
        ...response.data.lecture,
        hasAccess: response.data.hasAccess
      });

    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; statusText?: string; data?: any };
        message?: string;
      };
      console.error("Detailed fetch error:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.status === 401) {
        toast.error("Please sign in to access this course");
      } else if (err.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to load lecture details");
      }
    }
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      fetchLectureDetails();
    }
  }, [isSignedIn, fetchLectureDetails]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formDataToSend = new FormData();
    formDataToSend.append("courseTitle", formData.courseTitle);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("surname", formData.surname);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("message", formData.message);

    try {
      const response = await fetch("/api/nofilesubmit-form", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitStatus("success");
      setFormData({
        courseTitle: "UI-UX Design",
        name: "",
        surname: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to render lecture information if available
  const renderLectureInfo = () => {
    if (!isSignedIn) {
      return (
        <div className="mt-6">
          <Link
            href="/sign-in"
            className="inline-block text-white bg-green-700 px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
          >
            Enroll Now
          </Link>
        </div>
      );
    }

    if (!lecture) {
      return (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-sm flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
          <p className="text-gray-600 font-medium">Loading course information...</p>
        </div>
      );
    }
    
    return (
      <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-2">Current Course Information</h3>
        {lecture.lectures && lecture.lectures.length > 0 ? (
          <div>
            <p className="mb-2">
              <span className="font-medium">Latest lecture:</span>{" "}
              {lecture.lectures[0].title || "Upcoming Session"}
            </p>
            <p className="mb-2">
              <span className="font-medium">Date:</span>{" "}
              {new Date(lecture.lectures[0].date).toLocaleString()}
            </p>
            {lecture.lectures[0].isRecorded && lecture.lectures[0].recordingUrl && (
              <div className="mt-2">
                <a 
                  href={lecture.lectures[0].recordingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Recording
                </a>
              </div>
            )}
          </div>
        ) : (
          <p>No scheduled lectures at this time. Please check back later.</p>
        )}
        <div className="mt-4">
          {lecture.hasAccess ? (
            <JoinLiveClassButton 
              courseId="ui-ux" 
              courseName="UI-UX Design" 
            />
          ) : (
            <div className="inline-block">
              <FlutterwavePayment 
                courseId="ui-ux"
                courseName="UI-UX Design"
                amount={250000}
                email={user?.primaryEmailAddress?.emailAddress || ""}
                name={`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Student"}
                onSuccess={() => {
                  toast.success("Payment successful! Redirecting to course...");
                  router.push("/ui-ux/success");
                }}
                onError={(error) => {
                  console.error("Payment error:", error);
                  toast.error("Payment failed. Please try again.");
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>Course Page</title>
        <meta
          name="description"
          content="Welcome to the UI-UX Design Course"
        />
      </Head>
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                UI-UX Design
              </h1>
              <p className="text-xl mb-8">
                Master the Art of User Interface and Experience Design! Learn to
                create beautiful, intuitive interfaces that users love to interact
                with. From wireframing to prototyping, user research to interaction
                design, you will develop the skills to craft digital experiences that
                delight users and drive business success.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://i.ibb.co/xqN3xy1J/Gemini-Generated-Image-v5ipemv5ipemv5ip.jpg"
                alt="Team Collaboration"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  maxWidth: "100%"
                }} />
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto p-4 mt-4 flex flex-col md:flex-row gap-8">
        <div className="flex-1 text-black">
          <div className="mt-4 md:mt-0 mb-4 md:mb-2 lg:mb-6">
            <h1 className="text-2xl lg:text-4xl font-bold mb-[4px]">
              UI-UX Design
            </h1>
            <div className="h-[8px] w-[80px] md:w-[150px] bg-[#E79D09]"></div>
          </div>
          <h1 className="text-3xl text-green-800 lg:text-4xl font-extrabold mb-4 md:mb-2 lg:mb-6">
            250,000 NGN
          </h1>
          <p className="text-justify font-semibold max-sm:mb-1">
            Techxos powers your design journey: Master UI/UX design from concept
            to implementation. Learn from industry experts who have designed
            interfaces for global brands. Join a community of designers passionate
            about creating user-centered experiences. Through hands-on projects,
            design critiques, and real-world applications, develop the skills to
            create beautiful, functional interfaces. Ready to become a professional
            UI/UX designer? Enroll now and start designing—one pixel at a time.
            🎨✨💻
          </p>
          <div className="p-2 md:p-4 mt-2 md:mt-3 mb-1 shadow-md hover:bg-green-700 hover:text-white transition-all duration-500 border-2 border-[#38a169] rounded-md inline-block bg-white font-bold border-solid">
            <a
              href="https://wa.me/2348167715107"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact an Advisor
            </a>
          </div>
          <div className="font-semibold">
            <div className="flex items-center gap-3 mt-3 md:mt-4">
              <FaRegClock className="text-black text-[22px]" />
              <span>Duration: 12 weeks</span>
            </div>
            <div className="flex items-center gap-3 mt-3 md:mt-4">
              <AiFillSchedule className="text-black text-[24px]" />
              <span>Schedule: 9 hours/week</span>
            </div>
            <div className="flex items-center gap-3 mt-3 md:mt-4">
              <HiLocationMarker className="text-black text-[27px]" />
              <span>Location: In-person or online</span>
            </div>
            <div className="flex items-center gap-3 mt-3 md:mt-4">
              <IoMdOptions className="text-black text-[24px]" />
              <span>Options: Evening Class, Executive (one-to-one) class</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 mt-6">
              UI-UX Design Virtual
            </h2>
            
            {/* Display lecture information if available */}
            {renderLectureInfo()}
          </div>
        </div>

        <div
          id="contact"
          className="flex-1 text-black bg-gray-100 p-6 rounded-lg shadow-md"
        >
          <h1 className="text-2xl font-bold mb-4">
            Contact Us for More Enquiry
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Course Title:
              </label>
              <input
                type="text"
                name="courseTitle"
                value={formData.courseTitle}
                readOnly
                className="w-full p-2 border font-bold text-2xl rounded bg-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name*</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Surname*</label>
              <input
                type="text"
                name="surname"
                required
                value={formData.surname}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email*</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Subject*</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Message*</label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={4}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            {submitStatus === "success" && (
              <div className="mt-4 flex items-center text-green-600">
                <FaCheckCircle className="mr-2" size={24} />
                <p className="font-bold">Form submitted successfully!</p>
              </div>
            )}
            {submitStatus === "error" && (
              <p className="mt-4 text-red-600">
                Failed to submit the form. Please try again.
              </p>
            )}
          </form>
        </div>
      </section>
      <UiUx />
      <ScrollToTopButton />
    </div>
  );
}
