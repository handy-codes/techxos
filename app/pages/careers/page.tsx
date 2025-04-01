"use client";
import React, { useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import { NumericFormat } from "react-number-format"; // Corrected import

export default function Page() {
  const [formData, setFormData] = useState({
    courseTitle: "Job Application",
    name: "",
    surname: "",
    email: "",
    subject: "",
    message: "",
    wage: "",
    currency: "NGN",
    resume: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;

    if (name === "resume" && files && files.length > 0) {
      setFormData((prev) => ({ ...prev, resume: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCurrencyToggle = () => {
    setFormData((prev) => ({
      ...prev,
      currency: prev.currency === "NGN" ? "USD" : "NGN",
    }));
  };

  const handleWageChange = (values: any) => {
    const { value } = values;
    setFormData((prev) => ({ ...prev, wage: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Get the form element
    const form = e.currentTarget;
    const formDataToSend = new FormData(form);

    // Add the wage value since NumericFormat doesn't automatically add it to the form
    formDataToSend.set("wage", formData.wage || "0");
    formDataToSend.set("currency", formData.currency);

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitStatus("success");
      setFormData({
        courseTitle: "Job Application",
        name: "",
        surname: "",
        email: "",
        subject: "",
        message: "",
        wage: "",
        currency: "NGN",
        resume: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-[22%] sm:mt-[9%]">
      <Head>
        <title>Course Page</title>
        <meta
          name="description"
          content="Welcome to the Catering and Hotel Management Course"
        />
      </Head>

      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Tech Instructor
              </h1>
              <p className="text-xl mb-8">
                Join Techxos Learning Management System and reach thousands of
                eager learners by sharing your expertise through engaging online
                courses and classroom lectures. Our platform provides seamless
                course creation tools, AI-powered assistance, and a growing
                community to help you succeed. Sign up today or easily apply
                below and start earning while empowering the next generation of
                professionals!
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.pexels.com/photos/1181370/pexels-photo-1181370.jpeg?auto=compress&cs=tinysrgb&w=600"
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

      <div className="container mx-auto p-4 mt-4 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-4xl text-[#003E8F] font-bold mb-2">
            Join Techxos
          </h1>
          <p className="text-lg">
            Earn While You Teach – Monetize your knowledge by reaching a wide
            audience of learners on Techxos LMS, with flexible earning
            opportunities and no upfront costs. One option is to lecture
            in-person at our office location.
          </p>
          <br />
          <p className="text-lg mb-6">
            You can also create a course video and upload it here and earn as
            users purchase the course. In the Instructor page, you can also see
            your dashboard and a wallet to track your earnings. Start with
            submitting a job application here.
          </p>
          <Link
            href="https://wa.me/2348167715107"
            className="text-white font-bold mt-6 bg-[green] p-4 rounded hover:text-[green] hover:bg-white hover:border hover:border-green-700 transition duration-500"
          >
            Contact a Course Advisor
          </Link>
        </div>

        <div
          id="contact"
          className="flex-1 text-black bg-gray-100 p-6 rounded-lg shadow-md"
        >
          <h1 className="text-2xl font-bold mb-4">
            Submit your Instructor Application
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              {/* <label className="block text-sm font-medium mb-1">
                Course Title:
              </label> */}
              <input
                type="text"
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
                className="w-full p-2 border rounded outline-none"
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
                className="w-full p-2 border rounded outline-none"
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
                className="w-full p-2 border rounded outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Course Title*
              </label>
              <select
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="max-sm:w-[55%] xl:w-full p-2 border rounded outline-none"
              >
                <option value="">Select a course</option>
                <option value="Frontend Development">Frontend Development</option>
                <option value="Fullstack Development">Fullstack Development</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Data Science">Data Science</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Software Development">Software Development</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Your Min. Wage Rate/Hr ({formData.currency})*
              </label>
              <div className="flex items-center">
                <NumericFormat
                  thousandSeparator={true}
                  prefix={formData.currency === "NGN" ? "₦" : "$"}
                  name="wage"
                  required
                  value={formData.wage}
                  onValueChange={handleWageChange}
                  className="w-full p-2 border rounded outline-none"
                  placeholder="Be competitive (click end button for NGN or USD)"
                />
                <button
                  type="button"
                  onClick={handleCurrencyToggle}
                  className={`ml-2 p-2 border rounded ${
                    formData.currency === "NGN"
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {formData.currency}
                </button>
              </div>
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
                placeholder="Easily paste a Cover Letter or briefly state why you are the best fit for this job."
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Upload your Resume*
              </label>
              <input
                type="file"
                name="resume"
                required
                onChange={handleChange}
                className="w-full p-2 border rounded"
                ref={fileInputRef}
              />
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
                <p className="font-bold">Application submitted successfully!</p>
              </div>
            )}
            {submitStatus === "error" && (
              <p className="mt-4 text-red-600">
                Failed to submit the form. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}




// "use client";
// import React, { useState, useRef } from "react";
// import Head from "next/head";
// import Image from "next/image";
// import Link from "next/link";
// import { FaCheckCircle } from "react-icons/fa";
// import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
// import { NumericFormat } from "react-number-format"; // Corrected import

// export default function Page() {
//   const [formData, setFormData] = useState({
//     courseTitle: "Job Application",
//     name: "",
//     surname: "",
//     email: "",
//     subject: "",
//     message: "",
//     wage: "",
//     currency: "NGN",
//     resume: null as File | null,
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState<
//     "idle" | "success" | "error"
//   >("idle");
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ): void => {
//     const { name, value } = e.target;
//     const files = (e.target as HTMLInputElement).files;

//     if (name === "resume" && files && files.length > 0) {
//       setFormData((prev) => ({ ...prev, resume: files[0] }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleCurrencyToggle = () => {
//     setFormData((prev) => ({
//       ...prev,
//       currency: prev.currency === "NGN" ? "USD" : "NGN",
//     }));
//   };

//   const handleWageChange = (values: any) => {
//     const { value } = values;
//     setFormData((prev) => ({ ...prev, wage: value }));
//   };

//   const handleSubmit = async (
//     e: React.FormEvent<HTMLFormElement>
//   ): Promise<void> => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus("idle");

//     const formDataToSend = new FormData();
//     formDataToSend.append("courseTitle", formData.courseTitle);
//     formDataToSend.append("name", formData.name);
//     formDataToSend.append("surname", formData.surname);
//     formDataToSend.append("email", formData.email);
//     formDataToSend.append("subject", formData.subject);
//     formDataToSend.append("message", formData.message);
//     formDataToSend.append("wage", formData.wage);
//     formDataToSend.append("currency", formData.currency);
//     if (formData.resume) {
//       formDataToSend.append("resume", formData.resume);
//     }

//     try {
//       const response = await fetch("/api/submit-form", {
//         method: "POST",
//         body: formDataToSend,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Submission failed");
//       }

//       setSubmitStatus("success");
//       setFormData({
//         courseTitle: "Job Application",
//         name: "",
//         surname: "",
//         email: "",
//         subject: "",
//         message: "",
//         wage: "",
//         currency: "NGN",
//         resume: null,
//       });
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     } catch (error) {
//       console.error("Submission error:", error);
//       setSubmitStatus("error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="mt-[22%] sm:mt-[9%]">
//       <Head>
//         <title>Course Page</title>
//         <meta
//           name="description"
//           content="Welcome to the Catering and Hotel Management Course"
//         />
//       </Head>

//       <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div className="text-white">
//               <h1 className="text-4xl sm:text-5xl font-bold mb-6">
//                 Tech Instructor
//               </h1>
//               <p className="text-xl mb-8">
//                 Join Techxos Learning Management System and reach thousands of
//                 eager learners by sharing your expertise through engaging online
//                 courses and classroom lectures. Our platform provides seamless
//                 course creation tools, AI-powered assistance, and a growing
//                 community to help you succeed. Sign up today or easily apply
//                 below and start earning while empowering the next generation of
//                 professionals!
//               </p>
//             </div>
//             <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
//               <Image
//                 src="https://images.pexels.com/photos/1181370/pexels-photo-1181370.jpeg?auto=compress&cs=tinysrgb&w=600"
//                 alt="Team Collaboration"
//                 fill
//                 className="object-cover"
//                 priority
//                 sizes="(max-width: 768px) 100vw, 50vw"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="container mx-auto p-4 mt-4 flex flex-col md:flex-row gap-8">
//         <div className="flex-1">
//           <h1 className="text-4xl text-[#003E8F] font-bold mb-2">
//             Join Techxos
//           </h1>
//           <p className="text-lg">
//             Earn While You Teach – Monetize your knowledge by reaching a wide
//             audience of learners on Techxos LMS, with flexible earning
//             opportunities and no upfront costs. One option is to lecture
//             in-person at our office location.
//           </p>
//           <br />
//           <p className="text-lg mb-6">
//             You can also create a course video and upload it here and earn as
//             users purchase the course. In the Instructor page, you can also see
//             your dashboard and a wallet to track your earnings. Start with
//             submitting a job application here.
//           </p>
//           <Link
//             href="https://wa.me/2348167715107"
//             className="text-white font-bold mt-6 bg-[green] p-4 rounded hover:text-[green] hover:bg-white hover:border hover:border-green-700 transition duration-500"
//           >
//             Contact a Course Advisor
//           </Link>
//         </div>

//         <div
//           id="contact"
//           className="flex-1 text-black bg-gray-100 p-6 rounded-lg shadow-md"
//         >
//           <h1 className="text-2xl font-bold mb-4">
//             Submit your Instructor Application
//           </h1>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">
//                 Course Title:
//               </label>
//               <input
//                 type="text"
//                 value={formData.courseTitle}
//                 readOnly
//                 className="w-full p-2 border font-bold text-2xl rounded bg-gray-200"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Name*</label>
//               <input
//                 type="text"
//                 name="name"
//                 required
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded outline-none"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Surname*</label>
//               <input
//                 type="text"
//                 name="surname"
//                 required
//                 value={formData.surname}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded outline-none"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Email*</label>
//               <input
//                 type="email"
//                 name="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded outline-none"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">
//                 Course Title*
//               </label>
//               <select
//                 name="subject"
//                 required
//                 value={formData.subject}
//                 onChange={handleChange}
//                 className="max-sm:w-[55%] xl:w-full p-2 border rounded outline-none"
//               >
//                 <option value="">Select a course</option>
//                 <option value="Frontend Development">Frontend Development</option>
//                 <option value="Fullstack Development">Fullstack Development</option>
//                 <option value="Cybersecurity">Cybersecurity</option>
//                 <option value="UI/UX">UI/UX</option>
//                 <option value="Data Science">Data Science</option>
//                 <option value="Artificial Intelligence">Artificial Intelligence</option>
//                 <option value="Software Development">Software Development</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">
//                 Your Min. Wage Rate/Hr ({formData.currency})*
//               </label>
//               <div className="flex items-center">
//                 <NumericFormat
//                   thousandSeparator={true}
//                   prefix={formData.currency === "NGN" ? "₦" : "$"}
//                   name="wage"
//                   required
//                   value={formData.wage}
//                   onValueChange={handleWageChange}
//                   className="w-full p-2 border rounded outline-none"
//                   placeholder="Be competitive (click end button for NGN or USD)"
//                 />
//                 <button
//                   type="button"
//                   onClick={handleCurrencyToggle}
//                   className={`ml-2 p-2 border rounded ${
//                     formData.currency === "NGN"
//                       ? "bg-green-600 text-white"
//                       : "bg-blue-600 text-white"
//                   }`}
//                 >
//                   {formData.currency}
//                 </button>
//               </div>
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Message*</label>
//               <textarea
//                 name="message"
//                 required
//                 value={formData.message}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 rows={4}
//                 placeholder="Easily paste a Cover Letter or briefly state why you are the best fit for this job."
//               ></textarea>
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">
//                 Upload your Resume*
//               </label>
//               <input
//                 type="file"
//                 name="resume"
//                 required
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 ref={fileInputRef}
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
//             >
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </button>
//             {submitStatus === "success" && (
//               <div className="mt-4 flex items-center text-green-600">
//                 <FaCheckCircle className="mr-2" size={24} />
//                 <p className="font-bold">Application submitted successfully!</p>
//               </div>
//             )}
//             {submitStatus === "error" && (
//               <p className="mt-4 text-red-600">
//                 Failed to submit the form. Please try again.
//               </p>
//             )}
//           </form>
//         </div>
//       </div>
//       <ScrollToTopButton />
//     </div>
//   );
// }