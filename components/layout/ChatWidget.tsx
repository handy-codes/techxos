import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface Message {
  user?: string;
  bot?: string;
}

const getStorageKey = (): string => {
  if (typeof window === "undefined") return "chatMessages";
  const hostname = window.location.hostname;
  return `chatMessages_${hostname.replace(/\./g, "_")}`;
};

const getWelcomeMessage = (user?: { firstName?: string | null; username?: string | null }): Message => {
  if (typeof window === "undefined") return { bot: "wandy_welcome" };
  
  const baseType = window.location.hostname === "techxos.com" 
    ? "wandy_prod_welcome" 
    : "wandy_welcome";

  if (user?.firstName) {
    return { bot: `${baseType}:Welcome back, ${user.firstName}!` };
  }
  if (user?.username) {
    return { bot: `${baseType}:Hi @${user.username}!` };
  }
  return { bot: baseType };
};

export default function ChatWidget() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback((): Message[] => {
    try {
      const storageKey = getStorageKey();
      const saved = localStorage.getItem(storageKey);
      
      const initialMessages: Message[] = saved ? JSON.parse(saved) : [];
      const hasWelcome = initialMessages.some(msg => 
        msg.bot?.startsWith("wandy_") && msg.bot.includes("_welcome")
      );

      return hasWelcome ? initialMessages : [getWelcomeMessage(user ?? undefined), ...initialMessages];
    } catch (error) {
      console.error("Failed to load messages:", error);
      return [getWelcomeMessage(user ?? undefined)];
    }
  }, [user]);

  useEffect(() => {
    setMessages(loadMessages());
  }, [loadMessages]);

  useEffect(() => {
    try {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages:", error);
    }
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const toggleChat = useCallback(() => {
    if (!isOpen) {
      new Audio("/chat-popup.mp3").play().catch(console.error);
    }
    setIsOpen(!isOpen);
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const newMessage = trimmedInput;
    setInput("");
    setMessages(prev => [...prev, { user: newMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: newMessage,
          user: {
            id: user?.id,
            firstName: user?.firstName,
            username: user?.username
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { bot: data.message }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { bot: "Sorry, I'm having trouble responding right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, user]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-[#F89928] text-white rounded-full p-4 shadow-lg hover:bg-[#E5A111] transition-colors"
          aria-label="Open chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 h-96 flex flex-col">
          <div className="bg-[#F89928] text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat with us</h3>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.user ? "text-right" : "text-left"}`}>
                {msg.user && (
                  <div className="inline-block bg-[#F89928] text-white rounded-lg py-2 px-4 max-w-[80%]">
                    {msg.user}
                  </div>
                )}
                {msg.bot && (
                  <div className="inline-block bg-gray-100 text-gray-800 rounded-lg py-2 px-4 max-w-[80%]">
                    {msg.bot}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="text-left">
                <div className="inline-block bg-gray-100 text-gray-800 rounded-lg py-2 px-4">
                  <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-1 animate-bounce" />
                  <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-1 animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F89928]"
              />
              <button
                onClick={sendMessage}
                className="bg-[#F89928] text-white rounded-r-lg px-4 py-2 hover:bg-[#E5A111] transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const TechxosLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M32 0C14.3 0 0 14.3 0 32s14.3 32 32 32 32-14.3 32-32S49.7 0 32 0zm0 58C17.6 58 6 46.4 6 32S17.6 6 32 6s26 11.6 26 26-11.6 26-26 26z" />
    <path d="M46 28.2L34.8 39.4c-1.2 1.2-3.1 1.2-4.2 0l-8.5-8.5-2.1 2.1 8.5 8.5c2.3 2.3 6.1 2.3 8.5 0L48 30.3l-2-2.1z" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);
