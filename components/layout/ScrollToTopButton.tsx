"use client";

import React, { useState, useEffect } from "react";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-20 right-4 bg-red-500 text-white p-2 md:p-4 w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg transition-opacity duration-300 flex items-center justify-center ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="text-2xl md:text-4xl">↑</span>
    </button>
  );
};

export default ScrollToTopButton;
