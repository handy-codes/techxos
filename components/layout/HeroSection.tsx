"use client&quot;;

import { useEffect, useState, useRef } from &quot;react&quot;;
import { motion } from &quot;framer-motion&quot;;
import { useInView } from &quot;react-intersection-observer&quot;;

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
      className=&quot;text-[#FCB80B] font-extrabold text-5xl sm:text-7xl font-mono inline-block min-h-[1.2em]&quot;
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{ fontVariantNumeric: &quot;tabular-nums&quot; }}
    >
      {count}
      {showPlus && &quot;+"}
    </motion.span>
  );
};

export default function HeroSection() {
  return (
    <div
      className=&quot;relative w-full h-screen flex flex-col items-center justify-center text-center bg-fixed bg-cover bg-center&quot;
      style={{
        backgroundImage:
          &quot;url(&apos;https://images.pexels.com/photos/5198239/pexels-photo-5198239.jpeg?auto=compress&cs=tinysrgb&w=600&apos;)&quot;,
      }}
    >
      <div className=&quot;absolute inset-0 bg-black bg-opacity-50&quot; />

      <div className="relative z-10 px-6 flex flex-col items-center justify-center w-full&quot;>
        <motion.div 
          className=&quot;flex flex-col items-center&quot;
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className=&quot;text-white text-4xl md:text-5xl font-bold mb-6 leading-tight&quot;>
            Empowering Many with Life Skills!
          </h1>
          <hr className=&quot;border-t-4 border-[#F89928] w-full max-w-2xl mx-auto mb-8 md:mb-12&quot; />
        </motion.div>

        <div className=&quot;text-white text-lg flex flex-col sm:flex-row justify-between items-baseline gap-8 md:text-2xl&quot;>
          {[
            { end: 400, label: &quot;Happy Students&quot; },
            { end: 350, label: &quot;Women in Tech&quot; },
            { end: 300, label: &quot;Graduates&quot;, showPlus: false },
          ].map((item, index) => (
            <div key={index} className=&quot;flex flex-col items-center flex-1 py-4 min-w-[150px]&quot;>
              <div className=&quot;h-[72px] flex items-center justify-center&quot;>
                <Counter end={item.end} showPlus={item.showPlus} />
              </div>
              <p className=&quot;mt-2 text-balance text-center">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}