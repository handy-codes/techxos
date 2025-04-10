"use client&quot;;
import React, { useState, useEffect, useCallback } from &quot;react&quot;;
import Head from &quot;next/head&quot;;
import Image from &quot;next/image&quot;;
import Link from &quot;next/link&quot;;
import { FaCheckCircle, FaRegClock } from &quot;react-icons/fa&quot;;
import { AiFillSchedule } from &quot;react-icons/ai&quot;;
import { HiLocationMarker } from &quot;react-icons/hi&quot;;
import { IoMdOptions } from &quot;react-icons/io&quot;;
import Cybersecurity from &quot;@/components/curriculum/Cybersecurity&quot;;
import ScrollToTopButton from &quot;@/components/layout/ScrollToTopButton&quot;;
import { useAuth } from &quot;@clerk/nextjs&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;
import JoinLiveClassButton from &quot;@/components/course/JoinLiveClassButton&quot;;
import CoursePurchaseButton from &quot;@/components/course/CoursePurchaseButton&quot;;


export default function Page() {
  const [formData, setFormData] = useState({
    courseTitle: &quot;CyberSecurity&quot;,
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
        courseTitle: &quot;CyberSecurity&quot;,
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
        <meta
          name=&quot;description&quot;
          content=&quot;Welcome to the Cybersecurity Course&quot;
        />
      </Head>

      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700&quot;>
        <div className=&quot;max-w-7xl mx-auto&quot;>
          <div className=&quot;grid lg:grid-cols-2 gap-12 items-center&quot;>
            <div className=&quot;text-white&quot;>
              <h1 className=&quot;text-4xl sm:text-5xl font-bold mb-6&quot;>
                CyberSecurity
              </h1>
              <p className=&quot;text-xl mb-8 &quot;>
                Become the Digital Guardian of the Future with Cybersecurity! Be
                up to speed with outsmarting hackers, shielding sensitive data,
                and fortifying the backbone of the internet—that's
                cybersecurity. In a world where cyber threats evolve by the
                second, you'll be the frontline defender, turning
                vulnerabilities into vaults and chaos into control.
              </p>
              <p className=&quot;text-xl mb-8&quot;>
                From stopping ransomware attacks that cripple Fortune 500
                companies to securing smart homes and national infrastructure,
                cybersecurity is the ultimate game of digital cat and mouse.
                You'll master ethical hacking, penetration testing, firewall
                wizardry, and tools like Kali Linux, Wireshark, and
                SIEM—transforming you into a cyber ninja who thwarts breaches
                before they happen.
              </p>
            </div>
            <div className=&quot;relative h-96 rounded-2xl overflow-hidden shadow-xl&quot;>
              <Image
                src=&quot;https://media.istockphoto.com/id/1484313578/photo/cyber-security-network-data-protection-privacy-concept.jpg?b=1&s=612x612&w=0&k=20&c=yNJBpJoRA6o8ysgTJyTyCduvzbJDUCKJuKKBZghVnDQ=&quot;
                // src=&quot;https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF-4cK7qw8-AroSfhE44AvDOvA-cyFM5p9ww&s&quot;
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
              CyberSecurity
            </h1>
            <div className=&quot;h-[8px] w-[80px] md:w-[150px] bg-[#E79D09]&quot;></div>
          </div>
          <h1 className=&quot;text-3xl text-green-800 lg:text-4xl font-extrabold mb-4 md:mb-2 lg:mb-6&quot;>
            350,000 NGN
          </h1>
          <p className=&quot;text-justify font-semibold max-sm:mb-1&quot;>
            Techxos arms you for battle: Tackle real-world simulations (like
            defending a live network or cracking encrypted puzzles), learn from
            industry pros who've foiled cybercrime rings, and join a legion of
            ethical hackers obsessed with outsmarting the dark web. Dive into
            cryptography, incident response, and compliance frameworks, while
            earning certifications that scream &quot;hire me&quot; to top employers. Ready
            to be the hero the internet needs? Enroll now and start locking down
            the digital frontier—one threat at a time. 🛡️🔒💻
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
              <span>Duration: 16 weeks</span>
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
      <Cybersecurity />
      <ScrollToTopButton />
      
    </div>
  );
}
