"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaPhone,
  FaMapMarkerAlt,
  FaInstagram,
} from "react-icons/fa";
import Image from "next/image";
import { FaX } from "react-icons/fa6";
import ChatWidget from "./ChatWidget";

const Footer = () => {
  const socialLinks = [
    {
      icon: <FaFacebookF className="w-5 h-5" />,
      href: "https://web.facebook.com/profile.php?id=61572481057148",
      label: "Facebook",
    },
    {
      icon: <FaX className="w-5 h-5" />,
      href: "#",
      label: "Twitter/X",
    },
    {
      icon: <FaLinkedinIn className="w-5 h-5" />,
      href: "https://www.linkedin.com/company/techxos-digital-products",
      label: "LinkedIn",
    },
    {
      icon: <FaYoutube className="w-5 h-5" />,
      href: "#",
      label: "YouTube",
    },
    {
      icon: <FaInstagram className="w-5 h-5" />,
      href: "https://www.instagram.com/techxosoffical/",
      label: "Instagram",
    },
  ];

  return (
    <footer className="bg-[#131635] text-white md:pt-4 md:pb-8">
      <div className="container mx-auto px-6 max-sm:p-4 py-12">
        <Link href="/">
          <div className="flex items-center mb-4 gap-6">
            <div className="flex items-center">
              <Image
                src="/logo-techxos.svg"
                alt="Techxos Logo"
                width={60}
                height={60}
                className="rounded-md md:h-[45px] md:w-[45px] object-cover"
              />
            </div>
            <h1 className="max-sm:text-[18px] mt-4 sm:text-[27px] mb-4 font-semibold">
              Techxos Digital Products
            </h1>
          </div>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#F89928]">Company</h3>
            <ul>
              <li className="mb-2">
                <Link
                  href="/"
                  className="text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1"
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/pages/about"
                  className="text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/careers"
                  className="text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#F89928]">Services</h3>
            <ul>
              <li className="mb-2">
                <Link
                  href="/pages/courses"
                  className="text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1"
                >
                  Courses
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/pages/training"
                  className="text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1"
                >
                  Training
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/consulting"
                  className="text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1"
                >
                  Consulting
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#F89928]">Contact</h3>
            <ul>
              <li className="mb-2">
                <Link
                  href="/pages/contact"
                  className="text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1"
                >
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/pages/support"
                  className="text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/faq"
                  className="text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex space-x-2 xl:hidden">
            <FaMapMarkerAlt className="text-[orange]" />
            <p className="text-[#CED1E4] text-sm mb-4 md:mb-0">
              101, Lagos-Ikorodu Road, by (WandyTechX Place) Jumofak Ikorodu Lagos
            </p>
          </div>
          <div className="flex space-x-2 xl:hidden">
              <FaPhone className="text-[orange]" />
              <p className="text-[#CED1E4] text-sm mb-4 md:mb-0">+2349123444391, +2348167715107</p>
            </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#CED1E4] text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Techxos Digital Products. All rights reserved.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#CED1E4] hover:text-[#E5A111] transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ChatWidget />
    </footer>
  );
};

export default Footer;

// "use client";
// import { MdOutlineMailOutline } from "react-icons/md";
// import React from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import Link from "next/link";
// import {
//   FaFacebook,
//   FaInstagram,
//   FaLinkedin,
//   FaMobileAlt,
// } from "react-icons/fa";
// import { MdRoom } from "react-icons/md";

// const BannerImg = {
//   backgroundImage: `url('/footer-pattern.jpg')`,
//   backgroundPosition: "bottom",
//   backgroundRepeat: "no-repeat",
//   backgroundSize: "cover",
//   // height: "100%",
//   width: "100%",
// };

// const FooterLinks = [
//   {
//     title: "HOME",
//     link: "/",
//   },
//   {
//     title: "ABOUT",
//     link: "/about",
//   },
//   {
//     title: "MY LEARNING",
//     link: "/learning",
//   },
//   // {
//   //   title: "Careers",
//   //   link: "/#blog",
//   // },
// ];

// interface FooterPageProps {
//   className?: string;
// }

// const FooterPage: React.FC<FooterPageProps> = ({ className }) => {
//   React.useEffect(() => {
//     AOS.init({
//       offset: 100,
//       duration: 800,
//       easing: "ease-in-sine",
//       delay: 100,
//     });
//     AOS.refresh();
//   }, []);

//   const currentYear = new Date().getFullYear();
//   return (
//     <div
//       style={BannerImg}
//       className={`text-white text-[17px] md:text-[15px] p-2 h-full md:h-[70%] mb-0 ${className}`}
//     >
//       <div className="container">
//         {/* <div data-aos="zoom-in" className="grid md:grid-cols-3 pb-44 pt-5"> */}
//         <div
//           data-aos="zoom-in"
//           className="flex justify-between max-sm:flex-col flex-wrap pb-40 pt-5"
//         >
//           <div className="py-4">
//             <div className="flex gap-5">
//               {/* <Image className="rounded-full w-8 h-8 " src={'/footertechx.png'} width={24} height={24} alt="ghg"/> */}
//               <h1 className="sm:text-4xl text-3xl font-bold sm:text-left mb-3 flex items-center gap-3">
//                 Techxos
//               </h1>
//             </div>
//             <p className="text-[18px] md:text-[15px] text-bold text-[#E5A111]">
//               Skill up - with every Ease!
//             </p>
//             <div className="mt-6">
//               <div className="flex items-center gap-3">
//                 <MdRoom className="text-[24px] md:text-[19px]" />
//                 <p>101 Lagos-Ikorodu Road, (WandyTechX Suites) Ikorodu Lagos</p>
//               </div>
//               <div className="flex items-center gap-3 mt-3">
//                 <FaMobileAlt />
//                 <p>+2349123444391</p>
//               </div>
//               <div className="flex items-center gap-3 mt-3">
//                 <MdOutlineMailOutline />
//                 <p>hello@techxos.com</p>
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col gap-3">
//             <div>
//               <div className="py-4">
//                 <ul>
//                   {FooterLinks.map((item, index) => (
//                     <li
//                       key={index}
//                       className="cursor-pointer mt-3 hover:text-[#E5A111] hover:translate-x-1 duration-300 text-[white]"
//                     >
//                       <Link href={item.link} legacyBehavior>
//                         <a className="text-[14px]">{item.title}</a>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//             <div className="flex justify-start items-center gap-3 mt-2">
//               <p className="flex items-center text-[17px] md:text-[15px]">
//                 Follow us
//                 <span className="inline-block h-8 ml-3 w-px bg-current"></span>
//               </p>
//               <a
//                 href="https://www.instagram.com/techxosoffical"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="transition duration-300 ease-in-out transform hover:bg-red-500 hover:text-white p-1 rounded-full"
//               >
//                 <FaInstagram className="text-[23px]" />
//               </a>
//               <a
//                 href="https://web.facebook.com/profile.php?id=61572481057148"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="transition duration-300 ease-in-out transform hover:bg-red-500 hover:text-white p-1 rounded-full"
//               >
//                 <FaFacebook className="text-[23px]" />
//               </a>
//               <a
//                 href="https://www.linkedin.com/company/techxos-digital-products"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="transition duration-300 ease-in-out transform hover:bg-red-500 hover:text-white p-1 rounded-full"
//               >
//                 <FaLinkedin className="text-[23px]" />
//               </a>
//             </div>
//             <div className="bg-[white] w-full h-[2px]"></div>
//           </div>
//           <div className="">
//             <p className="text-[13px] mt-6 text-white">
//               &copy; {currentYear} Techxos | All Rights Reserved
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FooterPage;
