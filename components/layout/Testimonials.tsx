'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";

const testimonials = [
  {
    name: "Jonadab Arueya",
    role: "CEO Wahalanodey  Travels",
    roleLink: "https://www.wahalanodey.com",
    text: "Flexible learning at Techxos is next to none. Every busy professional like me has got a space.",
    image: "/wandyboss2.jpg",
    // linkedin: "https://www.linkedin.com/in/jonadab-arueya-74b81a2a",
  },
  {
    name: "Emeka Owo",
    role: "CTO at Techxos",
    roleLink: "https://www.techxos.com",
    text: "We envioned a one-stop shop for learning in-demand Tech skills. Techxos just broke the jinx.",
    image: "/owo-blow.jpg",
    linkedin: "https://www.linkedin.com/in/emeka-owo",
  },
  {
    name: "Chika Daniels",
    role: "Intern at NextGen",
    text: "Learning new skills at Techxos is a brease. I am currently on an Industrial Training as a Fullstack Developer.",
    image:
      "https://images.pexels.com/photos/1757281/pexels-photo-1757281.jpeg?auto=compress&cs=tinysrgb&w=600",
    // linkedin: "https://www.linkedin.com/in/chioma-ukaegbu-54290a20b",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setDirection("right");
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }
    }, 8000);
  }, [isPaused]);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  const navigate = useCallback((dir: "left" | "right") => {
    setDirection(dir);
    setCurrentIndex((prev) => {
      let newIndex;
      if (dir === "right") {
        newIndex = (prev + 1) % testimonials.length;
      } else {
        newIndex = (prev - 1 + testimonials.length) % testimonials.length;
      }
      return newIndex;
    });
  }, []);

  const testimonialVariants = {
    hidden: (direction: "left" | "right") => ({
      opacity: 0,
      x: direction === "right" ? 100 : -100,
      scale: 0.95,
    }),
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: (direction: "left" | "right") => ({
      opacity: 0,
      x: direction === "right" ? -100 : 100,
      scale: 0.95,
      transition: { duration: 0.6, ease: "easeInOut" },
    }),
  };

  return (
    <div className="px-4 md:px-10 py-4 bg-[#FCFCFC]">
      <section className="relative pt-6 rounded-3xl bg-slate-900 text-gray-100 my-12">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-5xl mx-auto text-center mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#47D1FD]">
            {/* <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[orange]"> */}
              From Us, Clients and Students
            </h2>
          </motion.div>

          <div className="relative group pb-2 my-1">
            <div className="relative overflow-hidden min-h-[400px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={testimonialVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="max-w-3xl mx-auto"
                >
                  <div
                    className="bg-slate-800 p-8 rounded-2xl shadow-2xl relative hover:shadow-3xl transition-shadow duration-300"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    <div className="relative w-16 h-16 -mt-8 mb-4 mx-auto rounded-full overflow-hidden border-4 border-[#CED1E4]">
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        width={64}
                        height={64}
                        className="object-cover"
                        priority
                      />
                    </div>

                    <div className="mb-4">
                      <svg
                        className="w-8 h-8 text-blue-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8.46498 17.535C6.51398 16.584 5.19922 14.933 4.52071 12.582C3.84219 10.231 4.05342 8.14795 5.15441 6.33301C6.25539 4.51807 8.1518 3.67139 10.8436 3.79298L11.043 5.78805C9.3245 5.70122 7.92677 6.23747 6.84978 7.39679C5.77279 8.55611 5.35845 10.113 5.60675 12.067C5.85506 14.021 6.6662 15.447 8.04018 16.345L8.46498 17.535ZM18.586 17.535C16.635 16.584 15.3202 14.933 14.6417 12.582C13.9632 10.231 14.1744 8.14795 15.2754 6.33301C16.3764 4.51807 18.2728 3.67139 20.9646 3.79298L21.164 5.78805C19.4455 5.70122 18.0478 6.23747 16.9708 7.39679C15.8938 8.55611 15.4795 10.113 15.7278 12.067C15.9761 14.021 16.7872 15.447 18.1612 16.345L18.586 17.535Z" />
                      </svg>
                    </div>

                    <p className="text-gray-300 text-lg mb-6">
                      {testimonials[currentIndex].text}
                    </p>

                    <div>
                      <h3 className="font-bold text-xl">
                        {testimonials[currentIndex].name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[#47D1FD] text-sm">
                          {testimonials[currentIndex].role.split(" ").map(
                            (word, index) => {
                              let link = null;
                              if (
                                testimonials[currentIndex].name ===
                                  "Jonadab Arueya" &&
                                word === "Wahalanodey"
                              ) {
                                link = (
                                  <Link
                                    key={index}
                                    href={
                                      testimonials[currentIndex].roleLink || "#"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 underline"
                                  >
                                    Wahalanodey
                                  </Link>
                                );
                              } else if (
                                testimonials[currentIndex].name === "Emeka Owo" &&
                                word === "Techxos"
                              ) {
                                link = (
                                  <Link
                                    key={index}
                                    href={
                                      testimonials[currentIndex].roleLink || "#"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 underline"
                                  >
                                    Techxos
                                  </Link>
                                );
                              } else {
                                return <span key={index}>{word} </span>;
                              }
                              return link;
                            }
                          )}
                        </p>
                        {testimonials[currentIndex].linkedin && (
                          <Link
                          href={testimonials[currentIndex].linkedin || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 text-sm flex items-center"
                          >
                            <FaLinkedin className="mr-1 text-[18px] text-[#47D1FD]" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Navigation Controls */}
            <div className="flex justify-center gap-2 mt-1 md:-mt-[8%]">
              <button
                onClick={() => navigate("left")}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                aria-label="Previous Testimonial"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-1">
                {testimonials.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      const newDirection =
                        idx > currentIndex ? "right" : "left";
                      setDirection(newDirection);
                      setCurrentIndex(idx);
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentIndex === idx ? "bg-[orange]" : "bg-slate-600"
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    animate={{ scale: currentIndex === idx ? 1.2 : 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  />
                ))}
              </div>

              <button
                onClick={() => navigate("right")}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                aria-label="Next Testimonial"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}