import React from &apos;react&apos;;
import { Swiper, SwiperSlide } from &apos;swiper/react&apos;;
import &apos;swiper/css&apos;;
import &apos;swiper/css/autoplay&apos;;
import { Autoplay } from &apos;swiper/modules&apos;;
import Image from &apos;next/image&apos;;

interface Testimonial {
  name: string;
  image: string;
  feedback: string;
}

export default function Home() {
  const testimonials: Testimonial[] = [
    {
      name: &quot;John Doe&quot;,
      image: &quot;/owo.jpg&quot;,
      feedback: &quot;This LMS platform transformed our learning process!&quot;,
    },
    {
      name: &quot;Jane Smith&quot;,
      image: &quot;/owo.jpg&quot;,
      feedback: &quot;An intuitive platform with fantastic features. Highly recommended!&quot;,
    },
    {
      name: &quot;Chris Johnson&quot;,
      image: &quot;/owo.jpg&quot;,
      feedback: &quot;The best LMS experience we have had in years. Easy and scalable.&quot;,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50&quot;>
      {/* Hero Section */}
      <header className=&quot;bg-gradient-to-r from-blue-500 to-purple-600 text-white&quot;>
        <div className=&quot;container mx-auto px-6 py-12 text-center&quot;>
          <h1 className=&quot;text-4xl md:text-6xl font-bold&quot;>
            Welcome to EduNext LMS
          </h1>
          <p className=&quot;mt-4 text-lg md:text-xl&quot;>
            A modern learning management system designed for seamless education.
          </p>
          <button className=&quot;mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100&quot;>
            Get Started
          </button>
        </div>
      </header>

      {/* Testimonial Section */}
      <section className=&quot;container mx-auto px-6 py-16&quot;>
        <h2 className=&quot;text-3xl md:text-4xl font-bold text-center mb-8&quot;>
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
          className=&quot;pb-8&quot;
        >
          {testimonials.map((testimonial: Testimonial, index: number) => (
            <SwiperSlide key={index}>
              <div className=&quot;p-6 bg-white rounded-lg shadow-lg&quot;>
                <div className=&quot;flex items-center space-x-4 mb-4&quot;>
                  <Image
                    src={testimonial.image}
                    width={32} height={32}
                    alt={testimonial.name}
                    className=&quot;w-8 h-8 rounded-full&quot;
                  />
                  <span className=&quot;font-semibold&quot;>{testimonial.name}</span>
                </div>
                <p className=&quot;text-gray-700">{testimonial.feedback}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}
