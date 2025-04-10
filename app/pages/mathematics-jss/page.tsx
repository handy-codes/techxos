"use client";
import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle, FaRegClock } from "react-icons/fa";
import { AiFillSchedule } from "react-icons/ai";
import { HiLocationMarker } from "react-icons/hi";
import { IoMdOptions } from "react-icons/io";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import JoinLiveClassButton from "@/components/course/JoinLiveClassButton";
import CoursePurchaseButton from "@/components/course/CoursePurchaseButton";
import MathematicsJSS from "@/components/curriculum/Mathematics-jss";

export default function Page() {
  const [formData, setFormData] = useState({
    courseTitle: "Mathematics (JSS 1-3)",
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
  
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [userRoleState, setUserRoleState] = useState<string | null>(null);

  // Function to determine if the current user is an admin based on their email
  const checkIfUserIsAdmin = useCallback(async () => {
    if (!isSignedIn || !userId) return false;
    
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      console.log("Current user email:", userEmail);
      
      if (!userEmail) return false;
      
      // Known admin emails - add any admin emails here
      const adminEmails = [
        "paxymekventures@gmail.com",
        "admin@techxos.com",
        "emeka@techxos.com"
      ];
      
      // Direct check for known admin emails
      if (adminEmails.includes(userEmail.toLowerCase())) {
        console.log("User is admin based on email match!");
        setUserRoleState("HEAD_ADMIN");
        setHasAccess(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error in admin check:", error);
      return false;
    }
  }, [isSignedIn, userId, user]);

  useEffect(() => {
    if (isSignedIn && userId) {
      checkIfUserIsAdmin();
    }
  }, [isSignedIn, userId, checkIfUserIsAdmin]);

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
        courseTitle: "Mathematics (JSS 1-3)",
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

  return (
    <div>
      <Head>
        <title>Course Page</title>
        <meta
          name="description"
          content="Welcome to the Mathematics (JSS 1-3) Course"
        />
      </Head>

      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Mathematics (JSS 1-3)
              </h1>
              <p className="text-xl mb-8">
              Crush Junior WAEC Maths with Confidence – Master Numbers Like a Pro!
              Imagine solving equations with ease and facing exam questions with unshakable 
              confidence—this is your year to own Junior
              WAEC Mathematics! Our course isn&apos;t just about formulas; it&apos;s your secret weapon
              to turn anxiety into A&apos;s and confusion into success. From conquering fractions,
              simple equations, angle of elevation and depression, or plotting graphs
              to acing real-life word problems, we break down Nigeria&apos;s JSS curriculum into tiny parts. 
              Say goodbye to "maths phobia"—you&apos;ll tackle past WAEC questions and mock exams 
              like a champion.
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
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto p-4 mt-4 flex flex-col md:flex-row gap-8">
        {/* Left Column - Course Details */}
        <div className="flex-1 text-black">
          <div className="mt-4 md:mt-0 mb-4 md:mb-2 lg:mb-6">
            <h1 className="text-2xl lg:text-4xl font-bold mb-[4px]">
              Mathematics (JSS 1-3)
            </h1>
            <div className="h-[8px] w-[80px] md:w-[150px] bg-[#E79D09]"></div>
          </div>
          <h1 className="text-3xl text-green-800 lg:text-4xl font-extrabold mb-4 md:mb-2 lg:mb-6">
            5,000 NGN (Per Month)
          </h1>
          <p className="text-justify font-semibold max-sm:mb-1">
            Happening in 16 weeks. Junior WAEC isn&apos;t just a test—it&apos;s your stepping stone to SS1 greatness. 
            With every lesson, you&apos;ll build logic, critical thinking, and the maths swagger to 
            top your class. Ready to be the maths hero your school talks about? Enroll now and 
            turn "I hate maths" into "Bring on the WAEC!" 🧮🏆🇳🇬
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
              <span>Duration: 16 weeks</span>
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
            <div className="p-2 md:p-4 mt-2 md:mt-3 mb-1 shadow-md hover:bg-white hover:text-green-700 transition-all duration-500 text-white border-2 border-[#38a169] rounded-md inline-block bg-green-700 font-bold border-solid">
              {!isSignedIn ? (
                <Link
                  href="/sign-in"
                  className="inline-bloc text-white md:p-4 mt-2 md:mt-3 mb-1 shadow-md hover:bg-green-700 hover:text-white transition-all duration-500 border-2 border-[#38a169] rounded-md bg-white font-bold border-solid"
                >
                  Enroll Now
                </Link>
              ) : (
                (() => {
                  console.log("Rendering button with role:", userRoleState, "hasAccess:", hasAccess);
                  
                  // Admin roles always get access
                  const isAdmin = 
                    userRoleState === "HEAD_ADMIN" ||
                    userRoleState === "ADMIN" ||
                    userRoleState === "LECTURER";
                  
                  // Final access decision
                  const shouldShowJoinButton = hasAccess || isAdmin;
                  
                  return shouldShowJoinButton ? (
                    <JoinLiveClassButton 
                      courseId="mathematics-jss" 
                      courseName="Mathematics (JSS 1-3)" 
                    />
                  ) : (
                    <CoursePurchaseButton 
                      courseId="mathematics-jss" 
                      courseName="Mathematics (JSS 1-3)" 
                    />
                  );
                })()
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
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
      <MathematicsJSS />
      <ScrollToTopButton />
    </div>
  );
}
