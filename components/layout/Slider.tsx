'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useUser } from "@clerk/nextjs";

const images = [
  'https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/5198239/pexels-photo-5198239.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://i.ibb.co/zhtsp6kS/Gemini-Generated-Image-wdp2kpwdp2kpwdp2.jpg',
  'https://media.istockphoto.com/id/1494104649/photo/ai-chatbot-artificial-intelligence-digital-concept.jpg?b=1&s=612x612&w=0&k=20&c=cUerJsSIULTLDjcXXP8asl1Wd9AOTvIcEI4l0IMeC9M=',
  'https://i.ibb.co/CfmfmQ8/Gemini-Generated-Image-s7ovczs7ovczs7ov.jpg',
  'https://i.ibb.co/mr2DY1Cq/Gemini-Generated-Image-882bj9882bj9882b.jpg',
  'https://i.ibb.co/xqN3xy1J/Gemini-Generated-Image-v5ipemv5ipemv5ip.jpg',
  'https://i.ibb.co/20Z10Dhj/Gemini-Generated-Image-9k8ie09k8ie09k8i.jpg',
  'https://images.pexels.com/photos/19281788/pexels-photo-19281788/free-photo-of-man-holding-mortarboard.jpeg?auto=compress&cs=tinysrgb&w=600',
];

const texts = [
  { h2: 'Discover Coding', h1: 'FRONTEND DEVELOPMENT', h2Sub: 'Develop a website that people will love', href: '/pages/frontend' },
  { h2: 'Reinforce your Frontend Skills', h1: 'FULLSTACK DEVELOPMENT', h2Sub: 'Master Servers, API calls, Databases', href: '/pages/fullstack'},
  { h2: 'Data is life', h1: 'DATA SCIENCE', h2Sub: 'Analyse data like a Pro', href: '/pages/data-science' },
  { h2: 'Technology of the Future', h1: 'ARTIFICIAL INTELLIGENCE', h2Sub: 'Train your AI Model with Dataset and Machine Learning', href: '/ai-ml' },
  { h2: 'Power of Creativity', h1: 'SOFTWARE DEVELOPMENT', h2Sub: 'Develop and monetize disruptive software solutions', href: '/pages/software-devt' },
  { h2: 'Take your client to a global audience', h1: 'DIGITAL MARKETING', h2Sub: '...From SEO to Social Media Marketing ', href: '/pages/digital-marketing' },
  { h2: 'For love of Beauty', h1: 'UI/UX DESIGN', h2Sub: 'Create engaging and user-friendly interfaces', href: '/pages/ui-ux' },
  { h2: 'The world is on red alert', h1: 'CYBERSECURITY', h2Sub: 'Lead the war against cyber attacks', href: '/pages/cybersecurity' },
  { h2: 'Become an all-rounded Graduate', h1: 'DIGITAL SKILLS', h2Sub: 'Complement your Degree with a Digital Skill', href: '/about' },
];
export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useUser();  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative w-screen ${user ? 'h-[70vh]' : 'h-screen'} overflow-hidden`}>
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          {index === currentSlide && (
            <div className="flex flex-col items-center justify-center h-full text-white relative z-10">
              <div className="animate-slide-in-left space-y-2 text-center">
                <h2 className="text-3xl">{texts[currentSlide].h2}</h2>
                <h1 className="text-[40px] md:text-[80px] text-[orange] font-extrabold">{texts[currentSlide].h1}</h1>
                <h2 className="text-2xl px-5">{texts[currentSlide].h2Sub}</h2>
                <Link
                  href={texts[currentSlide].href}
                  className="inline-block mt-8 px-9 rounded-md py-3 font-bold bg-[#BF5800] text-[white] text-xl hover:bg-gray-500 hover:text-white transition-colors duration-300"
                >
                  Explore
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 mt-6">
        <button
          onClick={goToPrevSlide}
          className="p-2 text-white hover:text-gray-300 transition-colors duration-300"
        >
          <FaArrowLeft size={24} />
        </button>
        <button
          onClick={goToNextSlide}
          className="p-2 text-white hover:text-gray-300 transition-colors duration-300"
        >
          <FaArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}