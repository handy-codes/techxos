"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Counter = ({ end, showPlus = true }: { end: number; showPlus?: boolean }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView();
  const animationRef = useRef<number | null>(null);
  const previousInView = useRef(false);

  useEffect(() => {
    if (inView) {
      setCount(0);
      const duration = 2000;
      const startTime = Date.now();

      const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentCount = Math.floor(progress * end);
        
        setCount(currentCount);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(updateCounter);
        }
      };

      animationRef.current = requestAnimationFrame(updateCounter);
    } else if (previousInView.current) {
      setCount(0);
    }

    previousInView.current = inView;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [inView, end]);

  return (
    <motion.span
      ref={ref}
      className="text-[#FCB80B] font-extrabold text-5xl sm:text-7xl font-mono inline-block min-h-[1.2em]"
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {count}
      {showPlus && "+"}
    </motion.span>
  );
};

export default function HeroSection() {
  return (
    <div
      className="relative w-full h-screen flex flex-col items-center justify-center text-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/5198239/pexels-photo-5198239.jpeg?auto=compress&cs=tinysrgb&w=600')",
        backgroundAttachment: "fixed",
        WebkitBackgroundSize: "cover",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        perspective: 1000,
        willChange: "transform",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 px-6 flex flex-col items-center justify-center w-full">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Empowering Many with Life Skills!
          </h1>
          <div className="w-full max-w-2xl mx-auto mb-8 md:mb-12 h-1 bg-[#F89928] rounded-full shadow-[0_0_15px_rgba(248,153,40,0.8)]"></div>
        </motion.div>

        <div className="text-white text-lg flex flex-col sm:flex-row justify-between items-baseline gap-8 md:text-2xl">
          {[
            { end: 400, label: "Happy Students" },
            { end: 350, label: "Women in Tech" },
            { end: 300, label: "Graduates", showPlus: false },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 py-4 min-w-[150px]">
              <div className="h-[72px] flex items-center justify-center">
                <Counter end={item.end} showPlus={item.showPlus} />
              </div>
              <p className="mt-2 text-balance text-center">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}