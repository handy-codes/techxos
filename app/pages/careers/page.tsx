"use client";
import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

export default function Page() {
  const [formData, setFormData] = useState({
    courseTitle: 'Catering School (CSH)',
    name: '',
    surname: '',
    email: '',
    subject: '',
    message: '',
    resume: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;
    
    if (name === 'resume' && files && files.length > 0) {
      setFormData(prev => ({ ...prev, resume: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formDataToSend = new FormData();
    formDataToSend.append('courseTitle', formData.courseTitle);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('surname', formData.surname);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('message', formData.message);
    if (formData.resume) {
      formDataToSend.append('resume', formData.resume);
    }

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitStatus('success');
      setFormData({
        courseTitle: 'Catering School (CSH)',
        name: '',
        surname: '',
        email: '',
        subject: '',
        message: '',
        resume: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className = "mt-[22%] sm:mt-[9%]">
      <Head>
        <title>Course Page</title>
        <meta name="description" content="Welcome to the Catering and Hotel Management Course" />
      </Head>

      <div className="w-[100vw] h-[250px] relative">
        <Image
          src="https://media.istockphoto.com/id/1389857295/photo/african-american-woman-bakers-looking-at-camera-chef-baker-in-a-chef-dress-and-hat-cooking.jpg?s=612x612&w=0&k=20&c=a6DaEjGakfhEykibC5LA1eknE7752wpQQdUUt9VjhRc="
          layout="fill"
          className="object-cover"
          alt="pix"
        />
      </div>

      <div className="container mx-auto p-4 mt-4 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">Catering School (CSH)</h1>
          <p className="text-lg">
            This is the ideal next-generation course for learning catering and hotel management.
          </p>
          <p className="text-lg mb-6">
            Lorem ipsum dolor sit amet, quibusdam necessitatibus. Vitae commodi eum cum at nostrum non.
          </p>
          <Link
            href="https://wa.me/2348167715107"
            className="text-white font-bold mt-6 bg-[green] p-4 rounded hover:text-[green] hover:bg-white hover:border hover:border-green-700 transition duration-500"
          >
            Contact the Course Advisor
          </Link>
        </div>

        <div id="contact" className="flex-1 text-black bg-gray-100 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Contact Us for More Enquiry</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Course Title:</label>
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
                placeholder="Cover Letter or briefly state why you are the best fit for this job."
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Upload your Resume*</label>
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
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            {submitStatus === 'success' && (
              <div className="mt-4 flex items-center text-green-600">
                <FaCheckCircle className="mr-2" size={24} />
                <p className="font-bold">Application submitted successfully!</p>
              </div>
            )}
            {submitStatus === 'error' && (
              <p className="mt-4 text-red-600">Failed to submit the form. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}