'use client&apos;;

import Link from &apos;next/link&apos;;
import { useState, useEffect } from &apos;react&apos;;
import { FaArrowLeft, FaArrowRight } from &apos;react-icons/fa&apos;;
import { useUser } from &quot;@clerk/nextjs&quot;;

const images = [
  &apos;https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?auto=compress&cs=tinysrgb&w=600&apos;,
  &apos;https://images.pexels.com/photos/5198239/pexels-photo-5198239.jpeg?auto=compress&cs=tinysrgb&w=600&apos;,
  &apos;https://i.ibb.co/zhtsp6kS/Gemini-Generated-Image-wdp2kpwdp2kpwdp2.jpg&apos;,
  &apos;https://media.istockphoto.com/id/1494104649/photo/ai-chatbot-artificial-intelligence-digital-concept.jpg?b=1&s=612x612&w=0&k=20&c=cUerJsSIULTLDjcXXP8asl1Wd9AOTvIcEI4l0IMeC9M=&apos;,
  &apos;https://i.ibb.co/CfmfmQ8/Gemini-Generated-Image-s7ovczs7ovczs7ov.jpg&apos;,
  &apos;https://i.ibb.co/mr2DY1Cq/Gemini-Generated-Image-882bj9882bj9882b.jpg&apos;,
  &apos;https://i.ibb.co/xqN3xy1J/Gemini-Generated-Image-v5ipemv5ipemv5ip.jpg&apos;,
  &apos;https://i.ibb.co/20Z10Dhj/Gemini-Generated-Image-9k8ie09k8ie09k8i.jpg&apos;,
  &apos;https://images.pexels.com/photos/19281788/pexels-photo-19281788/free-photo-of-man-holding-mortarboard.jpeg?auto=compress&cs=tinysrgb&w=600&apos;,
];

const texts = [
  { h2: &apos;Discover Coding&apos;, h1: &apos;FRONTEND DEVELOPMENT&apos;, h2Sub: &apos;Develop a website that people will love&apos;, href: &apos;/pages/frontend&apos; },
  { h2: &apos;Reinforce your Frontend Skills&apos;, h1: &apos;FULLSTACK DEVELOPMENT&apos;, h2Sub: &apos;Master Servers, API calls, Databases&apos;, href: &apos;/pages/fullstack&apos;},
  { h2: &apos;Data is life&apos;, h1: &apos;DATA SCIENCE&apos;, h2Sub: &apos;Analyse data like a Pro&apos;, href: &apos;/pages/data-science&apos; },
  { h2: &apos;Technology of the Future&apos;, h1: &apos;ARTIFICIAL INTELLIGENCE&apos;, h2Sub: &apos;Train your AI Model with Dataset and Machine Learning&apos;, href: &apos;/ai-ml&apos; },
  { h2: &apos;Power of Creativity&apos;, h1: &apos;SOFTWARE DEVELOPMENT&apos;, h2Sub: &apos;Develop and monetize disruptive software solutions&apos;, href: &apos;/pages/software-devt&apos; },
  { h2: &apos;Take your client to a global audience&apos;, h1: &apos;DIGITAL MARKETING&apos;, h2Sub: &apos;...From SEO to Social Media Marketing &apos;, href: &apos;/pages/digital-marketing&apos; },
  { h2: &apos;For love of Beauty&apos;, h1: &apos;UI/UX DESIGN&apos;, h2Sub: &apos;Create engaging and user-friendly interfaces&apos;, href: &apos;/pages/ui-ux&apos; },
  { h2: &apos;The world is on red alert&apos;, h1: &apos;CYBERSECURITY&apos;, h2Sub: &apos;Lead the war against cyber attacks&apos;, href: &apos;/pages/cybersecurity&apos; },
  { h2: &apos;Become an all-rounded Graduate&apos;, h1: &apos;DIGITAL SKILLS&apos;, h2Sub: &apos;Complement your Degree with a Digital Skill&apos;, href: &apos;/about&apos; },
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
    <div className={`relative w-screen ${user ? &apos;h-screen&apos; : &apos;h-screen&apos;} overflow-hidden`}>
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? &apos;opacity-100&apos; : &apos;opacity-0&apos;
          }`}
          style={{ backgroundImage: `url(${img})`, backgroundSize: &apos;cover&apos;, backgroundPosition: &apos;center' }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50&quot;></div>
          {index === currentSlide && (
            <div className=&quot;flex flex-col items-center justify-center h-full text-white relative z-10&quot;>
              <div className=&quot;animate-slide-in-left space-y-2 text-center&quot;>
                <h2 className=&quot;text-3xl&quot;>{texts[currentSlide].h2}</h2>
                <h1 className=&quot;text-[40px] md:text-[80px] text-[orange] font-extrabold&quot;>{texts[currentSlide].h1}</h1>
                <h2 className=&quot;text-2xl px-5&quot;>{texts[currentSlide].h2Sub}</h2>
                <Link
                  href={texts[currentSlide].href}
                  className=&quot;inline-block mt-8 px-9 rounded-md py-3 font-bold bg-[#BF5800] text-[white] text-xl hover:bg-gray-500 hover:text-white transition-colors duration-300&quot;
                >
                  Explore
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className=&quot;absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 mt-6&quot;>
        <button
          onClick={goToPrevSlide}
          className=&quot;p-2 text-white hover:text-gray-300 transition-colors duration-300&quot;
        >
          <FaArrowLeft size={24} />
        </button>
        <button
          onClick={goToNextSlide}
          className=&quot;p-2 text-white hover:text-gray-300 transition-colors duration-300"
        >
          <FaArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}