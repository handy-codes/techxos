"use client&quot;;
import React, { useState, useEffect, useCallback } from &quot;react&quot;;
import Head from &quot;next/head&quot;;
import Image from &quot;next/image&quot;;
import Link from &quot;next/link&quot;;
import { FaCheckCircle, FaRegClock } from &quot;react-icons/fa&quot;;
import { AiFillSchedule } from &quot;react-icons/ai&quot;;
import { HiLocationMarker } from &quot;react-icons/hi&quot;;
import { IoMdOptions } from &quot;react-icons/io&quot;;
import UIUX from &quot;@/components/curriculum/Ui-Ux&quot;;
import ScrollToTopButton from &quot;@/components/layout/ScrollToTopButton&quot;;
import { useAuth } from &quot;@clerk/nextjs&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;
import JoinLiveClassButton from &quot;@/components/course/JoinLiveClassButton&quot;;
import CoursePurchaseButton from &quot;@/components/course/CoursePurchaseButton&quot;;


export default function Page() {
  const [formData, setFormData] = useState({
    courseTitle: &quot;UI-UX Design&quot;,
    name: &quot;",
    surname: &quot;&quot;,
    email: &quot;&quot;,
    subject: &quot;&quot;,
    message: &quot;&quot;,
  });

  
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [userRoleState, setUserRoleState] = useState<string | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    &quot;idle&quot; | &quot;success&quot; | &quot;error&quot;
  >(&quot;idle&quot;);

  
  // Function to determine if the current user is an admin based on their email
  const checkIfUserIsAdmin = useCallback(async () => {
    if (!isSignedIn || !userId) return false;
    
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      console.log(&quot;Current user email:&quot;, userEmail);
      
      if (!userEmail) return false;
      
      // Known admin emails - add any admin emails here
      const adminEmails = [
        &quot;paxymekventures@gmail.com&quot;,
        &quot;admin@techxos.com&quot;,
        &quot;emeka@techxos.com&quot;
      ];
      
      // Direct check for known admin emails
      if (adminEmails.includes(userEmail.toLowerCase())) {
        console.log(&quot;User is admin based on email match!&quot;);
        setUserRoleState(&quot;HEAD_ADMIN&quot;);
        setHasAccess(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(&quot;Error in admin check:&quot;, error);
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
    setSubmitStatus(&quot;idle&quot;);

    const formDataToSend = new FormData();
    formDataToSend.append(&quot;courseTitle&quot;, formData.courseTitle);
    formDataToSend.append(&quot;name&quot;, formData.name);
    formDataToSend.append(&quot;surname&quot;, formData.surname);
    formDataToSend.append(&quot;email&quot;, formData.email);
    formDataToSend.append(&quot;subject&quot;, formData.subject);
    formDataToSend.append(&quot;message&quot;, formData.message);

    try {
      const response = await fetch(&quot;/api/nofilesubmit-form&quot;, {
        method: &quot;POST&quot;,
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || &quot;Submission failed&quot;);
      }

      setSubmitStatus(&quot;success&quot;);
      setFormData({
        courseTitle: &quot;UI-UX Design&quot;,
        name: &quot;&quot;,
        surname: &quot;&quot;,
        email: &quot;&quot;,
        subject: &quot;&quot;,
        message: &quot;&quot;,
      });
    } catch (error) {
      console.error(&quot;Submission error:&quot;, error);
      setSubmitStatus(&quot;error&quot;);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Course Page</title>
        <meta name=&quot;description&quot; content=&quot;Welcome to the UI-UX Design Course&quot; />
      </Head>

      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700&quot;>
        <div className=&quot;max-w-7xl mx-auto&quot;>
          <div className=&quot;grid lg:grid-cols-2 gap-12 items-center&quot;>
            <div className=&quot;text-white&quot;>
              <h1 className=&quot;text-4xl sm:text-5xl font-bold mb-6&quot;>
                UI-UX Design
              </h1>
              <p className=&quot;text-xl mb-8&quot;>
                Craft interfaces so intuitive, they feel like second
                nature—where every click, swipe, and scroll sparks joy. UI/UX
                Design is the alchemy of blending aesthetics with empathy,
                turning complex problems into seamless digital experiences that
                users love.
              </p>
              <p className=&quot;text-xl mb-8&quot;>
                You'll master tools like Figma, Adobe XD, and Sketch,
                wireframing prototypes, conducting user research, and perfecting
                pixel-perfect layouts that balance form and function. Build
                real-world projects—from e-commerce apps to fintech
                dashboards—get feedback from design pros.
              </p>
            </div>
            <div className=&quot;relative h-96 rounded-2xl overflow-hidden shadow-xl&quot;>
              <Image
                src=&quot;https://i.ibb.co/xqN3xy1J/Gemini-Generated-Image-v5ipemv5ipemv5ip.jpg&quot;
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

      <section className=&quot;container mx-auto p-4 mt-4 flex flex-col md:flex-row gap-8&quot;>
        {/* Left Column - Course Details */}
        <div className=&quot;flex-1 text-black&quot;>
          <div className=&quot;mt-4 md:mt-0 mb-4 md:mb-2 lg:mb-6&quot;>
            <h1 className=&quot;text-2xl lg:text-4xl font-bold mb-[4px]&quot;>
              UI-UX Design
            </h1>
            <div className=&quot;h-[8px] w-[80px] md:w-[150px] bg-[#E79D09]&quot;></div>
          </div>
          <h1 className=&quot;text-3xl text-green-800 lg:text-4xl font-extrabold mb-4 md:mb-2 lg:mb-6&quot;>
            150,000 NGN
          </h1>
          <p className=&quot;text-justify font-semibold max-sm:mb-1&quot;>
            In 12 weeks, master the art of building websites and apps that run
            on the internet. Explore the flexibility of Nextjs as a third-party
            library for Reactjs. With Tailwindcss, a better knowledge of the
            color theory and other modern tools, you will be able to create
            responsive and visually appealing websites.
          </p>
          <div className=&quot;p-2 md:p-4 mt-2 md:mt-3 mb-1 shadow-md hover:bg-green-700 hover:text-white transition-all duration-500 border-2 border-[#38a169] rounded-md inline-block bg-white font-bold border-solid&quot;>
            <a
              href=&quot;https://wa.me/2348167715107&quot;
              target=&quot;_blank&quot;
              rel=&quot;noopener noreferrer&quot;
            >
              Contact an Advisor
            </a>
          </div>
          <div className=&quot;font-semibold&quot;>
            <div className=&quot;flex items-center gap-3 mt-3 md:mt-4&quot;>
              <FaRegClock className=&quot;text-black text-[22px]&quot; />
              <span>Duration: 12 weeks</span>
            </div>
            <div className=&quot;flex items-center gap-3 mt-3 md:mt-4&quot;>
              <AiFillSchedule className=&quot;text-black text-[24px]&quot; />
              <span>Schedule: 9 hours/week</span>
            </div>
            <div className=&quot;flex items-center gap-3 mt-3 md:mt-4&quot;>
              <HiLocationMarker className=&quot;text-black text-[27px]&quot; />
              <span>Location: In-person or online</span>
            </div>
            <div className=&quot;flex items-center gap-3 mt-3 md:mt-4&quot;>
              <IoMdOptions className=&quot;text-black text-[24px]&quot; />
              <span>Options: Evening Class, Executive (one-to-one) class</span>
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div
          id=&quot;contact&quot;
          className=&quot;flex-1 text-black bg-gray-100 p-6 rounded-lg shadow-md&quot;
        >
          <h1 className=&quot;text-2xl font-bold mb-4&quot;>
            Contact Us for More Enquiry
          </h1>
          <form onSubmit={handleSubmit}>
            <div className=&quot;mb-4&quot;>
              <label className=&quot;block text-sm font-medium mb-1&quot;>
                Course Title:
              </label>
              <input
                type=&quot;text&quot;
                name=&quot;courseTitle&quot;
                value={formData.courseTitle}
                readOnly
                className=&quot;w-full p-2 border font-bold text-2xl rounded bg-gray-200&quot;
              />
            </div>
            <div className=&quot;mb-4&quot;>
              <label className=&quot;block text-sm font-medium mb-1&quot;>Name*</label>
              <input
                type=&quot;text&quot;
                name=&quot;name&quot;
                required
                value={formData.name}
                onChange={handleChange}
                className=&quot;w-full p-2 border rounded&quot;
              />
            </div>
            <div className=&quot;mb-4&quot;>
              <label className=&quot;block text-sm font-medium mb-1&quot;>Surname*</label>
              <input
                type=&quot;text&quot;
                name=&quot;surname&quot;
                required
                value={formData.surname}
                onChange={handleChange}
                className=&quot;w-full p-2 border rounded&quot;
              />
            </div>
            <div className=&quot;mb-4&quot;>
              <label className=&quot;block text-sm font-medium mb-1&quot;>Email*</label>
              <input
                type=&quot;email&quot;
                name=&quot;email&quot;
                required
                value={formData.email}
                onChange={handleChange}
                className=&quot;w-full p-2 border rounded&quot;
              />
            </div>
            <div className=&quot;mb-4&quot;>
              <label className=&quot;block text-sm font-medium mb-1&quot;>Subject*</label>
              <input
                type=&quot;text&quot;
                name=&quot;subject&quot;
                required
                value={formData.subject}
                onChange={handleChange}
                className=&quot;w-full p-2 border rounded&quot;
              />
            </div>
            <div className=&quot;mb-4&quot;>
              <label className=&quot;block text-sm font-medium mb-1&quot;>Message*</label>
              <textarea
                name=&quot;message&quot;
                required
                value={formData.message}
                onChange={handleChange}
                className=&quot;w-full p-2 border rounded&quot;
                rows={4}
              ></textarea>
            </div>
            <button
              type=&quot;submit&quot;
              disabled={isSubmitting}
              className=&quot;w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300&quot;
            >
              {isSubmitting ? &quot;Submitting...&quot; : &quot;Submit&quot;}
            </button>
            {submitStatus === &quot;success&quot; && (
              <div className=&quot;mt-4 flex items-center text-green-600&quot;>
                <FaCheckCircle className=&quot;mr-2&quot; size={24} />
                <p className=&quot;font-bold&quot;>Form submitted successfully!</p>
              </div>
            )}
            {submitStatus === &quot;error&quot; && (
              <p className=&quot;mt-4 text-red-600">
                Failed to submit the form. Please try again.
              </p>
            )}
          </form>
        </div>
      </section>
      <UIUX />
      <ScrollToTopButton />      
    </div>
  );
}
