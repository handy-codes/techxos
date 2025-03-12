'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useUser } from "@clerk/nextjs";

const images = [
  'https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/5198239/pexels-photo-5198239.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/6000134/pexels-photo-6000134.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://media.istockphoto.com/id/1494104649/photo/ai-chatbot-artificial-intelligence-digital-concept.jpg?b=1&s=612x612&w=0&k=20&c=cUerJsSIULTLDjcXXP8asl1Wd9AOTvIcEI4l0IMeC9M=',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfXeljsQQ9ezIVI7ekGLthBUBdxZ9ZmKkQFA&s',
  'data:image/jpeg;base64,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',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZkblLRdtnPvuCcAeM_CUZcpWhxqGAjuzwag&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF-4cK7qw8-AroSfhE44AvDOvA-cyFM5p9ww&s',
  'https://images.pexels.com/photos/19281788/pexels-photo-19281788/free-photo-of-man-holding-mortarboard.jpeg?auto=compress&cs=tinysrgb&w=600',
];

const texts = [
  { h2: 'Discover Coding', h1: 'FRONTEND DEVELOPMENT', h2Sub: 'Develop a website that people will love' },
  { h2: 'Reinforce your Frontend Skills', h1: 'FULLSTACK DEVELOPMENT', h2Sub: 'Master Servers, API calls, Databases' },
  { h2: 'Data is life', h1: 'DATA SCIENCE', h2Sub: 'Analyse data like a Pro' },
  { h2: 'Technology of the Future', h1: 'ARTIFICIAL INTELLIGENCE', h2Sub: 'Train your AI Model with Dataset and Machine Learning'},
  { h2: 'Power of Creativity', h1: 'SOFTWARE DEVELOPMENT', h2Sub: 'Develop and monetize disruptive software solutions'},
  { h2: 'Take your client to a global audience', h1: 'DIGITAL MARKETING', h2Sub: '...From SEO to Social Media Marketing ' },
  { h2: 'For love of Beauty', h1: 'UI/UX DESIGN', h2Sub: 'Create engaging and user-friendly interfaces' },
  { h2: 'The world is on red alert', h1: 'CYBERSECURITY', h2Sub: 'Lead the war against cyber attacks' },
  { h2: 'Become an all-rounded Graduate', h1: 'DIGITAL SKILLS', h2Sub: 'Complement your Degree with a Digital Skill' },
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
                  href="/"
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