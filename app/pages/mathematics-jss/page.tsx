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
import MathematicsJss from "@/components/curriculum/Mathematics-jss";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import JoinLiveClassButton from "@/components/course/JoinLiveClassButton";
import FlutterwavePayment from "@/components/payment/FlutterwavePayment";
import { useRouter } from "next/navigation";
import { MathsDemoForm } from "@/components/maths-demo-form";

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
    courseTitle: "Mathematics (JSS Module)",
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
  const [hasDemoAccess, setHasDemoAccess] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchLectureDetails = useCallback(async () => {
    try {
      console.log("Fetching lecture details...");
      const response = await axios.get("/api/live-courses/mathematics-jss/lecture");
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
      } else if (err.response?.status === 404) {
        toast.error("Course not found or you don't have access");
        setLecture(null);
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

  useEffect(() => {
    const checkDemoAccess = async () => {
      if (!isSignedIn) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/maths-demo/check-access");
        if (!response.ok) {
          throw new Error("Failed to check demo access");
        }
        const data = await response.json();
        setHasDemoAccess(data.hasAccess);
        setIsDemoMode(data.isDemoMode);
      } catch (error) {
        console.error("Error checking demo access:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkDemoAccess();
  }, [isSignedIn]);

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
        courseTitle: "Mathematics (JSS Module)",
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

  //Function to render lecture information if available
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

    if (isLoading) {
      return (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-sm flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
          <p className="text-gray-600 font-medium">Loading course information...</p>
        </div>
      );
    }
    
    // If in demo mode and user doesn't have access, show the demo registration form
    if (isDemoMode && !hasDemoAccess) {
      return <MathsDemoForm />;
    }

    // If user has access (either through demo or paid), show the course information
    if (lecture) {
      return (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-sm">
          <div className="mt-4">
            {(lecture.hasAccess || (isDemoMode && hasDemoAccess)) ? (
              <JoinLiveClassButton 
                courseId="mathematics-jss" 
                courseName="Mathematics (JSS Module)" 
              />
            ) : (
              <FlutterwavePayment 
                courseId="mathematics-jss"
                courseName="Mathematics (JSS Module)"
                amount={10000}
                email={user?.primaryEmailAddress?.emailAddress || ""}
                name={`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Student"}
                onSuccess={() => {
                  toast.success("Payment successful! Redirecting to course...");
                  router.push("pages/mathematics-jss/success");
                }}
                onError={(error) => {
                  console.error("Payment error:", error);
                  toast.error("Payment failed. Please try again.");
                }}
              />
            )}
          </div>
        </div>
      );
    }

    // If not in demo mode or user doesn't have access, show the payment component
    if (!isDemoMode || !hasDemoAccess) {
      return (
        <div className="mt-6">
          <div className="inline-block">
            <FlutterwavePayment 
              courseId="mathematics-jss"
              courseName="Mathematics (JSS Module)"
              amount={10000}
              email={user?.primaryEmailAddress?.emailAddress || ""}
              name={`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Student"}
              onSuccess={() => {
                toast.success("Payment successful! Redirecting to course...");
                router.push("pages/mathematics-jss/success");
              }}
              onError={(error) => {
                console.error("Payment error:", error);
                toast.error("Payment failed. Please try again.");
              }}
            />
          </div>
        </div>
      );
    }

    // Default case: show loading or error state
    return (
      <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-sm">
        <p className="text-gray-600">Loading course information...</p>
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>Course Page</title>
        <meta
          name="description"
          content="Welcome to the Mathematics (JSS Module) Course"
        />
      </Head>
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Mathematics (JSS Module)
              </h1>
              <p className="text-xl mb-8">
                Our comprehensive
                maths lessons cover all essential topics from the JSS curriculum,
                helping students build a strong foundation in mathematics.
                Through interactive lessons, practice exercises, and real-world
                applications, students will develop problem-solving skills and build
                mathematical confidence.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://media.istockphoto.com/id/636332456/photo/online-education-concept.jpg?b=1&s=612x612&w=0&k=20&c=B3Qb1fWVWdKcibGsE_ikxdpKjWkwKrIFtWzL7vJyq5c="
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
              Mathematics (JSS Module)
            </h1>
            <div className="h-[8px] w-[80px] md:w-[150px] bg-[#E79D09]"></div>
          </div>
          <h1 className="text-3xl text-green-800 lg:text-4xl font-extrabold mb-4 md:mb-2 lg:mb-6">
            10,000 NGN (per month)
          </h1>
          <p className="text-justify font-semibold max-sm:mb-1">
            Techxos powers your academic success: Master junior secondary school
            mathematics with our comprehensive curriculum. Learn from experienced
            teachers who understand the challenges students face. Join a community
            of learners focused on building strong mathematical foundations.
            Through interactive lessons, practice exercises, and real-world
            applications, develop problem-solving skills and mathematical
            confidence. Ready to excel in mathematics? Enroll now and start
            solving—with one formular at a time. 📐✏️📚
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
              Mathematics (JSS Module) Virtual
            </h2>
            <div className="bg-[#3259E6] text-white p-4 rounded-lg">
              <p className="text-xl  mb-2 mt-6">
                  Enroll Now for our Free Live Classes
              </p>
              <p className="text-xl  mb-2 mt-6">
                  Date: Sat April 19th - Sun April 20th, 2025
              </p>
              <p className="text-xl  mb-2 mt-6">
                  Time: 5:00pm - 6:30pm daily
              </p>
            </div>
            
            {/* Display lecture information if available */}
            {renderLectureInfo()}
            <p className="mb-4 my-4">Need Meeting Reminders (optional)</p>
            <Link 
              href="https://chat.whatsapp.com/I9DkCCosIvxFcQo75dnNGA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[white] p-4 mt-4 w-fit bg-[#3259E6] shadow-md rounded-md underline font-font-extrabold hover:underline block"
            >
              Join Techxos Whatsapp Group
            </Link>
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
      <MathematicsJss />
      <ScrollToTopButton />
    </div>
  );
}
