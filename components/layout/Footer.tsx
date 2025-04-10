"use client&quot;;

import Link from &quot;next/link&quot;;
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
} from &quot;react-icons/fa&quot;;
import Image from &quot;next/image&quot;;
import { FaX } from &quot;react-icons/fa6&quot;;
import ChatWidget from &quot;./ChatWidget&quot;;

const Footer = () => {
  const socialLinks = [
    {
      icon: <FaFacebookF className=&quot;w-5 h-5&quot; />,
      href: &quot;https://web.facebook.com/profile.php?id=61572481057148&quot;,
      label: &quot;Facebook&quot;,
    },
    {
      icon: <FaX className=&quot;w-5 h-5&quot; />,
      href: &quot;#",
      label: &quot;Twitter/X&quot;,
    },
    {
      icon: <FaLinkedinIn className=&quot;w-5 h-5&quot; />,
      href: &quot;https://www.linkedin.com/company/techxos-digital-products&quot;,
      label: &quot;LinkedIn&quot;,
    },
    {
      icon: <FaYoutube className=&quot;w-5 h-5&quot; />,
      href: &quot;#&quot;,
      label: &quot;YouTube&quot;,
    },
    {
      icon: <FaInstagram className=&quot;w-5 h-5&quot; />,
      href: &quot;https://www.instagram.com/techxosoffical/&quot;,
      label: &quot;Instagram&quot;,
    },
  ];

  return (
    <footer className="bg-[#131635] text-white md:pt-4 md:pb-8&quot;>
      <div className=&quot;container mx-auto px-6 max-sm:p-4 py-12&quot;>
        <Link href=&quot;/">
          <div className="flex items-center mb-4 gap-6&quot;>
            <div className=&quot;flex items-center&quot;>
              <Image
                src=&quot;/logo-techxos.svg&quot;
                alt=&quot;Techxos Logo&quot;
                width={60}
                height={60}
                className=&quot;rounded-md md:h-[45px] md:w-[45px] object-cover&quot;
              />
            </div>
            <h1 className=&quot;max-sm:text-[18px] mt-4 sm:text-[27px] mb-4 font-semibold&quot;>
              Techxos Digital Products
            </h1>
          </div>
        </Link>

        <div className=&quot;grid grid-cols-1 md:grid-cols-3 gap-8&quot;>
          {/* Company Links */}
          <div>
            <h3 className=&quot;text-lg font-semibold mb-4 text-[#F89928]&quot;>Company</h3>
            <ul>
              <li className=&quot;mb-2&quot;>
                <Link
                  href=&quot;/"
                  className=&quot;text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1&quot;
                >
                  Home
                </Link>
              </li>
              <li className="mb-2&quot;>
                <Link
                  href=&quot;/pages/about&quot;
                  className=&quot;text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1&quot;
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href=&quot;/pages/careers&quot;
                  className=&quot;text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1&quot;
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className=&quot;text-lg font-semibold mb-4 text-[#F89928]&quot;>Services</h3>
            <ul>
              <li className=&quot;mb-2&quot;>
                <Link
                  href=&quot;/pages/services&quot;
                  className=&quot;text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1&quot;
                >
                  Our Services
                </Link>
              </li>
              <li className=&quot;mb-2&quot;>
                <Link
                  href=&quot;/pages/services&quot;
                  className=&quot;text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1&quot;
                >
                  Website Developers
                </Link>
              </li>
              <li>
                <Link
                  href=&quot;/pages/services&quot;
                  className=&quot;text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1&quot;
                >
                  Tech Consultancy
                </Link>
              </li>
            </ul>
          </div>

          {/* Aviation Links */}
          <div>
            <h3 className=&quot;text-lg font-semibold mb-4 text-[#F89928]&quot;>Policy</h3>
            <ul>
              <li className=&quot;mb-2&quot;>
                <Link
                  href=&quot;/"
                  className=&quot;text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1&quot;
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href=&quot;/&quot;
                  className=&quot;text-[#CED1E4] cursor-pointer transform transition-all duration-300 hover:text-[#E5A111] hover:translate-x-1&quot;
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <ChatWidget />
        </div>

        <hr className=&quot;my-6 border-[#F89928]&quot; />

        <div className="flex flex-col md:flex-row justify-between items-center&quot;>
          <p className=&quot;text-sm text-[#CED1E4] mb-2 md:mb-0&quot;>
            &copy; {new Date().getFullYear()} Techxos Developers | All rights reserved.
          </p>
          
          <div className=&quot;flex space-x-4 mb-4 md:mb-0&quot;>
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className=&quot;social-icon-wrapper relative w-10 h-10&quot;
                target=&quot;_blank&quot;
                rel=&quot;noopener noreferrer&quot;
                aria-label={social.label}
              >
                <svg
                  className=&quot;absolute inset-0 w-full h-full transform -rotate-90&quot;
                  viewBox=&quot;0 0 100 100&quot;
                >
                  <circle
                    cx=&quot;50&quot;
                    cy=&quot;50&quot;
                    r=&quot;45&quot;
                    fill=&quot;none&quot;
                    stroke=&quot;#F89928&quot;
                    strokeWidth=&quot;4"
                    pathLength=&quot;100&quot;
                  />
                </svg>
                <span className="text-[#F89928] hover:text-white p-2 rounded-full transition-colors duration-300 flex items-center justify-center w-full h-full&quot;>
                  {social.icon}
                </span>
              </a>
            ))}
          </div>

          <p className=&quot;text-sm text-[#CED1E4]&quot;>
            Developed by{&quot; "}
            <Link
              href=&quot;/pages/services&quot;
              className=&quot;text-[#F89928] text-lg hover:text-[#E5A111] transition-colors&quot;
            >
              Techxos
            </Link>
          </p>
        </div>
      </div>

      <style jsx global>{`
        .social-icon-wrapper circle {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          transition: stroke-dashoffset 0.6s linear;
        }

        .social-icon-wrapper:hover circle {
          stroke-dashoffset: 0;
        }
      `}</style>
    </footer>
  );
};

export default Footer;

// &quot;use client&quot;;
// import { MdOutlineMailOutline } from &quot;react-icons/md&quot;;
// import React from &quot;react&quot;;
// import AOS from &quot;aos&quot;;
// import &quot;aos/dist/aos.css&quot;;
// import Link from &quot;next/link&quot;;
// import {
//   FaFacebook,
//   FaInstagram,
//   FaLinkedin,
//   FaMobileAlt,
// } from &quot;react-icons/fa&quot;;
// import { MdRoom } from &quot;react-icons/md&quot;;

// const BannerImg = {
//   backgroundImage: `url(&apos;/footer-pattern.jpg&apos;)`,
//   backgroundPosition: &quot;bottom&quot;,
//   backgroundRepeat: &quot;no-repeat&quot;,
//   backgroundSize: &quot;cover&quot;,
//   // height: &quot;100%&quot;,
//   width: &quot;100%&quot;,
// };

// const FooterLinks = [
//   {
//     title: &quot;HOME&quot;,
//     link: &quot;/&quot;,
//   },
//   {
//     title: &quot;ABOUT&quot;,
//     link: &quot;/about&quot;,
//   },
//   {
//     title: &quot;MY LEARNING&quot;,
//     link: &quot;/learning&quot;,
//   },
//   // {
//   //   title: &quot;Careers&quot;,
//   //   link: &quot;/#blog&quot;,
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
//       easing: &quot;ease-in-sine&quot;,
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
//       <div className="container&quot;>
//         {/* <div data-aos=&quot;zoom-in&quot; className=&quot;grid md:grid-cols-3 pb-44 pt-5&quot;> */}
//         <div
//           data-aos=&quot;zoom-in&quot;
//           className=&quot;flex justify-between max-sm:flex-col flex-wrap pb-40 pt-5&quot;
//         >
//           <div className=&quot;py-4&quot;>
//             <div className=&quot;flex gap-5&quot;>
//               {/* <Image className=&quot;rounded-full w-8 h-8 &quot; src={&apos;/footertechx.png&apos;} width={24} height={24} alt=&quot;ghg&quot;/> */}
//               <h1 className=&quot;sm:text-4xl text-3xl font-bold sm:text-left mb-3 flex items-center gap-3&quot;>
//                 Techxos
//               </h1>
//             </div>
//             <p className=&quot;text-[18px] md:text-[15px] text-bold text-[#E5A111]&quot;>
//               Skill up - with every Ease!
//             </p>
//             <div className=&quot;mt-6&quot;>
//               <div className=&quot;flex items-center gap-3&quot;>
//                 <MdRoom className=&quot;text-[24px] md:text-[19px]&quot; />
//                 <p>101 Lagos-Ikorodu Road, (WandyTechX Suites) Ikorodu Lagos</p>
//               </div>
//               <div className=&quot;flex items-center gap-3 mt-3&quot;>
//                 <FaMobileAlt />
//                 <p>+2349123444391</p>
//               </div>
//               <div className=&quot;flex items-center gap-3 mt-3&quot;>
//                 <MdOutlineMailOutline />
//                 <p>hello@techxos.com</p>
//               </div>
//             </div>
//           </div>
//           <div className=&quot;flex flex-col gap-3&quot;>
//             <div>
//               <div className=&quot;py-4&quot;>
//                 <ul>
//                   {FooterLinks.map((item, index) => (
//                     <li
//                       key={index}
//                       className=&quot;cursor-pointer mt-3 hover:text-[#E5A111] hover:translate-x-1 duration-300 text-[white]&quot;
//                     >
//                       <Link href={item.link} legacyBehavior>
//                         <a className=&quot;text-[14px]&quot;>{item.title}</a>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//             <div className=&quot;flex justify-start items-center gap-3 mt-2&quot;>
//               <p className=&quot;flex items-center text-[17px] md:text-[15px]&quot;>
//                 Follow us
//                 <span className=&quot;inline-block h-8 ml-3 w-px bg-current&quot;></span>
//               </p>
//               <a
//                 href=&quot;https://www.instagram.com/techxosoffical&quot;
//                 target=&quot;_blank&quot;
//                 rel=&quot;noopener noreferrer&quot;
//                 className=&quot;transition duration-300 ease-in-out transform hover:bg-red-500 hover:text-white p-1 rounded-full&quot;
//               >
//                 <FaInstagram className=&quot;text-[23px]&quot; />
//               </a>
//               <a
//                 href=&quot;https://web.facebook.com/profile.php?id=61572481057148&quot;
//                 target=&quot;_blank&quot;
//                 rel=&quot;noopener noreferrer&quot;
//                 className=&quot;transition duration-300 ease-in-out transform hover:bg-red-500 hover:text-white p-1 rounded-full&quot;
//               >
//                 <FaFacebook className=&quot;text-[23px]&quot; />
//               </a>
//               <a
//                 href=&quot;https://www.linkedin.com/company/techxos-digital-products&quot;
//                 target=&quot;_blank&quot;
//                 rel=&quot;noopener noreferrer&quot;
//                 className=&quot;transition duration-300 ease-in-out transform hover:bg-red-500 hover:text-white p-1 rounded-full&quot;
//               >
//                 <FaLinkedin className=&quot;text-[23px]&quot; />
//               </a>
//             </div>
//             <div className=&quot;bg-[white] w-full h-[2px]&quot;></div>
//           </div>
//           <div className=&quot;">
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
