"use client";
import { MdOutlineMailOutline } from "react-icons/md";

import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaMobileAlt,
} from "react-icons/fa";
import { MdRoom } from "react-icons/md";

const BannerImg = {
  backgroundImage: `url('/footer-pattern.jpg')`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const FooterLinks = [
  {
    title: "HOME",
    link: "/",
  },
  {
    title: "ABOUT",
    link: "/about",
  },
  {
    title: "MY LEARNING",
    link: "/learning",
  },
  // {
  //   title: "Careers",
  //   link: "/#blog",
  // },
];

const FooterPage = () => {
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  const currentYear = new Date().getFullYear();
  return (
    <div
      style={BannerImg}
      className="text-white text-[17px] md:text-[15px] p-2 mb-0"
    >
      <div className="container">
        {/* <div data-aos="zoom-in" className="grid md:grid-cols-3 pb-44 pt-5"> */}
        <div
          data-aos="zoom-in"
          className="flex justify-between max-sm:flex-col flex-wrap pb-40 pt-5"
        >
          <div className="py-4">
            <div className="flex gap-5">
              {/* <Image className="rounded-full w-8 h-8 " src={'/footertechx.png'} width={24} height={24} alt="ghg"/> */}
              <h1 className="sm:text-4xl text-3xl font-bold sm:text-left mb-3 flex items-center gap-3">
                Techxos
              </h1>
            </div>
            <p className="text-[18px] md:text-[15px] text-bold text-[#E5A111]">
              Skill up - with every Ease!
            </p>
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <MdRoom className="text-[24px] md:text-[19px]" />
                <p>101 Lagos-Ikorodu Road, (WandyTechX Suites) Ikorodu Lagos</p>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <FaMobileAlt />
                <p>+2349123444391</p>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <MdOutlineMailOutline />
                <p>hello@techxos.com</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <div className="py-4">
                <ul>
                  {FooterLinks.map((item, index) => (
                    <li
                      key={index}
                      className="cursor-pointer mt-3 hover:text-[#E5A111] hover:translate-x-1 duration-300 text-[white]"
                    >
                      <Link href={item.link} legacyBehavior>
                        <a className="text-[14px]">{item.title}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-start items-center gap-3 mt-2">
              <p className="flex items-center text-[17px] md:text-[15px]">
                Follow us
                <span className="inline-block h-8 ml-3 w-px bg-current"></span>
              </p>
              <a
                href="https://www.instagram.com/techxosoffical"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-300 ease-in-out transform hover:bg-red-500 hover:text-white p-1 rounded-full"
              >
                <FaInstagram className="text-[23px]" />
              </a>
              <a
                href="https://web.facebook.com/profile.php?id=61572481057148"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-300 ease-in-out transform hover:bg-red-500 hover:text-white p-1 rounded-full"
              >
                <FaFacebook className="text-[23px]" />
              </a>
              <a
                href="https://www.linkedin.com/company/techxos-digital-products"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-300 ease-in-out transform hover:bg-red-500 hover:text-white p-1 rounded-full"
              >
                <FaLinkedin className="text-[23px]" />
              </a>
            </div>
            <div className="bg-[white] w-full h-[2px]"></div>
          </div>
          <div className="">
            <p className="text-[13px] mt-6 text-white">
              &copy; {currentYear} Techxos All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterPage;
