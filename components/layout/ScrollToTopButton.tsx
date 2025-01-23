'use client';

import React, { useState, useEffect } from 'react';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
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

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-20 right-6 bg-[red] text-white p-4 w-16 h-16 rounded-full shadow-lg transition-opacity duration-300 flex items-center justify-center ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ fontSize: '32px' }}
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;