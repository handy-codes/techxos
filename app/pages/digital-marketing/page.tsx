"use client";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle, FaRegClock } from "react-icons/fa";
import { AiFillSchedule } from "react-icons/ai";
import { HiLocationMarker } from "react-icons/hi";
import { IoMdOptions } from "react-icons/io";
import DigitalMarketing from "@/components/curriculum/Digital-Marketing";

export default function Page() {
  const [formData, setFormData] = useState({
    courseTitle: "Digital Marketing",
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
        courseTitle: "Digital Marketing",
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
          content="Welcome to the Digital Marketing Course"
        />
      </Head>

      <section className="relative py-20 px-4 mt-[8%] sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Digital Marketing
              </h1>
              <p className="text-xl mb-8">
                Dominate the Digital Age with Digital Marketing! Imagine turning
                clicks into customers, data into dollars, and hashtags into
                global movements—that’s digital marketing. It’s the art and
                science of connecting brands with audiences in a hyper-connected
                world, where every tweet, ad, and viral trend can spark a
                revolution. 
              </p>
              <p className="text-xl mb-8">
                From crafting Instagram campaigns that sell out
                products overnight to optimizing Google Ads that dominate search
                rankings, digital marketers are the growth hackers of the modern
                economy. You’ll master SEO, social media wizardry, content
                creation, email magic, and analytics tools like Google Analytics
                and Meta Ads—transforming vague ideas into revenue rockets.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="data:image/png;base64,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"
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
              Digital Marketing
            </h1>
            <div className="h-[8px] w-[80px] md:w-[150px] bg-[#E79D09]"></div>
          </div>
          <h1 className="text-3xl text-green-800 lg:text-4xl font-extrabold mb-4 md:mb-2 lg:mb-6">
            150,000 NGN
          </h1>
          <p className="text-justify font-semibold max-sm:mb-1">
            Techxos fuels your ascent: Run real campaigns, analyze live
            metrics, and learn from mentors who’ve scaled brands to millions.
            Dive into influencer collaborations, SEO wars, and AI-powered ad
            targeting, while joining a tribe of marketers obsessed with ROI,
            engagement, and breaking the internet. Ready to turn pixels into
            profit and followers into fanatics? Enroll now and start ruling the
            digital marketplace—one viral moment at a time. 🚀📈💰
          </p>
          <div className="p-2 md:p-4 mt-2 md:mt-3 mb-1 hover:bg-green-700 hover:text-white transition border-2 border-[#38a169] rounded-md inline-block bg-white font-bold">
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
      <DigitalMarketing />
    </div>
  );
}
