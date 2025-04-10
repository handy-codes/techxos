'use client';

import { motion, AnimatePresence } from &quot;framer-motion&quot;;
import { useState, useEffect, useRef, useCallback } from &quot;react&quot;;
import Image from &quot;next/image&quot;;
import { FaLinkedin } from &quot;react-icons/fa&quot;;
import Link from &quot;next/link&quot;;

interface Testimonial {
  name: string;
  role: string;
  roleLink?: string;
  text: string;
  image: string;
  linkedin?: string;
}

const testimonials: Testimonial[] = [
  {
    name: &quot;Jonadab Arueya&quot;,
    role: &quot;CEO Wahalanodey  Travels&quot;,
    roleLink: &quot;https://www.wahalanodey.com&quot;,
    text: &quot;Flexible learning at Techxos is next to none. Every busy professional has got a space.&quot;,
    image: &quot;/wandyboss2.jpg&quot;,
    // linkedin: &quot;https://www.linkedin.com/in/jonadab-arueya-74b81a2a&quot;,
  },
  {
    name: &quot;Emeka Owo&quot;,
    role: &quot;CTO at Techxos&quot;,
    roleLink: &quot;https://www.techxos.com&quot;,
    text: &quot;We envioned a one-stop shop for learning in-demand Tech skills. Techxos just broke the jinx.&quot;,
    image: &quot;/owo-blow.jpg&quot;,
    linkedin: &quot;https://www.linkedin.com/in/emeka-owo&quot;,
  },
  {
    name: &quot;Chika Daniels&quot;,
    role: &quot;Intern at NextGen&quot;,
    text: &quot;Learning new skills at Techxos is a breeze. I am currently on an Industrial Training as a Fullstack Developer.&quot;,
    image:
      &quot;https://images.pexels.com/photos/1757281/pexels-photo-1757281.jpeg?auto=compress&cs=tinysrgb&w=600&quot;,
    // linkedin: &quot;https://www.linkedin.com/in/chioma-ukaegbu-54290a20b&quot;,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<&quot;left&quot; | "right&quot;>(&quot;right&quot;);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setDirection(&quot;right&quot;);
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

  const navigate = useCallback((dir: &quot;left&quot; | &quot;right&quot;) => {
    setDirection(dir);
    setCurrentIndex((prev) => {
      let newIndex;
      if (dir === &quot;right&quot;) {
        newIndex = (prev + 1) % testimonials.length;
      } else {
        newIndex = (prev - 1 + testimonials.length) % testimonials.length;
      }
      return newIndex;
    });
  }, []);

  const testimonialVariants = {
    hidden: (direction: &quot;left&quot; | &quot;right&quot;) => ({
      opacity: 0,
      x: direction === &quot;right&quot; ? 100 : -100,
      scale: 0.95,
    }),
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: &quot;easeInOut&quot; },
    },
    exit: (direction: &quot;left&quot; | &quot;right&quot;) => ({
      opacity: 0,
      x: direction === &quot;right&quot; ? -100 : 100,
      scale: 0.95,
      transition: { duration: 0.6, ease: &quot;easeInOut&quot; },
    }),
  };

  return (
    <div className=&quot;px-4 md:px-10 py-4 bg-[#FCFCFC]&quot;>
      <section className=&quot;relative pt-6 rounded-3xl bg-slate-900 text-gray-100 my-12&quot;>
        <div className=&quot;container px-4 mx-auto&quot;>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: &quot;-100px&quot; }}
            className=&quot;max-w-5xl mx-auto text-center mb-8&quot;
          >
            <h2 className=&quot;text-4xl md:text-5xl font-bold mb-4 text-[#47D1FD]&quot;>
            {/* <h2 className=&quot;text-4xl md:text-5xl font-bold mb-4 text-[orange]&quot;> */}
              From Us, Clients and Students
            </h2>
          </motion.div>

          <div className=&quot;relative group pb-2 my-1&quot;>
            <div className=&quot;relative overflow-hidden min-h-[400px]&quot;>
              <AnimatePresence mode=&quot;wait&quot; custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={testimonialVariants}
                  initial=&quot;hidden&quot;
                  animate=&quot;visible&quot;
                  exit=&quot;exit&quot;
                  className=&quot;max-w-3xl mx-auto&quot;
                >
                  <div
                    className=&quot;bg-slate-800 p-8 rounded-2xl shadow-2xl relative hover:shadow-3xl transition-shadow duration-300&quot;
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    <div className=&quot;relative w-16 h-16 -mt-8 mb-4 mx-auto rounded-full overflow-hidden border-4 border-[#CED1E4]&quot;>
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        width={64}
                        height={64}
                        className=&quot;object-cover&quot;
                        priority
                      />
                    </div>

                    <div className=&quot;mb-4&quot;>
                      <svg
                        className=&quot;w-8 h-8 text-blue-400&quot;
                        viewBox=&quot;0 0 24 24&quot;
                        fill=&quot;currentColor&quot;
                      >
                        <path d=&quot;M8.46498 17.535C6.51398 16.584 5.19922 14.933 4.52071 12.582C3.84219 10.231 4.05342 8.14795 5.15441 6.33301C6.25539 4.51807 8.1518 3.67139 10.8436 3.79298L11.043 5.78805C9.3245 5.70122 7.92677 6.23747 6.84978 7.39679C5.77279 8.55611 5.35845 10.113 5.60675 12.067C5.85506 14.021 6.6662 15.447 8.04018 16.345L8.46498 17.535ZM18.586 17.535C16.635 16.584 15.3202 14.933 14.6417 12.582C13.9632 10.231 14.1744 8.14795 15.2754 6.33301C16.3764 4.51807 18.2728 3.67139 20.9646 3.79298L21.164 5.78805C19.4455 5.70122 18.0478 6.23747 16.9708 7.39679C15.8938 8.55611 15.4795 10.113 15.7278 12.067C15.9761 14.021 16.7872 15.447 18.1612 16.345L18.586 17.535Z&quot; />
                      </svg>
                    </div>

                    <p className=&quot;text-gray-300 text-lg mb-6&quot;>
                      {testimonials[currentIndex].text}
                    </p>

                    <div>
                      <h3 className=&quot;font-bold text-xl&quot;>
                        {testimonials[currentIndex].name}
                      </h3>
                      <div className=&quot;flex items-center gap-2 mt-1&quot;>
                        <p className=&quot;text-[#47D1FD] text-sm&quot;>
                          {testimonials[currentIndex].role.split(&quot; ").map(
                            (word: string, index: number) => {
                              let link = null;
                              if (
                                testimonials[currentIndex].name ===
                                  &quot;Jonadab Arueya&quot; &&
                                word === &quot;Wahalanodey&quot;
                              ) {
                                link = (
                                  <Link
                                    key={index}
                                    href={
                                      testimonials[currentIndex].roleLink || &quot;#&quot;
                                    }
                                    target=&quot;_blank&quot;
                                    rel=&quot;noopener noreferrer&quot;
                                    className=&quot;text-blue-400 underline&quot;
                                  >
                                    Wahalanodey
                                  </Link>
                                );
                              } else if (
                                testimonials[currentIndex].name === &quot;Emeka Owo&quot; &&
                                word === &quot;Techxos&quot;
                              ) {
                                link = (
                                  <Link
                                    key={index}
                                    href={
                                      testimonials[currentIndex].roleLink || &quot;#&quot;
                                    }
                                    target=&quot;_blank&quot;
                                    rel=&quot;noopener noreferrer&quot;
                                    className=&quot;text-blue-400 underline&quot;
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
                          href={testimonials[currentIndex].linkedin || &quot;#&quot;}
                            target=&quot;_blank&quot;
                            rel=&quot;noopener noreferrer&quot;
                            className=&quot;text-blue-400 text-sm flex items-center&quot;
                          >
                            <FaLinkedin className=&quot;mr-1 text-[18px] text-[#47D1FD]&quot; />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Navigation Controls */}
            <div className="flex justify-center gap-2 mt-1&quot;>
              <button
                onClick={() => navigate(&quot;left&quot;)}
                className=&quot;p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors&quot;
                aria-label=&quot;Previous Testimonial&quot;
              >
                <svg
                  className=&quot;w-6 h-6&quot;
                  fill=&quot;none&quot;
                  stroke=&quot;currentColor&quot;
                  viewBox=&quot;0 0 24 24&quot;
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap=&quot;round&quot;
                    strokeLinejoin=&quot;round&quot;
                    d=&quot;M15 19l-7-7 7-7&quot;
                  />
                </svg>
              </button>

              <div className=&quot;flex items-center gap-1&quot;>
                {testimonials.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      const newDirection =
                        idx > currentIndex ? &quot;right&quot; : &quot;left&quot;;
                      setDirection(newDirection);
                      setCurrentIndex(idx);
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentIndex === idx ? &quot;bg-[orange]&quot; : &quot;bg-slate-600&quot;
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    animate={{ scale: currentIndex === idx ? 1.2 : 1 }}
                    transition={{ type: &quot;spring&quot;, stiffness: 500 }}
                  />
                ))}
              </div>

              <button
                onClick={() => navigate(&quot;right&quot;)}
                className=&quot;p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors&quot;
                aria-label=&quot;Next Testimonial&quot;
              >
                <svg
                  className=&quot;w-6 h-6&quot;
                  fill=&quot;none&quot;
                  stroke=&quot;currentColor&quot;
                  viewBox=&quot;0 0 24 24&quot;
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap=&quot;round&quot;
                    strokeLinejoin=&quot;round&quot;
                    d=&quot;M9 5l7 7-7 7"
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