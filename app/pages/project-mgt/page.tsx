"use client";
import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle, FaRegClock } from "react-icons/fa";
import { AiFillSchedule } from "react-icons/ai";
import { HiLocationMarker } from "react-icons/hi";
import { IoMdOptions } from "react-icons/io";
import ProjectManagement from "@/components/curriculum/Project-Mgt";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

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
}

interface FlutterWaveResponse {
  status: string;
  transaction_id?: number;
  id?: number;
  tx_ref?: string;
  flw_ref?: string;
  amount?: number;
  currency?: string;
  customer?: {
    email?: string;
    name?: string;
  };
}

export default function Page() {
  const [formData, setFormData] = useState({
    courseTitle: "Project Management",
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
  const [lecture, setLecture] = useState<LiveCourseWithLectures | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [userRoleState, setUserRoleState] = useState<string | null>(null);

  const fetchLectureDetails = useCallback(async () => {
    try {
      console.log("Fetching lecture details...");
      const response = await axios.get("/api/live-courses/project-mgt/lecture");
      console.log("Lecture details response:", response.data);

      setLecture(response.data.lecture);
      setHasAccess(response.data.hasAccess);
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

  const fetchUserRole = useCallback(async () => {
    try {
      // Debug log
      console.log("Fetching user role...");
      
      // Call the API
      const response = await axios.get("/api/live-courses/project-mgt/lecture");
      
      // Debug log the full response
      console.log("API Response:", response.data);
      
      // Check if the response has role property directly
      if (response.data.role) {
        console.log("Setting user role state from response.data.role:", response.data.role);
        setUserRoleState(response.data.role);
      }
      
      // Also check if hasAccess is set in the response
      if (response.data.hasAccess !== undefined) {
        console.log("Setting hasAccess state:", response.data.hasAccess);
        setHasAccess(response.data.hasAccess);
      }
      
      // Set lecture data if available
      if (response.data.lecture) {
        console.log("Setting lecture state:", response.data.lecture);
        setLecture(response.data.lecture);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  }, []);

  // Function to determine if the current user is an admin based on their email
  const checkIfUserIsAdmin = useCallback(async () => {
    if (!isSignedIn || !userId) return false;
    
    try {
      // Use user from component scope instead of calling useUser() here
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
      
      // Try to fetch the sync file
      try {
        const syncResponse = await fetch('/role-sync.json');
        if (syncResponse.ok) {
          const syncData = await syncResponse.json();
          
          // Check if user's email matches the admin email in sync file
          if (userEmail.toLowerCase() === syncData.adminEmail.toLowerCase()) {
            console.log("User is admin based on sync file match!");
            setUserRoleState("HEAD_ADMIN");
            setHasAccess(true);
            return true;
          }
        }
      } catch (syncError) {
        console.log("No sync file found or error reading it");
      }
      
      return false;
    } catch (error) {
      console.error("Error in admin check:", error);
      return false;
    }
  }, [isSignedIn, userId, user]);

  useEffect(() => {
    if (isSignedIn && userId) {
      // First try the direct admin check
      checkIfUserIsAdmin().then(isAdmin => {
        if (!isAdmin) {
          // If not an admin by direct check, try the API routes
          fetchLectureDetails();
          fetchUserRole();
        }
      });
    }
  }, [isSignedIn, userId, fetchLectureDetails, fetchUserRole, checkIfUserIsAdmin]);

  // Add effect to log role state changes
  useEffect(() => {
    console.log("Current userRoleState:", userRoleState);
  }, [userRoleState]);

  const handleJoinClass = async () => {
    try {
      const response = await axios.get(`/api/live-courses/project-mgt/lecture`);
      console.log("Full response:", response.data);

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      if (response.data.lecture?.zoomLink) {
        window.open(response.data.lecture.zoomLink, "_blank");
      } else {
        toast.error("No active class link available. Please contact support.");
        console.log("Missing zoom link in lecture data");
      }
    } catch (error: any) {
      console.error("Error details:", error.response?.data);
      if (error.response?.status === 401) {
        toast.error("Please sign in to join the class");
      } else if (error.response?.status === 404) {
        toast.error("No active class found at this time");
      } else {
        toast.error("Failed to join the class. Please try again.");
      }
    }
  };

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
        courseTitle: "Project Management",
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

  const handlePurchase = async () => {
    try {
      console.log("Initializing purchase...");
      const response = await axios.post(
        "/api/live-courses/project-mgt/checkout",
        {}
      );

      console.log("Checkout response:", response.data);

      // Use the data from checkout endpoint
      const { price, studentEmail, studentName, courseTitle } = response.data;

      if (!studentEmail || !studentEmail.includes('@')) {
        toast.error("Valid email is required for payment. Please update your profile.");
        return;
      }

      if (!price || price <= 0) {
        toast.error("Invalid course price. Please contact support.");
        return;
      }

      // Ensure price is a number
      const numericPrice = Number(price);
      
      console.log("Processing payment with amount:", numericPrice);

      // Simple payment config - minimal to avoid errors
      const flwConfig = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
        tx_ref: `PM-${Date.now()}`,
        amount: numericPrice,
        currency: "NGN",
        payment_options: "card",
        customer: {
          email: studentEmail,
          name: studentName || "Student",
          phone_number: "N/A",
        },
        customizations: {
          title: "Techxos Project Management",
          description: "Project Management Course",
          logo: "https://techxos.com/logo.png",
        }
      };

      console.log("Payment config:", JSON.stringify(flwConfig));

      // Create payment handler
      const makePayment = useFlutterwave(flwConfig);
      
      // Make payment
      makePayment({
        callback: function(response) {
          console.log("Payment response:", JSON.stringify(response));
          closePaymentModal();
          
          if (response.status === "successful" || response.status === "completed") {
            // Process successful payment
            toast.success("Payment successful!");
            
            // Submit to server
            axios.post("/api/live-courses/project-mgt/success", {
              transactionId: response.transaction_id || Date.now(),
              status: response.status,
              txRef: response.tx_ref
            })
            .then(() => {
              fetchLectureDetails();
            })
            .catch(error => {
              console.error("Error verifying payment:", error);
              toast.error("Payment received but verification failed.");
            });
          } else {
            toast.error("Payment was not successful");
          }
        },
        onClose: function() {
          toast("Payment canceled");
        }
      });
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Could not process payment. Please try again.");
    }
  };

  // Function to render lecture information if available
  const renderLectureInfo = () => {
    if (!lecture) return null;
    
    return (
      <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-2">Current Class Information</h3>
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
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>Course Page</title>
        <meta
          name="description"
          content="Welcome to the Project Management Course"
        />
      </Head>

      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Project Management
              </h1>
              <p className="text-xl mb-8">
                Lead the Charge to Success with Project Management! Imagine
                steering high-stakes projects from chaos to triumph—turning
                blueprints into reality on time, under budget, and beyond
                expectations. Project Management is the art of orchestrating
                teams, resources, and strategy to deliver results that move
                industries, spark innovation, and define careers.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://i.ibb.co/4nDmr2nb/Gemini-Generated-Image-72ww6w72ww6w72ww.jpg"
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
        <div className="flex-1 text-black">
          <div className="mt-4 md:mt-0 mb-4 md:mb-2 lg:mb-6">
            <h1 className="text-2xl lg:text-4xl font-bold mb-[4px]">
              Project Management
            </h1>
            <div className="h-[8px] w-[80px] md:w-[150px] bg-[#E79D09]"></div>
          </div>
          <h1 className="text-3xl text-green-800 lg:text-4xl font-extrabold mb-4 md:mb-2 lg:mb-6">
            250,000 NGN
          </h1>
          <p className="text-justify font-semibold max-sm:mb-1">
            Techxos powers your rise: Simulate real-world projects (think
            software launches or event megaprojects), learn from PMs who&#39;ve
            delivered billion-dollar portfolios, and join a network of leaders
            obsessed with efficiency and impact. Dive into stakeholder mapping,
            risk mitigation, and Lean practices, while earning certifications
            that scream &quot;promote me.&quot; Ready to transform ideas into
            legacy? Enroll now and start delivering success—one milestone at a
            time. 🚀📅🎯
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
              Project Management Virtual
            </h2>
            
            {/* Display lecture information if available */}
            {renderLectureInfo()}
            
            <div className=" p-2 md:p-4 mt-2 md:mt-3 mb-1 shadow-md hover:bg-white hover:text-green-700 transition-all duration-500 text-white border-2 border-[#38a169] rounded-md inline-block bg-green-700 font-bold border-solid">
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
                    <Button onClick={handleJoinClass}>Join Live Class</Button>
                  ) : (
                    <Button onClick={handlePurchase}>Purchase Course</Button>
                  );
                })()
              )}
            </div>
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
      <ProjectManagement />
      <ScrollToTopButton />
    </div>
  );
}
