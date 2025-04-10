"use client&quot;;
import React, { useState, useEffect, useCallback } from &quot;react&quot;;
import Head from &quot;next/head&quot;;
import Image from &quot;next/image&quot;;
import Link from &quot;next/link&quot;;
import { FaCheckCircle, FaRegClock } from &quot;react-icons/fa&quot;;
import { AiFillSchedule } from &quot;react-icons/ai&quot;;
import { HiLocationMarker } from &quot;react-icons/hi&quot;;
import { IoMdOptions } from &quot;react-icons/io&quot;;
import ProjectManagement from &quot;@/components/curriculum/Project-Mgt&quot;;
import ScrollToTopButton from &quot;@/components/layout/ScrollToTopButton&quot;;
import { useAuth } from &quot;@clerk/nextjs&quot;;
import axios from &quot;axios&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { useFlutterwave, closePaymentModal } from &quot;flutterwave-react-v3&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;
import JoinLiveClassButton from &quot;@/components/course/JoinLiveClassButton&quot;;
import CoursePurchaseButton from &quot;@/components/course/CoursePurchaseButton&quot;;

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
    courseTitle: &quot;Project Management&quot;,
    name: &quot;",
    surname: &quot;&quot;,
    email: &quot;&quot;,
    subject: &quot;&quot;,
    message: &quot;&quot;,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    &quot;idle&quot; | &quot;success&quot; | &quot;error&quot;
  >(&quot;idle&quot;);

  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const [lecture, setLecture] = useState<LiveCourseWithLectures | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [userRoleState, setUserRoleState] = useState<string | null>(null);

  const fetchLectureDetails = useCallback(async () => {
    try {
      console.log(&quot;Fetching lecture details...&quot;);
      const response = await axios.get(&quot;/api/live-courses/project-mgt/lecture&quot;);
      console.log(&quot;Lecture details response:&quot;, response.data);

      setLecture(response.data.lecture);
      setHasAccess(response.data.hasAccess);
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; statusText?: string; data?: any };
        message?: string;
      };
      console.error(&quot;Detailed fetch error:&quot;, {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.status === 401) {
        toast.error(&quot;Please sign in to access this course&quot;);
      } else if (err.response?.status === 500) {
        toast.error(&quot;Server error. Please try again later.&quot;);
      } else {
        toast.error(&quot;Failed to load lecture details&quot;);
      }
    }
  }, []);

  const fetchUserRole = useCallback(async () => {
    try {
      // Debug log
      console.log(&quot;Fetching user role...&quot;);
      
      // Call the API
      const response = await axios.get(&quot;/api/live-courses/project-mgt/lecture&quot;);
      
      // Debug log the full response
      console.log(&quot;API Response:&quot;, response.data);
      
      // Check if the response has role property directly
      if (response.data.role) {
        console.log(&quot;Setting user role state from response.data.role:&quot;, response.data.role);
        setUserRoleState(response.data.role);
      }
      
      // Also check if hasAccess is set in the response
      if (response.data.hasAccess !== undefined) {
        console.log(&quot;Setting hasAccess state:&quot;, response.data.hasAccess);
        setHasAccess(response.data.hasAccess);
      }
      
      // Set lecture data if available
      if (response.data.lecture) {
        console.log(&quot;Setting lecture state:&quot;, response.data.lecture);
        setLecture(response.data.lecture);
      }
      
      return response.data;
    } catch (error) {
      console.error(&quot;Error fetching user role:&quot;, error);
      return null;
    }
  }, []);

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

  // Add effect to log role state changes
  useEffect(() => {
    console.log(&quot;Current userRoleState:&quot;, userRoleState);
  }, [userRoleState]);

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
        courseTitle: &quot;Project Management&quot;,
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

  // Function to render lecture information if available
  const renderLectureInfo = () => {
    if (!lecture) return null;
    
    return (
      <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-sm&quot;>
        <h3 className=&quot;text-xl font-semibold mb-2&quot;>Current Class Information</h3>
        {lecture.lectures && lecture.lectures.length > 0 ? (
          <div>
            <p className=&quot;mb-2&quot;>
              <span className=&quot;font-medium&quot;>Latest lecture:</span>{&quot; "}
              {lecture.lectures[0].title || &quot;Upcoming Session&quot;}
            </p>
            <p className="mb-2&quot;>
              <span className=&quot;font-medium&quot;>Date:</span>{&quot; "}
              {new Date(lecture.lectures[0].date).toLocaleString()}
            </p>
            {lecture.lectures[0].isRecorded && lecture.lectures[0].recordingUrl && (
              <div className="mt-2&quot;>
                <a 
                  href={lecture.lectures[0].recordingUrl} 
                  target=&quot;_blank&quot; 
                  rel=&quot;noopener noreferrer&quot;
                  className=&quot;text-blue-600 hover:underline&quot;
                >
                  View Recording
                </a>
              </div>
            )}
          </div>
        ) : (
          <p>No scheduled lectures at this time. Please check back later.</p>
        )}
        <div className=&quot;mt-4&quot;>
          <JoinLiveClassButton 
            courseId=&quot;project-mgt&quot; 
            courseName=&quot;Project Management&quot; 
          />
        </div>
      </div>
    );
  };

  // Replace the handleJoinClass function with a reference to the course ID
  const courseId = &quot;project-management-course-id&quot;; // This should be the actual course ID from your database

  return (
    <div>
      <Head>
        <title>Course Page</title>
        <meta
          name=&quot;description&quot;
          content=&quot;Welcome to the Project Management Course&quot;
        />
      </Head>

      <section className=&quot;relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700&quot;>
        <div className=&quot;max-w-7xl mx-auto&quot;>
          <div className=&quot;grid lg:grid-cols-2 gap-12 items-center&quot;>
            <div className=&quot;text-white&quot;>
              <h1 className=&quot;text-4xl sm:text-5xl font-bold mb-6&quot;>
                Project Management
              </h1>
              <p className=&quot;text-xl mb-8&quot;>
                Lead the Charge to Success with Project Management! Imagine
                steering high-stakes projects from chaos to triumph—turning
                blueprints into reality on time, under budget, and beyond
                expectations. Project Management is the art of orchestrating
                teams, resources, and strategy to deliver results that move
                industries, spark innovation, and define careers.
              </p>
            </div>
            <div className=&quot;relative h-96 rounded-2xl overflow-hidden shadow-xl&quot;>
              <Image
                src=&quot;https://i.ibb.co/4nDmr2nb/Gemini-Generated-Image-72ww6w72ww6w72ww.jpg&quot;
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
        <div className=&quot;flex-1 text-black&quot;>
          <div className=&quot;mt-4 md:mt-0 mb-4 md:mb-2 lg:mb-6&quot;>
            <h1 className=&quot;text-2xl lg:text-4xl font-bold mb-[4px]&quot;>
              Project Management
            </h1>
            <div className=&quot;h-[8px] w-[80px] md:w-[150px] bg-[#E79D09]&quot;></div>
          </div>
          <h1 className=&quot;text-3xl text-green-800 lg:text-4xl font-extrabold mb-4 md:mb-2 lg:mb-6&quot;>
            250,000 NGN
          </h1>
          <p className=&quot;text-justify font-semibold max-sm:mb-1&quot;>
            Techxos powers your rise: Simulate real-world projects (think
            software launches or event megaprojects), learn from PMs who&#39;ve
            delivered billion-dollar portfolios, and join a network of leaders
            obsessed with efficiency and impact. Dive into stakeholder mapping,
            risk mitigation, and Lean practices, while earning certifications
            that scream &quot;promote me.&quot; Ready to transform ideas into
            legacy? Enroll now and start delivering success—one milestone at a
            time. 🚀📅🎯
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
            <h2 className=&quot;text-2xl font-bold mb-2 mt-6&quot;>
              Project Management Virtual
            </h2>
            
            {/* Display lecture information if available */}
            {renderLectureInfo()}
            
            <div className=&quot; p-2 md:p-4 mt-2 md:mt-3 mb-1 shadow-md hover:bg-white hover:text-green-700 transition-all duration-500 text-white border-2 border-[#38a169] rounded-md inline-block bg-green-700 font-bold border-solid&quot;>
              {!isSignedIn ? (
                <Link
                  href=&quot;/sign-in&quot;
                  className=&quot;inline-bloc text-white md:p-4 mt-2 md:mt-3 mb-1 shadow-md hover:bg-green-700 hover:text-white transition-all duration-500 border-2 border-[#38a169] rounded-md bg-white font-bold border-solid&quot;
                >
                  Enroll Now
                </Link>
              ) : (
                (() => {
                  console.log(&quot;Rendering button with role:&quot;, userRoleState, &quot;hasAccess:&quot;, hasAccess);
                  
                  // Admin roles always get access
                  const isAdmin = 
                    userRoleState === &quot;HEAD_ADMIN&quot; ||
                    userRoleState === &quot;ADMIN&quot; ||
                    userRoleState === &quot;LECTURER&quot;;
                  
                  // Final access decision
                  const shouldShowJoinButton = hasAccess || isAdmin;
                  
                  return shouldShowJoinButton ? (
                    <JoinLiveClassButton 
                      courseId=&quot;project-mgt&quot; 
                      courseName=&quot;Project Management&quot; 
                    />
                  ) : (
                    <CoursePurchaseButton 
                      courseId=&quot;project-mgt&quot; 
                      courseName=&quot;Project Management&quot; 
                    />
                  );
                })()
              )}
            </div>
          </div>
        </div>

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
      <ProjectManagement />
      <ScrollToTopButton />
    </div>
  );
}
