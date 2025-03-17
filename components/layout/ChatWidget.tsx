import { useState, useEffect, useRef } from "react";

interface Message {
  user?: string;
  bot?: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Error loading chat messages:", error);
        localStorage.removeItem("chatMessages");
      }
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => {
    if (!isOpen) {
      if (typeof window !== "undefined") {
        new Audio("/chat-popup.mp3").play().catch(console.error);
      }
      if (messages.length === 0) {
        setMessages([{ bot: "wandy_welcome" }]);
      }
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const defaultResponses = [
        "Thank you for your message! Our team will get back to you shortly.",
        "That's an interesting question! I'll forward this to our support team.",
        "We appreciate your inquiry. Please check our FAQ section or contact us via email at hello@techxos.com",
        "I'm still learning, but a human colleague will respond to you soon!",
        "For immediate assistance, please reach out to our WhatsApp support at +1234567890."
      ];

      const randomResponse = defaultResponses[
        Math.floor(Math.random() * defaultResponses.length)
      ];

      setMessages(prev => [...prev, { bot: randomResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        bot: "Sorry, there was an error processing your request. Please try again later.",
      }]);
    } finally {
      setIsTyping(false);
    }
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
                {msg.user || (
                  msg.bot === "wandy_welcome" ? (
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex items-center gap-2 mx-auto w-full">
                        <TechxosLogo className="w-6 h-6 text-purple-600" />
                        <span className="text-black">Hi! I&apos;m Wandy, Techxos AI sales expert</span>
                      </div>
                      <div className="ml-8 text-black">🤖 How can I help you today?</div>
                    </div>
                  ) : (
                    msg.bot
                  )
                )}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Tell us how we can help..."
              aria-label="Chat input"
              className="text-black flex-1"
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
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
        }

        .chat-button {
          border: none;
          background: none;
          padding: 0;
          transition: transform 0.2s ease;
        }

        .chat-window {
          width: 420px;
          max-height: 70vh;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          position: absolute;
          bottom: calc(100% + 16px);
          right: 0;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background: linear-gradient(135deg, #0070f3, #0063cc);
          color: white;
          border-radius: 16px 16px 0 0;
        }

        .chat-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          min-height: 300px;
        }

        .message {
          margin: 8px 0;
          padding: 12px 16px;
          border-radius: 16px;
          max-width: 80%;
          line-height: 1.4;
          word-break: break-word;
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
          padding: 16px;
          gap: 8px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #9ca3af;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .chat-input {
          display: flex;
          gap: 8px;
          padding: 16px;
          border-top: 1px solid #e5e7eb;
        }

        input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          outline: none;
          font-size: 16px;
        }

        input:focus {
          border-color: #0070f3;
          box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
        }

        .send-button {
          padding: 12px 20px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .send-button.disabled {
          background: #e5e7eb;
          cursor: not-allowed;
        }

        .send-button.active {
          background: #0070f3;
        }

        .send-button:hover:not(.disabled) {
          background: #0063cc;
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
    <path d="M32 0C14.3 0 0 14.3 0 32s14.3 32 32 32 32-14.3 32-32S49.7 0 32 0zm0 58C17.6 58 6 46.4 6 32S17.6 6 32 6s26 11.6 26 26-11.6 26-26 26z"/>
    <path d="M46 28.2L34.8 39.4c-1.2 1.2-3.1 1.2-4.2 0l-8.5-8.5-2.1 2.1 8.5 8.5c2.3 2.3 6.1 2.3 8.5 0L48 30.3l-2-2.1z"/>
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);