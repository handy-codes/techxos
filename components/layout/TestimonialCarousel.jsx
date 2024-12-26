import Image from "next/image";
import React from "react";
import Slider from "react-slick";

const TestimonialData = [
  {
    id: 1,
    name: "Emeka",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2jsjKRVxAzzlyQecjT43OlGhYmM7jLHG3iA&s",
  },
  {
    id: 2,
    name: "Ada Abia",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "data:image/jpeg;base64,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",
  },
  {
    id: 3,
    name: "Clara",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTipYezBSsi9zvCJN6Nw83uru7WUgHaEJ8bnA&s",
  },
  {
    id: 4,
    name: "Tunde",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaiQiLILfSUphs8eWlzAVWJQMqDuTclb68mA&s",
  },
];

const Testimonials = () => {
  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="py-10 mb-10">
      <div className="container">
        {/* header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            What our customers are saying
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Testimonials
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit
            asperiores modi Sit asperiores modi
          </p>
        </div>

        {/* Testimonial cards */}
        <div data-aos="zoom-in">
          <Slider {...settings}>
            {TestimonialData.map((data) => (
              <div key={data.id} className="my-6">
                <div
                  
                  className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl dark:bg-gray-800 bg-primary/10 relative"
                >
                  <div className="mb-4">
                    <Image
                      src={data.img}
                      alt=""
                      className="rounded-full w-20 h-20"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500">{data.text}</p>
                      <h1 className="text-xl font-bold text-black/80 dark:text-light">
                        {data.name}
                      </h1>
                    </div>
                  </div>
                  <p className="text-black/20 text-9xl font-serif absolute top-0 right-0">
                    
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
