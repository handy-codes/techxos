"use client&quot;;
import React, { useState, useRef } from &quot;react&quot;;
import Head from &quot;next/head&quot;;
import Image from &quot;next/image&quot;;
import Link from &quot;next/link&quot;;
import { FaCheckCircle } from &quot;react-icons/fa&quot;;
import ScrollToTopButton from &quot;@/components/layout/ScrollToTopButton&quot;;
import { NumericFormat } from &quot;react-number-format&quot;; // Corrected import

export default function Page() {
  const [formData, setFormData] = useState({
    courseTitle: &quot;Job Application&quot;,
    name: &quot;",
    surname: &quot;&quot;,
    email: &quot;&quot;,
    subject: &quot;&quot;,
    message: &quot;&quot;,
    wage: &quot;&quot;,
    currency: &quot;NGN&quot;,
    resume: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    &quot;idle&quot; | &quot;success&quot; | &quot;error&quot;
  >(&quot;idle&quot;);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;

    if (name === &quot;resume&quot; && files && files.length > 0) {
      setFormData((prev) => ({ ...prev, resume: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCurrencyToggle = () => {
    setFormData((prev) => ({
      ...prev,
      currency: prev.currency === &quot;NGN&quot; ? &quot;USD&quot; : &quot;NGN&quot;,
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
    setSubmitStatus(&quot;idle&quot;);

    // Get the form element
    const form = e.currentTarget;
    const formDataToSend = new FormData(form);

    // Add the wage value since NumericFormat doesn't automatically add it to the form
    formDataToSend.set(&quot;wage&quot;, formData.wage || &quot;0&quot;);
    formDataToSend.set(&quot;currency&quot;, formData.currency);

    try {
      const response = await fetch(&quot;/api/submit-form&quot;, {
        method: &quot;POST&quot;,
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || &quot;Submission failed&quot;);
      }

      setSubmitStatus(&quot;success&quot;);
      setFormData({
        courseTitle: &quot;Job Application&quot;,
        name: &quot;&quot;,
        surname: &quot;&quot;,
        email: &quot;&quot;,
        subject: &quot;&quot;,
        message: &quot;&quot;,
        wage: &quot;&quot;,
        currency: &quot;NGN&quot;,
        resume: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = &quot;&quot;;
    } catch (error) {
      console.error(&quot;Submission error:&quot;, error);
      setSubmitStatus(&quot;error&quot;);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-[22%] sm:mt-[9%]&quot;>
      <Head>
        <title>Course Page</title>
        <meta
          name=&quot;description&quot;
          content=&quot;Welcome to the Catering and Hotel Management Course&quot;
        />
      </Head>

      <section className=&quot;relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700&quot;>
        <div className=&quot;max-w-7xl mx-auto&quot;>
          <div className=&quot;grid lg:grid-cols-2 gap-12 items-center&quot;>
            <div className=&quot;text-white&quot;>
              <h1 className=&quot;text-4xl sm:text-5xl font-bold mb-6&quot;>
                Tech Instructor
              </h1>
              <p className=&quot;text-xl mb-8&quot;>
                Join Techxos Learning Management System and reach thousands of
                eager learners by sharing your expertise through engaging online
                courses and classroom lectures. Our platform provides seamless
                course creation tools, AI-powered assistance, and a growing
                community to help you succeed. Sign up today or easily apply
                below and start earning while empowering the next generation of
                professionals!
              </p>
            </div>
            <div className=&quot;relative h-96 rounded-2xl overflow-hidden shadow-xl&quot;>
              <Image
                src=&quot;https://images.pexels.com/photos/1181370/pexels-photo-1181370.jpeg?auto=compress&cs=tinysrgb&w=600&quot;
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

      <div className=&quot;container mx-auto p-4 mt-4 flex flex-col md:flex-row gap-8&quot;>
        <div className=&quot;flex-1&quot;>
          <h1 className=&quot;text-4xl text-[#003E8F] font-bold mb-2&quot;>
            Join Techxos
          </h1>
          <p className=&quot;text-lg&quot;>
            Earn While You Teach – Monetize your knowledge by reaching a wide
            audience of learners on Techxos LMS, with flexible earning
            opportunities and no upfront costs. One option is to lecture
            in-person at our office location.
          </p>
          <br />
          <p className=&quot;text-lg mb-6&quot;>
            You can also create a course video and upload it here and earn as
            users purchase the course. In the Instructor page, you can also see
            your dashboard and a wallet to track your earnings. Start with
            submitting a job application here.
          </p>
          <Link
            href=&quot;https://wa.me/2348167715107&quot;
            className=&quot;text-white font-bold mt-6 bg-[green] p-4 rounded hover:text-[green] hover:bg-white hover:border hover:border-green-700 transition duration-500&quot;
          >
            Contact a Course Advisor
          </Link>
        </div>

        <div
          id=&quot;contact&quot;
          className=&quot;flex-1 text-black bg-gray-100 p-6 rounded-lg shadow-md&quot;
        >
          <h1 className=&quot;text-2xl font-bold mb-4&quot;>
            Submit your Instructor Application
          </h1>
          <form onSubmit={handleSubmit}>
            <div className=&quot;mb-4&quot;>
              {/* <label className=&quot;block text-sm font-medium mb-1&quot;>
                Course Title:
              </label> */}
              <input
                type=&quot;text&quot;
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
                className=&quot;w-full p-2 border rounded outline-none&quot;
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
                className=&quot;w-full p-2 border rounded outline-none&quot;
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
                className=&quot;w-full p-2 border rounded outline-none&quot;
              />
            </div>
            <div className=&quot;mb-4&quot;>
              <label className=&quot;block text-sm font-medium mb-1&quot;>
                Course Title*
              </label>
              <select
                name=&quot;subject&quot;
                required
                value={formData.subject}
                onChange={handleChange}
                className=&quot;max-sm:w-[55%] xl:w-full p-2 border rounded outline-none&quot;
              >
                <option value=&quot;">Select a course</option>
                <option value="Frontend Development&quot;>Frontend Development</option>
                <option value=&quot;Fullstack Development&quot;>Fullstack Development</option>
                <option value=&quot;Cybersecurity&quot;>Cybersecurity</option>
                <option value=&quot;UI/UX&quot;>UI/UX</option>
                <option value=&quot;Data Science&quot;>Data Science</option>
                <option value=&quot;Artificial Intelligence&quot;>Artificial Intelligence</option>
                <option value=&quot;Software Development&quot;>Software Development</option>
                <option value=&quot;Other&quot;>Other</option>
              </select>
            </div>
            <div className=&quot;mb-4&quot;>
              <label className=&quot;block text-sm font-medium mb-1&quot;>
                Your Min. Wage Rate/Hr ({formData.currency})*
              </label>
              <div className=&quot;flex items-center&quot;>
                <NumericFormat
                  thousandSeparator={true}
                  prefix={formData.currency === &quot;NGN&quot; ? &quot;₦" : &quot;$&quot;}
                  name=&quot;wage&quot;
                  required
                  value={formData.wage}
                  onValueChange={handleWageChange}
                  className=&quot;w-full p-2 border rounded outline-none&quot;
                  placeholder=&quot;Be competitive (click end button for NGN or USD)&quot;
                />
                <button
                  type=&quot;button&quot;
                  onClick={handleCurrencyToggle}
                  className={`ml-2 p-2 border rounded ${
                    formData.currency === &quot;NGN&quot;
                      ? &quot;bg-green-600 text-white&quot;
                      : &quot;bg-blue-600 text-white&quot;
                  }`}
                >
                  {formData.currency}
                </button>
              </div>
            </div>
            <div className="mb-4&quot;>
              <label className=&quot;block text-sm font-medium mb-1&quot;>Message*</label>
              <textarea
                name=&quot;message&quot;
                required
                value={formData.message}
                onChange={handleChange}
                className=&quot;w-full p-2 border rounded&quot;
                rows={4}
                placeholder=&quot;Easily paste a Cover Letter or briefly state why you are the best fit for this job.&quot;
              ></textarea>
            </div>
            <div className=&quot;mb-4&quot;>
              <label className=&quot;block text-sm font-medium mb-1&quot;>
                Upload your Resume*
              </label>
              <input
                type=&quot;file&quot;
                name=&quot;resume&quot;
                required
                onChange={handleChange}
                className=&quot;w-full p-2 border rounded&quot;
                ref={fileInputRef}
              />
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
                <p className=&quot;font-bold&quot;>Application submitted successfully!</p>
              </div>
            )}
            {submitStatus === &quot;error&quot; && (
              <p className=&quot;mt-4 text-red-600&quot;>
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




// &quot;use client&quot;;
// import React, { useState, useRef } from &quot;react&quot;;
// import Head from &quot;next/head&quot;;
// import Image from &quot;next/image&quot;;
// import Link from &quot;next/link&quot;;
// import { FaCheckCircle } from &quot;react-icons/fa&quot;;
// import ScrollToTopButton from &quot;@/components/layout/ScrollToTopButton&quot;;
// import { NumericFormat } from &quot;react-number-format&quot;; // Corrected import

// export default function Page() {
//   const [formData, setFormData] = useState({
//     courseTitle: &quot;Job Application&quot;,
//     name: &quot;",
//     surname: &quot;&quot;,
//     email: &quot;&quot;,
//     subject: &quot;&quot;,
//     message: &quot;&quot;,
//     wage: &quot;&quot;,
//     currency: &quot;NGN&quot;,
//     resume: null as File | null,
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState<
//     &quot;idle&quot; | &quot;success&quot; | &quot;error&quot;
//   >(&quot;idle&quot;);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ): void => {
//     const { name, value } = e.target;
//     const files = (e.target as HTMLInputElement).files;

//     if (name === &quot;resume&quot; && files && files.length > 0) {
//       setFormData((prev) => ({ ...prev, resume: files[0] }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleCurrencyToggle = () => {
//     setFormData((prev) => ({
//       ...prev,
//       currency: prev.currency === &quot;NGN&quot; ? &quot;USD&quot; : &quot;NGN&quot;,
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
//     setSubmitStatus(&quot;idle&quot;);

//     const formDataToSend = new FormData();
//     formDataToSend.append(&quot;courseTitle&quot;, formData.courseTitle);
//     formDataToSend.append(&quot;name&quot;, formData.name);
//     formDataToSend.append(&quot;surname&quot;, formData.surname);
//     formDataToSend.append(&quot;email&quot;, formData.email);
//     formDataToSend.append(&quot;subject&quot;, formData.subject);
//     formDataToSend.append(&quot;message&quot;, formData.message);
//     formDataToSend.append(&quot;wage&quot;, formData.wage);
//     formDataToSend.append(&quot;currency&quot;, formData.currency);
//     if (formData.resume) {
//       formDataToSend.append(&quot;resume&quot;, formData.resume);
//     }

//     try {
//       const response = await fetch(&quot;/api/submit-form&quot;, {
//         method: &quot;POST&quot;,
//         body: formDataToSend,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || &quot;Submission failed&quot;);
//       }

//       setSubmitStatus(&quot;success&quot;);
//       setFormData({
//         courseTitle: &quot;Job Application&quot;,
//         name: &quot;&quot;,
//         surname: &quot;&quot;,
//         email: &quot;&quot;,
//         subject: &quot;&quot;,
//         message: &quot;&quot;,
//         wage: &quot;&quot;,
//         currency: &quot;NGN&quot;,
//         resume: null,
//       });
//       if (fileInputRef.current) fileInputRef.current.value = &quot;&quot;;
//     } catch (error) {
//       console.error(&quot;Submission error:&quot;, error);
//       setSubmitStatus(&quot;error&quot;);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="mt-[22%] sm:mt-[9%]&quot;>
//       <Head>
//         <title>Course Page</title>
//         <meta
//           name=&quot;description&quot;
//           content=&quot;Welcome to the Catering and Hotel Management Course&quot;
//         />
//       </Head>

//       <section className=&quot;relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700&quot;>
//         <div className=&quot;max-w-7xl mx-auto&quot;>
//           <div className=&quot;grid lg:grid-cols-2 gap-12 items-center&quot;>
//             <div className=&quot;text-white&quot;>
//               <h1 className=&quot;text-4xl sm:text-5xl font-bold mb-6&quot;>
//                 Tech Instructor
//               </h1>
//               <p className=&quot;text-xl mb-8&quot;>
//                 Join Techxos Learning Management System and reach thousands of
//                 eager learners by sharing your expertise through engaging online
//                 courses and classroom lectures. Our platform provides seamless
//                 course creation tools, AI-powered assistance, and a growing
//                 community to help you succeed. Sign up today or easily apply
//                 below and start earning while empowering the next generation of
//                 professionals!
//               </p>
//             </div>
//             <div className=&quot;relative h-96 rounded-2xl overflow-hidden shadow-xl&quot;>
//               <Image
//                 src=&quot;https://images.pexels.com/photos/1181370/pexels-photo-1181370.jpeg?auto=compress&cs=tinysrgb&w=600&quot;
//                 alt=&quot;Team Collaboration&quot;
//                 fill
//                 className=&quot;object-cover&quot;
//                 priority
//                 sizes=&quot;(max-width: 768px) 100vw, 50vw&quot;
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className=&quot;container mx-auto p-4 mt-4 flex flex-col md:flex-row gap-8&quot;>
//         <div className=&quot;flex-1&quot;>
//           <h1 className=&quot;text-4xl text-[#003E8F] font-bold mb-2&quot;>
//             Join Techxos
//           </h1>
//           <p className=&quot;text-lg&quot;>
//             Earn While You Teach – Monetize your knowledge by reaching a wide
//             audience of learners on Techxos LMS, with flexible earning
//             opportunities and no upfront costs. One option is to lecture
//             in-person at our office location.
//           </p>
//           <br />
//           <p className=&quot;text-lg mb-6&quot;>
//             You can also create a course video and upload it here and earn as
//             users purchase the course. In the Instructor page, you can also see
//             your dashboard and a wallet to track your earnings. Start with
//             submitting a job application here.
//           </p>
//           <Link
//             href=&quot;https://wa.me/2348167715107&quot;
//             className=&quot;text-white font-bold mt-6 bg-[green] p-4 rounded hover:text-[green] hover:bg-white hover:border hover:border-green-700 transition duration-500&quot;
//           >
//             Contact a Course Advisor
//           </Link>
//         </div>

//         <div
//           id=&quot;contact&quot;
//           className=&quot;flex-1 text-black bg-gray-100 p-6 rounded-lg shadow-md&quot;
//         >
//           <h1 className=&quot;text-2xl font-bold mb-4&quot;>
//             Submit your Instructor Application
//           </h1>
//           <form onSubmit={handleSubmit}>
//             <div className=&quot;mb-4&quot;>
//               <label className=&quot;block text-sm font-medium mb-1&quot;>
//                 Course Title:
//               </label>
//               <input
//                 type=&quot;text&quot;
//                 value={formData.courseTitle}
//                 readOnly
//                 className=&quot;w-full p-2 border font-bold text-2xl rounded bg-gray-200&quot;
//               />
//             </div>
//             <div className=&quot;mb-4&quot;>
//               <label className=&quot;block text-sm font-medium mb-1&quot;>Name*</label>
//               <input
//                 type=&quot;text&quot;
//                 name=&quot;name&quot;
//                 required
//                 value={formData.name}
//                 onChange={handleChange}
//                 className=&quot;w-full p-2 border rounded outline-none&quot;
//               />
//             </div>
//             <div className=&quot;mb-4&quot;>
//               <label className=&quot;block text-sm font-medium mb-1&quot;>Surname*</label>
//               <input
//                 type=&quot;text&quot;
//                 name=&quot;surname&quot;
//                 required
//                 value={formData.surname}
//                 onChange={handleChange}
//                 className=&quot;w-full p-2 border rounded outline-none&quot;
//               />
//             </div>
//             <div className=&quot;mb-4&quot;>
//               <label className=&quot;block text-sm font-medium mb-1&quot;>Email*</label>
//               <input
//                 type=&quot;email&quot;
//                 name=&quot;email&quot;
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className=&quot;w-full p-2 border rounded outline-none&quot;
//               />
//             </div>
//             <div className=&quot;mb-4&quot;>
//               <label className=&quot;block text-sm font-medium mb-1&quot;>
//                 Course Title*
//               </label>
//               <select
//                 name=&quot;subject&quot;
//                 required
//                 value={formData.subject}
//                 onChange={handleChange}
//                 className=&quot;max-sm:w-[55%] xl:w-full p-2 border rounded outline-none&quot;
//               >
//                 <option value=&quot;">Select a course</option>
//                 <option value="Frontend Development&quot;>Frontend Development</option>
//                 <option value=&quot;Fullstack Development&quot;>Fullstack Development</option>
//                 <option value=&quot;Cybersecurity&quot;>Cybersecurity</option>
//                 <option value=&quot;UI/UX&quot;>UI/UX</option>
//                 <option value=&quot;Data Science&quot;>Data Science</option>
//                 <option value=&quot;Artificial Intelligence&quot;>Artificial Intelligence</option>
//                 <option value=&quot;Software Development&quot;>Software Development</option>
//                 <option value=&quot;Other&quot;>Other</option>
//               </select>
//             </div>
//             <div className=&quot;mb-4&quot;>
//               <label className=&quot;block text-sm font-medium mb-1&quot;>
//                 Your Min. Wage Rate/Hr ({formData.currency})*
//               </label>
//               <div className=&quot;flex items-center&quot;>
//                 <NumericFormat
//                   thousandSeparator={true}
//                   prefix={formData.currency === &quot;NGN&quot; ? &quot;₦" : &quot;$&quot;}
//                   name=&quot;wage&quot;
//                   required
//                   value={formData.wage}
//                   onValueChange={handleWageChange}
//                   className=&quot;w-full p-2 border rounded outline-none&quot;
//                   placeholder=&quot;Be competitive (click end button for NGN or USD)&quot;
//                 />
//                 <button
//                   type=&quot;button&quot;
//                   onClick={handleCurrencyToggle}
//                   className={`ml-2 p-2 border rounded ${
//                     formData.currency === &quot;NGN&quot;
//                       ? &quot;bg-green-600 text-white&quot;
//                       : &quot;bg-blue-600 text-white&quot;
//                   }`}
//                 >
//                   {formData.currency}
//                 </button>
//               </div>
//             </div>
//             <div className="mb-4&quot;>
//               <label className=&quot;block text-sm font-medium mb-1&quot;>Message*</label>
//               <textarea
//                 name=&quot;message&quot;
//                 required
//                 value={formData.message}
//                 onChange={handleChange}
//                 className=&quot;w-full p-2 border rounded&quot;
//                 rows={4}
//                 placeholder=&quot;Easily paste a Cover Letter or briefly state why you are the best fit for this job.&quot;
//               ></textarea>
//             </div>
//             <div className=&quot;mb-4&quot;>
//               <label className=&quot;block text-sm font-medium mb-1&quot;>
//                 Upload your Resume*
//               </label>
//               <input
//                 type=&quot;file&quot;
//                 name=&quot;resume&quot;
//                 required
//                 onChange={handleChange}
//                 className=&quot;w-full p-2 border rounded&quot;
//                 ref={fileInputRef}
//               />
//             </div>
//             <button
//               type=&quot;submit&quot;
//               disabled={isSubmitting}
//               className=&quot;w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300&quot;
//             >
//               {isSubmitting ? &quot;Submitting...&quot; : &quot;Submit&quot;}
//             </button>
//             {submitStatus === &quot;success&quot; && (
//               <div className=&quot;mt-4 flex items-center text-green-600&quot;>
//                 <FaCheckCircle className=&quot;mr-2&quot; size={24} />
//                 <p className=&quot;font-bold&quot;>Application submitted successfully!</p>
//               </div>
//             )}
//             {submitStatus === &quot;error&quot; && (
//               <p className=&quot;mt-4 text-red-600">
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