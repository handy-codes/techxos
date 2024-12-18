'use client'
import { MdOutlineMailOutline } from "react-icons/md";

import React from "react";
import AOS from "aos"
import "aos/dist/aos.css";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

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
    title: "Home",
    link: "/#",
  },
  {
    title: "About",
    link: "/#about",
  },
  {
    title: "Services",
    link: "/#contact",
  },
  {
    title: "Careers",
    link: "/#blog",
  },
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

    return (
        <div style={BannerImg} className="text-white mb-0">
          <div className="container">
            <div data-aos="zoom-in" className="grid md:grid-cols-3 pb-44 pt-5">
              <div className="px-4">
                <div className="flex gap-5">
                  <Image className="rounded-full w-8 h-8 " src={'/footertechx.png'} width={24} height={24} alt="ghg"/>
                  <h1 className="sm:text-2xl text-xl font-bold sm:text-left mb-3 flex items-center gap-3">
                     Techxus
                  </h1>
                </div>
                <p className="">
                  Skill up - with every Ease!
                </p>
                <p className="text-[11px] mt-6">&copy;2024 All Rights Reserved</p>
                  {/* <Image className="w-20 h-8 " src={'/ulearnlogo3.png'} width={48} height={48} alt="ghg"/>                 */}
              </div>    
              {/* Footer Links */}
              <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
                <div>
                  <div className="py-8 px-4">
                    <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                      Links
                    </h1>
                    <ul className="flex flex-col gap-3">
                      {FooterLinks.map((link) => (
                        <li
                          className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
                          key={link.title}
                        >
                          <span>{link.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="py-8 px-4">
                    <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                      Links
                    </h1>
                    <ul className="flex flex-col gap-3">
                      {FooterLinks.map((link) => (
                        <li
                          className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
                          key={link.title}
                        >
                          <span>{link.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>    
                {/* social links */}    
                <div className="max-sm:pl-3">
                  <div className="flex items-center gap-3 mt-6">
                    <a href="/">
                      <FaInstagram className="text-3xl" />
                    </a>
                    <a href="/">
                      <FaFacebook className="text-3xl" />
                    </a>
                    <a href="/">
                      <FaLinkedin className="text-3xl" />
                    </a>
                  </div>
                  <div className="mt-6">
                    {/* <div className="flex items-center gap-3">
                      <FaLocationArrow />
                      <p>101 Lagos-Ikorodu Road</p>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <FaMobileAlt />
                      <p>+2349038984567</p>
                    </div> */}
                    <div className="flex flex-col items-center gap-3 mt-3">
                      {/* <MdOutlineMailOutline /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
 
export default FooterPage;