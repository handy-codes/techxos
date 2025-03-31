"use client";
import React, { useState, useEffect } from "react";
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
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const { isSignedIn, userId } = useAuth();
  const [lecture, setLecture] = useState<LiveCourseWithLectures | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    if (isSignedIn && userId) {
      fetchLectureDetails();
    }
  }, [isSignedIn, userId]);

  const fetchLectureDetails = async () => {
    try {
      console.log("Fetching lecture details...");
      const response = await axios.get("/api/live-courses/project-mgt/lecture");
      console.log("Lecture details response:", response.data);

      setLecture(response.data.lecture);
      setHasAccess(response.data.hasAccess);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; statusText?: string; data?: any }; message?: string };
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
  };

  const handleJoinClass = async () => {
    try {
      const response = await axios.get(`/api/live-courses/project-mgt/lecture`);
      console.log("Full response:", response.data);
      console.log("Zoom link:", response.data.lecture?.zoomLink);

      if (response.data.lecture?.zoomLink) {
        window.open(response.data.lecture.zoomLink, "_blank");
      } else {
        toast.error("No active class link available");
        console.log("Missing zoom link in lecture data");
      }
    } catch (error: any) {
      console.error("Error details:", error.response?.data);
      toast.error(error.response?.data?.error || "Failed to join the class. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: `TX-${Date.now()}`,
    amount: 0,
    currency: "NGN",
    payment_options: "card",
    meta: {
      consumer_id: "",
      consumer_mac: "92a3-912ba-1192a",
    },
    customer: {
      email: "",
      name: "",
      phone_number: "N/A",
    },
    customizations: {
      title: "Techxos Live Classes",
      description: "Payment for Live Course Access",
      logo: "https://your-logo-url.com/logo.png",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePurchase = async () => {
    try {
      const response = await axios.post("/api/live-courses/project-mgt/checkout", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { price, studentEmail, studentName } = response.data;

      config.amount = price;
      config.meta.consumer_id = studentEmail;
      config.customer.email = studentEmail;
      config.customer.name = studentName;

      handleFlutterPayment({
        callback: async (response) => {
          try {
            if (response.status === "successful") {
              await axios.post("/api/live-courses/project-mgt/success", {
                transactionId: response.transaction_id,
                status: response.status,
              });

              toast.success("Payment successful!");
              await fetchLectureDetails();
            } else {
              toast.error("Payment was not successful");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Failed to verify payment");
          } finally {
            closePaymentModal();
          }
        },
        onClose: () => {
          toast("Payment cancelled");
        },
      });
    } catch (error) {
      console.error("Purchase initialization error:", error);
      toast.error("Failed to initialize payment");
    }
  };
  return (
    <div>
      <Head>
        <title>Course Page</title>
        <meta name="description" content="Welcome to the Project Management Course" />
      </Head>

      <section className="relative py-20 px-4 mt-[8%] sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">Project Management</h1>
              <p className="text-xl mb-8">
                Lead the Charge to Success with Project Management! Imagine steering high-stakes projects from chaos to triumph—turning blueprints into reality on time, under budget, and beyond expectations. Project Management is the art of orchestrating teams, resources, and strategy to deliver results that move industries, spark innovation, and define careers.
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
            <h1 className="text-2xl lg:text-4xl font-bold mb-[4px]">Project Management</h1>
            <div className="h-[8px] w-[80px] md:w-[150px] bg-[#E79D09]"></div>
          </div>
          <h1 className="text-3xl text-green-800 lg:text-4xl font-extrabold mb-4 md:mb-2 lg:mb-6">250,000 NGN</h1>
          <p className="text-justify font-semibold max-sm:mb-1">
            Techxos powers your rise: Simulate real-world projects (think software launches or event megaprojects), learn from PMs who&#39;ve delivered billion-dollar portfolios, and join a network of leaders obsessed with efficiency and impact. Dive into stakeholder mapping, risk mitigation, and Lean practices, while earning certifications that scream &quot;promote me.&quot; Ready to transform ideas into legacy? Enroll now and start delivering success—one milestone at a time. 🚀📅🎯
          </p>
          <div className="p-2 md:p-4 mt-2 md:mt-3 mb-1 shadow-md hover:bg-green-700 hover:text-white transition-all duration-500 border-2 border-[#38a169] rounded-md inline-block bg-white font-bold border-solid">
            <a href="https://wa.me/2348167715107" target="_blank" rel="noopener noreferrer">
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
          </div>
        </div>

        <div id="contact" className="flex-1 text-black bg-gray-100 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Contact Us for More Enquiry</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Course Title:</label>
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
              <p className="mt-4 text-red-600">Failed to submit the form. Please try again.</p>
            )}
          </form>
        </div>
      </section>

      <div className="mt-6 p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">Live Classes</h2>
        {!isSignedIn ? (
          <Link
            href="/sign-in"
            className="inline-block p-2 md:p-4 mt-2 md:mt-3 mb-1 shadow-md hover:bg-green-700 hover:text-white transition-all duration-500 border-2 border-[#38a169] rounded-md bg-white font-bold border-solid"
          >
            Enroll Now
          </Link>
        ) : (
          <Button onClick={handleJoinClass}>Join Live Class</Button>
        )}
      </div>

      <ProjectManagement />
      <ScrollToTopButton />
    </div>
  );
}
