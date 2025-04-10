'use client&apos;;

import { useEffect, useState } from &apos;react&apos;;
import { FaWhatsapp } from &apos;react-icons/fa';

const WhatsAppLink = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <a
      href=&quot;https://wa.me/2349038984567&quot; // Replace with your WhatsApp Business number
      className=&quot;fixed bottom-4 right-4 bg-green-500 text-white md:text-black p-3 rounded-full shadow-lg flex items-center justify-center&quot;
      target=&quot;_blank&quot;
      rel=&quot;noopener noreferrer&quot;
    >
      <FaWhatsapp className=&quot;text-[24px] md:text-[34px]&quot; />
      <span className="hidden md:inline text-white font-bold text-xs ml-2">Chat with one of our advisors on WhatsApp</span>
    </a>
  );
};

export default WhatsAppLink;