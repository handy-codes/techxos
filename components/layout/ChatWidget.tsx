import { useState, useEffect, useRef } from &quot;react&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;
import Link from &quot;next/link&quot;;

interface Message {
  user?: string;
  bot?: string;
}

const getStorageKey = (): string => {
  if (typeof window === &quot;undefined&quot;) return &quot;chatMessages&quot;;
  const hostname = window.location.hostname;
  return `chatMessages_${hostname.replace(/\./g, &quot;_&quot;)}`;
};

const getWelcomeMessage = (user?: { firstName?: string | null; username?: string | null }): Message => {
  if (typeof window === &quot;undefined&quot;) return { bot: &quot;wandy_welcome&quot; };
  
  const baseType = window.location.hostname === &quot;techxos.com&quot; 
    ? &quot;wandy_prod_welcome&quot; 
    : &quot;wandy_welcome&quot;;

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
  const [input, setInput] = useState(&quot;&quot;);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = (): Message[] => {
      try {
        const storageKey = getStorageKey();
        const saved = localStorage.getItem(storageKey);
        
        const initialMessages: Message[] = saved ? JSON.parse(saved) : [];
        const hasWelcome = initialMessages.some(msg => 
          msg.bot?.startsWith(&quot;wandy_&quot;) && msg.bot.includes(&quot;_welcome&quot;)
        );

        return hasWelcome ? initialMessages : [getWelcomeMessage(user ?? undefined), ...initialMessages];
      } catch (error) {
        console.error(&quot;Failed to load messages:&quot;, error);
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
      console.error(&quot;Failed to save messages:&quot;, error);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: &quot;smooth&quot; });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => {
    if (!isOpen) {
      new Audio(&quot;/chat-popup.mp3&quot;).play().catch(console.error);
    }
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const newMessage = trimmedInput;
    setInput(&quot;&quot;);
    setMessages(prev => [...prev, { user: newMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch(&quot;/api/chatbot&quot;, {
        method: &quot;POST&quot;,
        headers: { &quot;Content-Type&quot;: &quot;application/json&quot; },
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
      console.error(&quot;Chat error:&quot;, error);
      const fallback = &quot;Our chat service is currently unavailable. Please email hello@techxos.com&quot;;
      setMessages(prev => [...prev, { bot: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.user) return <div className="message-text&quot;>{msg.user}</div>;

    if (msg.bot?.startsWith(&quot;wandy_&quot;)) {
      const [messageType, welcomeText] = msg.bot.split(&quot;:");
      const isProd = window.location.hostname === &quot;techxos.com&quot;;
      
      return (
        <div className="welcome-message flex flex-col justify-center&quot;>
          <div className=&quot;flex items-center gap-2&quot;>
            <TechxosLogo className=&quot;w-6 h-6 text-purple-600&quot; />
            <span className=&quot;text-black&quot;>
              {welcomeText || (isProd 
                ? &quot;Techxos Production Support&quot; 
                : &quot;Hi! I'm Wandy, Techxos AI sales expert&quot;)}
            </span>
          </div>
          <div className=&quot;mt-2 text-black self-center&quot;>
            {isProd ? &quot;🔒 Secure enterprise assistance ready&quot; : &quot;🤖 How can I help you today?&quot;}
          </div>
        </div>
      );
    }

    // Handle URLs in bot messages
    if (msg.bot) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = msg.bot.split(urlRegex);
      
      return (
        <div className=&quot;message-text&quot;>
          {parts.map((part: string, index: number) => {
            if (part.match(urlRegex)) {
              // Extract the path from the full URL
              const url = new URL(part);
              const path = url.pathname + url.search;
              
              return (
                <Link 
                  key={index} 
                  href={path}
                  className=&quot;text-blue-600 hover:text-blue-800 underline&quot;
                >
                  {part}
                </Link>
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
    <div className=&quot;chat-container&quot;>
      <button
        className=&quot;chat-button flex items-center text-white&quot;
        onClick={toggleChat}
        aria-label={isOpen ? &quot;Close chat&quot; : &quot;Open chat&quot;}
      >
        <div className=&quot;flex w-fit h-fit items-center justify-center gap-2 rounded-full bg-[#5025D1] shadow-md cursor-pointer transition-transform hover:scale-105 px-4 py-3&quot;>
          <TechxosLogo className=&quot;text-white w-6 h-6&quot; />
          <h1 className=&quot;whitespace-nowrap&quot;>Ask Wandy</h1>
        </div>
      </button>

      {isOpen && (
        <div className=&quot;chat-window&quot;>
          <div className=&quot;chat-header&quot;>
            <h3 className=&quot;flex items-center gap-2&quot;>
              <TechxosLogo className=&quot;text-white w-5 h-5&quot; />
              Wandy
            </h3>
            <button
              className=&quot;close-button&quot;
              onClick={() => setIsOpen(false)}
              aria-label=&quot;Close chat&quot;
            >
              <CloseIcon className=&quot;text-white w-4 h-4&quot; />
            </button>
          </div>

          <div className=&quot;chat-messages&quot; aria-live=&quot;polite&quot;>
            {messages.map((msg: Message, i: number) => (
              <div key={i} className={`message ${msg.user ? &quot;user&quot; : &quot;bot&quot;}`}>
                {renderMessageContent(msg)}
              </div>
            ))}
            {isTyping && (
              <div className=&quot;message bot&quot;>
                <div className=&quot;typing-indicator&quot;>
                  {[...Array(3)].map((_: unknown, i: number) => (
                    <span key={i} className=&quot;dot&quot; />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className=&quot;chat-input outline-none&quot;>
            <input
              type=&quot;text&quot;
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === &quot;Enter&quot; && sendMessage()}
              placeholder=&quot;Tell us how we can help...&quot;
              aria-label=&quot;Chat input&quot;
            />
            <button
              className={`send-button ${input.trim() ? &quot;active&quot; : &quot;disabled&quot;}`}
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              aria-label=&quot;Send message&quot;
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
    viewBox=&quot;0 0 64 64&quot;
    fill=&quot;currentColor&quot;
    className={className}
    xmlns=&quot;http://www.w3.org/2000/svg&quot;
  >
    <path d=&quot;M32 0C14.3 0 0 14.3 0 32s14.3 32 32 32 32-14.3 32-32S49.7 0 32 0zm0 58C17.6 58 6 46.4 6 32S17.6 6 32 6s26 11.6 26 26-11.6 26-26 26z&quot; />
    <path d=&quot;M46 28.2L34.8 39.4c-1.2 1.2-3.1 1.2-4.2 0l-8.5-8.5-2.1 2.1 8.5 8.5c2.3 2.3 6.1 2.3 8.5 0L48 30.3l-2-2.1z&quot; />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox=&quot;0 0 24 24&quot;
    fill=&quot;currentColor&quot;
    className={className}
    xmlns=&quot;http://www.w3.org/2000/svg&quot;
  >
    <path d=&quot;M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);
