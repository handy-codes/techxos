// components/layout/WandyCarousel.tsx
'use client';

import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRef } from 'react';

const WandyCarousel = () => {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <ul className="flex space-x-3">{dots}</ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div className="w-3 h-3 rounded-full bg-white/30 hover:bg-yellow-400 transition-colors cursor-pointer" />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: true
        }
      }
    ]
  };

  const images = [
    { id: 1, src: '/grad5.jpg', alt: 'Destination 1' },
    { id: 2, src: '/grad1.jpg', alt: 'Destination 2' },
    { id: 3, src: '/grad3.jpg', alt: 'Destination 3' },
    { id: 4, src: '/grad4.jpg', alt: 'Destination 4' },
  ];

  return (
    <>
      <style jsx global>{`
        /* Remove gaps between slides */
        .slick-slide {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .slick-list {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden;
        }
        
        /* Style the dots */
        .slick-dots {
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex !important;
          justify-content: center !important;
          width: 100% !important;
        }
        
        .slick-dots li button:before {
          color: rgba(255, 255, 255, 0.5) !important;
          font-size: 12px !important;
        }
        
        .slick-dots li.slick-active button:before {
          color: #fbbf24 !important;
        }
        
        /* Ensure the slider takes full width */
        .slick-slider {
          width: 100%;
        }
      `}</style>
      <section className="py-6 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-4xl text-black font-bold max-w-2xl mx-auto">
              Upskill with every ease!
            </p>
          </div>
          
          <div className="relative h-[100vh] w-full overflow-hidden rounded-xl shadow-xl">
            <Slider {...settings} ref={sliderRef} className="h-full">
              {images.map((image) => (
                <div key={image.id} className="relative h-[100vh]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={image.src}
                      sizes="100vw"
                      priority={image.id === 1}
                    />
                  </div>
                </div>
              ))}
            </Slider>

            {/* Custom Arrows */}
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="absolute top-1/2 left-4 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-colors z-10"
              aria-label="Previous slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="absolute top-1/2 right-4 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-colors z-10"
              aria-label="Next slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default WandyCarousel;