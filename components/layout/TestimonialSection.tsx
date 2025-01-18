import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';

export default function Home() {
  const testimonials = [
    {
      name: "John Doe",
      image: "/owo.jpg",
      feedback: "This LMS platform transformed our learning process!",
    },
    {
      name: "Jane Smith",
      image: "/owo.jpg",
      feedback: "An intuitive platform with fantastic features. Highly recommended!",
    },
    {
      name: "Chris Johnson",
      image: "/owo.jpg",
      feedback: "The best LMS experience we’ve had in years. Easy and scalable.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold">
            Welcome to EduNext LMS
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            A modern learning management system designed for seamless education.
          </p>
          <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100">
            Get Started
          </button>
        </div>
      </header>

      {/* Testimonial Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          What Our Users Say
        </h2>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          loop
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
          }}
          className="pb-8"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <Image
                    src={testimonial.image}
                    width={32} height={32}
                    alt={testimonial.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-semibold">{testimonial.name}</span>
                </div>
                <p className="text-gray-700">{testimonial.feedback}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}
