"use client&quot;;

import React, { useState, useEffect } from &quot;react&quot;;

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: &quot;smooth&quot;,
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && window.scrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener(&quot;scroll&quot;, handleScroll);
    return () => {
      window.removeEventListener(&quot;scroll&quot;, handleScroll);
    };
  }, [lastScrollY]);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-20 right-4 bg-[red] text-white p-2 md:p-4 w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg transition-opacity duration-300 flex items-center justify-center ${
        isVisible ? &quot;opacity-100 animate-oscillate&quot; : &quot;opacity-0&quot;
      }`}
    >
      <span className=&quot;text-2xl md:text-4xl">↑</span>
    </button>
  );
};

export default ScrollToTopButton;
