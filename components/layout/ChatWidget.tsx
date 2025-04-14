import { useState, useEffect, useRef } from "react";
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

  useEffect(() => {
    const loadMessages = (): Message[] => {
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
    };

    setMessages(loadMessages());
  }, [user]);

  useEffect(() => {
    try {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages:", error);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => {
    if (!isOpen) {
      new Audio("/chat-popup.mp3").play().catch(console.error);
    }
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
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
            firstName: user?.firstName,
            username: user?.username
          }
        }),
      });

      const textResponse = await response.text();
      const data = JSON.parse(textResponse);

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      setMessages(prev => [...prev, { bot: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      const fallback = "Our chat service is currently unavailable. Please email hello@techxos.com";
      setMessages(prev => [...prev, { bot: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.user) return <div className="message-text">{msg.user}</div>;

    if (msg.bot?.startsWith("wandy_")) {
      const [messageType, welcomeText] = msg.bot.split(":");
      const isProd = window.location.hostname === "techxos.com";
      
      return (
        <div className="welcome-message flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <TechxosLogo className="w-6 h-6 text-purple-600" />
            <span className="text-black">
              {welcomeText || (isProd 
                ? "Techxos Production Support" 
                : "Hi! I'm Wandy, Techxos AI sales expert")}
            </span>
          </div>
          <div className="mt-2 text-black self-center">
            {isProd ? "🔒 Secure enterprise assistance ready" : "🤖 How can I help you today?"}
          </div>
        </div>
      );
    }

    // Handle URLs in bot messages
    if (msg.bot) {
      // Updated regex to match both relative and absolute URLs
      const urlRegex = /(https?:\/\/[^\s]+|\/[^\s]+)/g;
      const parts = msg.bot.split(urlRegex);
      
      return (
        <div className="message-text">
          {parts.map((part, index) => {
            if (part.match(urlRegex)) {
              // Display URLs as plain text with styling
              return (
                <span 
                  key={index} 
                  className="text-blue-600"
                >
                  {part}
                </span>
              );
            }
            return part;
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="chat-container">
      <button
        className="chat-button flex items-center text-white"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <div className="flex w-fit h-fit items-center justify-center gap-2 rounded-full bg-[#5025D1] shadow-md cursor-pointer transition-transform hover:scale-105 px-4 py-3">
          <TechxosLogo className="text-white w-6 h-6" />
          <h1 className="whitespace-nowrap">Ask Wandy</h1>
        </div>
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3 className="flex items-center gap-2">
              <TechxosLogo className="text-white w-5 h-5" />
              Wandy
            </h3>
            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <CloseIcon className="text-white w-4 h-4" />
            </button>
          </div>

          <div className="chat-messages" aria-live="polite">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.user ? "user" : "bot"}`}>
                {renderMessageContent(msg)}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="dot"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input outline-none">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Tell us how we can help..."
              aria-label="Chat input"
            />
            <button
              className={`send-button ${input.trim() ? "active" : "disabled"}`}
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-container {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          z-index: 1000;
        }

        .chat-window {
          width: 420px;
          max-height: 70vh;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          position: absolute;
          bottom: calc(100% + 1rem);
          right: 0;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #0070f3, #0063cc);
          color: white;
          border-radius: 1rem 1rem 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          min-height: 300px;
        }

        .message {
          margin: 0.5rem 0;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          max-width: 85%;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .message-text {
          word-break: break-word;
          overflow-wrap: break-word;
          white-space: pre-wrap;
        }

        .message-text a {
          color: #0070f3;
          text-decoration: underline;
        }

        .message-text a:hover {
          color: #0051b3;
        }

        .message.user {
          background: #0070f3;
          color: white;
          margin-left: auto;
        }

        .message.bot {
          background: #f3f4f6;
          color: #1f2937;
          margin-right: auto;
        }

        .typing-indicator {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
        }

        .dot {
          width: 0.5rem;
          height: 0.5rem;
          background: #94a3b8;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .chat-input {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
          color: black;
          border: none;
          outline: none;
        }

        input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          min-width: 0;
        }

        .send-button {
          padding: 0.75rem 1.25rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .send-button:disabled {
          background: #e2e8f0;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .chat-container {
            bottom: 0.5rem;
            right: 0.5rem;
          }

          .chat-window {
            width: calc(100vw - 1rem);
            right: 0.5rem;
            bottom: calc(100% + 0.5rem);
            max-width: 100vw;
          }

          .chat-messages {
            min-height: 200px;
          }

          .message {
            max-width: 90%;
            padding: 0.5rem 0.75rem;
            font-size: 0.9rem;
          }

          .chat-input {
            padding: 0.75rem;
            gap: 0.25rem;
          }

          input {
            padding: 0.5rem 0.75rem;
            font-size: 0.9rem;
          }

          .send-button {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }

          .chat-button h1 {
            display: none;
          }

          .chat-header h3 {
            font-size: 1rem;
          }
        }

        @media (max-width: 360px) {
          .chat-window {
            width: 100vw;
            right: 0;
            bottom: calc(100% + 0.5rem);
          }

          .chat-input {
            padding: 0.5rem;
          }

          .send-button {
            padding: 0.5rem;
          }
        }
      `}</style>
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
