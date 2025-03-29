import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
  };
}

// Track first chat for users
const userFirstChat: { [key: string]: boolean } = {};

interface Course {
  name: string;
  price: string;
  duration: string;
  link: string;
  description: string;
}

// Enhanced cache with better structure
interface WebsiteCache {
  content: string;
  structuredData: {
    courses: Course[];
    contact: {
      email: string;
      phone: string;
      address: string;
    };
  };
  expiry: number;
}

let cachedWebsiteContent: WebsiteCache | null = null;

// Fallback course data in case crawling fails
const FALLBACK_COURSES: Course[] = [
  {
    name: "Frontend Development",
    price: "₦150k",
    duration: "12w",
    link: "https://www.techxos.com/pages/frontend",
    description: "Modern web development with React, Vue, Angular"
  },
  {
    name: "Fullstack Development",
    price: "₦250k",
    duration: "16w",
    link: "https://www.techxos.com/pages/fullstack",
    description: "Complete web development from front to back"
  },
  {
    name: "Cybersecurity",
    price: "₦350k",
    duration: "16w",
    link: "https://www.techxos.com/pages/cybersecurity",
    description: "Network security, ethical hacking, compliance"
  },
  {
    name: "Software Development",
    price: "₦350k",
    duration: "16w",
    link: "https://www.techxos.com/pages/software-devt",
    description: "Enterprise software development with Java, Python"
  },
  {
    name: "UI-UX Design",
    price: "₦150k",
    duration: "12w",
    link: "https://www.techxos.com/pages/ui-ux",
    description: "User interface and experience design"
  },
  {
    name: "Artificial Intelligence",
    price: "₦450k",
    duration: "16w",
    link: "https://www.techxos.com/pages/ai-ml",
    description: "Machine learning, deep learning, AI applications"
  },
  {
    name: "Digital Marketing",
    price: "₦150k",
    duration: "16w",
    link: "https://www.techxos.com/pages/digital-marketing",
    description: "SEO, social media, content marketing"
  },
  {
    name: "Graphic Design",
    price: "₦250k",
    duration: "16w",
    link: "https://www.techxos.com/pages/graphic-design",
    description: "Adobe Creative Suite, branding, visual design"
  },
  {
    name: "Project Management",
    price: "₦250k",
    duration: "16w",
    link: "https://www.techxos.com/pages/project-mgt",
    description: "Agile, Scrum, PMP methodologies"
  },
  {
    name: "Data Science",
    price: "₦250k",
    duration: "16w",
    link: "https://www.techxos.com/pages/data-science",
    description: "Data analysis, visualization, statistics"
  }
];

async function crawlWebsite(url: string): Promise<WebsiteCache['structuredData']> {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    // Extract structured data
    const courses: Course[] = [];
    
    // Try multiple selectors to find course information
    $('.course-card, .course-item, .course, [data-course]').each((i, el) => {
      const course: Course = {
        name: $(el).find('.course-title, .title, h2, h3').first().text().trim(),
        price: $(el).find('.course-price, .price, [data-price]').first().text().trim(),
        duration: $(el).find('.course-duration, .duration, [data-duration]').first().text().trim(),
        link: $(el).find('a').attr('href') || '',
        description: $(el).find('.course-description, .description, p').first().text().trim()
      };
      if (course.name) courses.push(course);
    });

    // If no courses found, use fallback data
    if (courses.length === 0) {
      console.log("No courses found in website, using fallback data");
      return {
        courses: FALLBACK_COURSES,
        contact: {
          email: 'sales@techxos.com',
          phone: '',
          address: 'Techxos Headquarters, Lagos, Nigeria'
        }
      };
    }

    // Extract contact information
    const contact = {
      email: $('a[href^="mailto:"]').first().text().trim() || 'sales@techxos.com',
      phone: $('a[href^="tel:"]').first().text().trim() || '',
      address: $('.address, .location, [data-address]').first().text().trim() || 'Techxos Headquarters, Lagos, Nigeria'
    };

    return {
      courses,
      contact
    };
  } catch (error) {
    console.error("Error crawling website:", error);
    // Use fallback data on error
    return {
      courses: FALLBACK_COURSES,
      contact: {
        email: 'sales@techxos.com',
        phone: '',
        address: 'Techxos Headquarters, Lagos, Nigeria'
      }
    };
  }
}

async function getWebsiteContent(): Promise<WebsiteCache> {
  const now = Date.now();
  // Cache for 24 hours
  if (cachedWebsiteContent && cachedWebsiteContent.expiry > now) {
    return cachedWebsiteContent;
  }

  const structuredData = await crawlWebsite("https://www.techxos.com");
  const content = structuredData.courses.map(course => 
    `${course.name}: ${course.description} (${course.price})`
  ).join('\n');

  cachedWebsiteContent = {
    content,
    structuredData,
    expiry: now + 24 * 60 * 60 * 1000 // 24 hours
  };
  return cachedWebsiteContent;
}

export async function POST(req: Request) {
  try {
    if (!req.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    const { message, user } = await req.json();
    
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY environment variable not configured");
    }

    // User greeting logic - only for first chat
    const userId = user?.id || user?.username || 'anonymous';
    const isFirstChat = !userFirstChat[userId];
    let welcomeMessage = "";
    
    if (isFirstChat) {
      if (user?.firstName) {
        welcomeMessage = `Welcome back, ${user.firstName}! How can I help?`;
      } else if (user?.username) {
        welcomeMessage = `Hi ${user.username}! How can I assist you?`;
      } else {
        welcomeMessage = "How can I assist you today?";
      }
      userFirstChat[userId] = true;
    }

    // Get website content with structured data
    const websiteData = await getWebsiteContent();
    
    const systemMessage = {
      role: "system",
      content: `# Wandy's Profile
      ## Core Identity
      - Techxos LMS Sales Expert
      - Next cohort starts: 1 April 2025
      - Tone: Professional + friendly
      - Current user: ${user?.firstName || user?.username || "Guest"}
      - First chat: ${isFirstChat}

      # Key Data
      **Courses** (NGN):
      ${websiteData.structuredData.courses.map(course => 
        `| ${course.name} | ${course.price} | ${course.duration} | ${course.link} | ${course.description} |`
      ).join('\n')}

      **Payment Options**:
      - 50% initial payment required
      - Remaining balance + 10% fee due within 30 days
      - Example: ₦150k course = ₦75k deposit + ₦82.5k final payment
      - Installment plans available for select courses
      - Corporate/Group discounts available

      **Training Details**:
      - Modes: Online (Zoom) or On-site (Lagos HQ)
      - Address: Techxos Headquarters, Lagos, Nigeria
      - Schedule Options:
        • Morning: 9:00 AM - 12:00 PM
        • Afternoon: 1:00 PM - 4:00 PM
        • Evening: 6:00 PM - 9:00 PM
      - Max 30-minute breaks between sessions

      **Requirements**:
      - Reliable internet connection
      - Computer: Windows 10/11 or macOS 10.5+
      - Minimum 8GB RAM
      - Webcam for online sessions
      - Microphone for participation

      **Certification & Resources**:
      - Certificate of Completion for all courses
      - Source code: Available via GitHub for enrolled students
      - Course materials: www.techxos.com/portal

      **Support**:
      - Email: <1hr response time
      - Live Chat: 24/7 for Pro+ members

      # Conversation Rules
      1. ${isFirstChat ? `Start with: "${welcomeMessage}"` : 'Skip welcome message and respond directly to the query'}
      2. When discussing courses, ALWAYS include:
         - Course name
         - Price
         - Duration
         - Description
         - Course URL (e.g., "You can learn more at http://www.techxos.com/pages/course-name")
      3. Present links as plain text without formatting or parentheses
      4. Address users by first name if available, otherwise username
      5. Never reveal GitHub repository URL
      6. Keep responses concise and focused
      7. For any information not in the provided data:
         - Direct users to sales@techxos.com
         - Never say "I don't know" or "I'm an AI"
         - Instead say "For detailed information about this, please contact our sales team at sales@techxos.com"
      8. Never repeat introductory information
      9. Don't ask redundant questions or offer to help further unless specifically requested
      10. Keep responses under 2-3 sentences unless more detail is specifically requested`
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Reduced timeout for faster response

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [systemMessage, { role: "user", content: message }],
          temperature: 0.3,
          max_tokens: 300, // Increased from 150 to 300 for complete sentences
          stream: false,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    const responseText = await groqResponse.text();
    let data: GroqResponse;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Invalid JSON from Groq API:", responseText.slice(0, 200));
      throw new Error(`Received invalid response from AI provider`);
    }

    if (!groqResponse.ok) {
      const errorMessage = data?.error?.message || `Groq API error: ${groqResponse.status}`;
      throw new Error(errorMessage);
    }

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response structure from AI provider");
    }

    // Ensure response ends with a complete sentence and fix URL formatting
    let response = data.choices[0].message.content;
    if (!response.match(/[.!?]$/)) {
      response = response.replace(/[^.!?]*$/, '');
    }
    // Remove any parentheses around URLs while preserving the URL itself
    response = response.replace(/\((http[s]?:\/\/[^\s)]+)\)/g, '$1');
    // Ensure URLs are properly formatted for display
    response = response.replace(/(http[s]?:\/\/[^\s]+)/g, '$1');

    return NextResponse.json({ 
      reply: response
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: "chat_error",
        message: error.message || "Unable to process chat request"
      },
      { status: 500 }
    );
  }
}







// import { NextResponse } from "next/server";
// import * as cheerio from "cheerio";

// interface GroqResponse {
//   choices: Array<{
//     message: {
//       content: string;
//     };
//   }>;
//   error?: {
//     message: string;
//   };
// }

// // Track first chat for users
// const userFirstChat: { [key: string]: boolean } = {};

// interface Course {
//   name: string;
//   price: string;
//   duration: string;
//   link: string;
//   description: string;
// }

// // Enhanced cache with better structure
// interface WebsiteCache {
//   content: string;
//   structuredData: {
//     courses: Course[];
//     contact: {
//       email: string;
//       phone: string;
//       address: string;
//     };
//   };
//   expiry: number;
// }

// let cachedWebsiteContent: WebsiteCache | null = null;

// // Fallback course data in case crawling fails
// const FALLBACK_COURSES: Course[] = [
//   {
//     name: "Frontend Development",
//     price: "₦150k",
//     duration: "12w",
//     link: "https://www.techxos.com/pages/frontend",
//     description: "Modern web development with React, Vue, Angular"
//   },
//   {
//     name: "Fullstack Development",
//     price: "₦250k",
//     duration: "16w",
//     link: "https://www.techxos.com/pages/fullstack",
//     description: "Complete web development from front to back"
//   },
//   {
//     name: "Cybersecurity",
//     price: "₦350k",
//     duration: "16w",
//     link: "https://www.techxos.com/pages/cybersecurity",
//     description: "Network security, ethical hacking, compliance"
//   },
//   {
//     name: "Software Development",
//     price: "₦350k",
//     duration: "16w",
//     link: "https://www.techxos.com/pages/software-devt",
//     description: "Enterprise software development with Java, Python"
//   },
//   {
//     name: "UI-UX Design",
//     price: "₦150k",
//     duration: "12w",
//     link: "https://www.techxos.com/pages/ui-ux",
//     description: "User interface and experience design"
//   },
//   {
//     name: "Artificial Intelligence",
//     price: "₦450k",
//     duration: "16w",
//     link: "https://www.techxos.com/pages/ai-ml",
//     description: "Machine learning, deep learning, AI applications"
//   },
//   {
//     name: "Digital Marketing",
//     price: "₦150k",
//     duration: "16w",
//     link: "https://www.techxos.com/pages/digital-marketing",
//     description: "SEO, social media, content marketing"
//   },
//   {
//     name: "Graphic Design",
//     price: "₦250k",
//     duration: "16w",
//     link: "https://www.techxos.com/pages/graphic-design",
//     description: "Adobe Creative Suite, branding, visual design"
//   },
//   {
//     name: "Project Management",
//     price: "₦250k",
//     duration: "16w",
//     link: "https://www.techxos.com/pages/project-mgt",
//     description: "Agile, Scrum, PMP methodologies"
//   },
//   {
//     name: "Data Science",
//     price: "₦250k",
//     duration: "16w",
//     link: "https://www.techxos.com/pages/data-science",
//     description: "Data analysis, visualization, statistics"
//   }
// ];

// async function crawlWebsite(url: string): Promise<WebsiteCache['structuredData']> {
//   try {
//     const res = await fetch(url);
//     const html = await res.text();
//     const $ = cheerio.load(html);

//     // Extract structured data
//     const courses: Course[] = [];
    
//     // Try multiple selectors to find course information
//     $('.course-card, .course-item, .course, [data-course]').each((i, el) => {
//       const course: Course = {
//         name: $(el).find('.course-title, .title, h2, h3').first().text().trim(),
//         price: $(el).find('.course-price, .price, [data-price]').first().text().trim(),
//         duration: $(el).find('.course-duration, .duration, [data-duration]').first().text().trim(),
//         link: $(el).find('a').attr('href') || '',
//         description: $(el).find('.course-description, .description, p').first().text().trim()
//       };
//       if (course.name) courses.push(course);
//     });

//     // If no courses found, use fallback data
//     if (courses.length === 0) {
//       console.log("No courses found in website, using fallback data");
//       return {
//         courses: FALLBACK_COURSES,
//         contact: {
//           email: 'sales@techxos.com',
//           phone: '',
//           address: 'Techxos Headquarters, Lagos, Nigeria'
//         }
//       };
//     }

//     // Extract contact information
//     const contact = {
//       email: $('a[href^="mailto:"]').first().text().trim() || 'sales@techxos.com',
//       phone: $('a[href^="tel:"]').first().text().trim() || '',
//       address: $('.address, .location, [data-address]').first().text().trim() || 'Techxos Headquarters, Lagos, Nigeria'
//     };

//     return {
//       courses,
//       contact
//     };
//   } catch (error) {
//     console.error("Error crawling website:", error);
//     // Use fallback data on error
//     return {
//       courses: FALLBACK_COURSES,
//       contact: {
//         email: 'sales@techxos.com',
//         phone: '',
//         address: 'Techxos Headquarters, Lagos, Nigeria'
//       }
//     };
//   }
// }

// async function getWebsiteContent(): Promise<WebsiteCache> {
//   const now = Date.now();
//   // Cache for 24 hours
//   if (cachedWebsiteContent && cachedWebsiteContent.expiry > now) {
//     return cachedWebsiteContent;
//   }

//   const structuredData = await crawlWebsite("https://www.techxos.com");
//   const content = structuredData.courses.map(course => 
//     `${course.name}: ${course.description} (${course.price})`
//   ).join('\n');

//   cachedWebsiteContent = {
//     content,
//     structuredData,
//     expiry: now + 24 * 60 * 60 * 1000 // 24 hours
//   };
//   return cachedWebsiteContent;
// }

// export async function POST(req: Request) {
//   try {
//     if (!req.headers.get("content-type")?.includes("application/json")) {
//       return NextResponse.json(
//         { error: "Invalid content type" },
//         { status: 400 }
//       );
//     }

//     const { message, user } = await req.json();
    
//     if (!process.env.GROQ_API_KEY) {
//       throw new Error("GROQ_API_KEY environment variable not configured");
//     }

//     // User greeting logic - only for first chat
//     const userId = user?.id || user?.username || 'anonymous';
//     const isFirstChat = !userFirstChat[userId];
//     let welcomeMessage = "";
    
//     if (isFirstChat) {
//       if (user?.firstName) {
//         welcomeMessage = `Welcome back, ${user.firstName}! How can I help?`;
//       } else if (user?.username) {
//         welcomeMessage = `Hi ${user.username}! How can I assist you?`;
//       } else {
//         welcomeMessage = "How can I assist you today?";
//       }
//       userFirstChat[userId] = true;
//     }

//     // Get website content with structured data
//     const websiteData = await getWebsiteContent();
    
//     const systemMessage = {
//       role: "system",
//       content: `# Wandy's Profile
//       ## Core Identity
//       - Techxos LMS Sales Expert
//       - Next cohort starts: 1 April 2025
//       - Tone: Professional + friendly
//       - Current user: ${user?.firstName || user?.username || "Guest"}
//       - First chat: ${isFirstChat}

//       # Key Data
//       **Courses** (NGN):
//       ${websiteData.structuredData.courses.map(course => 
//         `| ${course.name} | ${course.price} | ${course.duration} | ${course.link} | ${course.description} |`
//       ).join('\n')}

//       **Contact Information**:
//       - Email: ${websiteData.structuredData.contact.email}
//       - Phone: ${websiteData.structuredData.contact.phone}
//       - Address: ${websiteData.structuredData.contact.address}

//       # Conversation Rules
//       1. ${isFirstChat ? `Start with: "${welcomeMessage}"` : 'Skip welcome message and respond directly to the query'}
//       2. When discussing courses, ALWAYS include:
//          - Course name
//          - Price
//          - Duration
//          - Description
//          - Course URL (e.g., "You can learn more at http://www.techxos.com/pages/course-name")
//       3. Present links as plain text without formatting or parentheses
//       4. Address users by first name if available, otherwise username
//       5. Never reveal GitHub repository URL
//       6. Keep responses concise and focused
//       7. For any information not in the provided data:
//          - Direct users to sales@techxos.com
//          - Never say "I don't know" or "I'm an AI"
//          - Instead say "For detailed information about this, please contact our sales team at sales@techxos.com"
//       8. Never repeat introductory information
//       9. Don't ask redundant questions or offer to help further unless specifically requested
//       10. Keep responses under 2-3 sentences unless more detail is specifically requested`
//     };

//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 5000); // Reduced timeout for faster response

//     const groqResponse = await fetch(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "llama3-8b-8192",
//           messages: [systemMessage, { role: "user", content: message }],
//           temperature: 0.3,
//           max_tokens: 300, // Increased from 150 to 300 for complete sentences
//           stream: false,
//         }),
//         signal: controller.signal,
//       }
//     );

//     clearTimeout(timeout);

//     const responseText = await groqResponse.text();
//     let data: GroqResponse;
//     try {
//       data = JSON.parse(responseText);
//     } catch (e) {
//       console.error("Invalid JSON from Groq API:", responseText.slice(0, 200));
//       throw new Error(`Received invalid response from AI provider`);
//     }

//     if (!groqResponse.ok) {
//       const errorMessage = data?.error?.message || `Groq API error: ${groqResponse.status}`;
//       throw new Error(errorMessage);
//     }

//     if (!data.choices?.[0]?.message?.content) {
//       throw new Error("Invalid response structure from AI provider");
//     }

//     // Ensure response ends with a complete sentence and fix URL formatting
//     let response = data.choices[0].message.content;
//     if (!response.match(/[.!?]$/)) {
//       response = response.replace(/[^.!?]*$/, '');
//     }
//     // Remove any parentheses around URLs while preserving the URL itself
//     response = response.replace(/\((http[s]?:\/\/[^\s)]+)\)/g, '$1');
//     // Ensure URLs are properly formatted for display
//     response = response.replace(/(http[s]?:\/\/[^\s]+)/g, '$1');

//     return NextResponse.json({ 
//       reply: response
//     });

//   } catch (error: any) {
//     return NextResponse.json(
//       { 
//         error: "chat_error",
//         message: error.message || "Unable to process chat request"
//       },
//       { status: 500 }
//     );
//   }
// }





// import { NextResponse } from "next/server";
// import * as cheerio from "cheerio";

// interface GroqResponse {
//   choices: Array<{
//     message: {
//       content: string;
//     };
//   }>;
//   error?: {
//     message: string;
//   };
// }

// // === ADDED CODE START ===
// // A simple in-memory cache to avoid crawling on every request
// let cachedWebsiteContent: { content: string; expiry: number } | null = null;

// async function crawlWebsite(url: string): Promise<string> {
//   try {
//     const res = await fetch(url);
//     const html = await res.text();
//     const $ = cheerio.load(html);

//     // Extract text from main content paragraphs as an example.
//     // (Customize the selectors as needed to capture relevant info.)
//     let content = "";
//     $("p").each((i, el) => {
//       content += $(el).text() + " ";
//     });

//     // Optionally, you could use a summarization technique here if the text is too long.
//     return content.trim();
//   } catch (error) {
//     console.error("Error crawling website:", error);
//     return "";
//   }
// }

// async function getWebsiteContent(): Promise<string> {
//   const now = Date.now();
//   // Cache for one hour
//   if (cachedWebsiteContent && cachedWebsiteContent.expiry > now) {
//     return cachedWebsiteContent.content;
//   }
//   const content = await crawlWebsite("https://www.techxos.com");
//   cachedWebsiteContent = { content, expiry: now + 60 * 60 * 1000 };
//   return content;
// }
// // === ADDED CODE END ===

// export async function POST(req: Request) {
//   try {
//     if (!req.headers.get("content-type")?.includes("application/json")) {
//       return NextResponse.json(
//         { error: "Invalid content type" },
//         { status: 400 }
//       );
//     }

//     const { message, user } = await req.json();

//     if (!process.env.GROQ_API_KEY) {
//       throw new Error("GROQ_API_KEY environment variable not configured");
//     }

//     // User greeting logic
//     let welcomeMessage = "Hey there, how can I assist you today?";
//     if (user?.firstName) {
//       welcomeMessage = `Welcome back, ${user.firstName}! How can I help?`;
//     } else if (user?.username) {
//       welcomeMessage = `Hi ${user.username}! How can I assist you?`;
//     }

//     const systemMessage = {
//       role: "system",
//       content: `# Wandy's Profile
//       ## Core Identity
//       - Techxos LMS Sales Expert
//       - Next cohort starts: 1 April 2025
//       - Tone: Professional + friendly
//       - Current user: ${user?.firstName || user?.username || "Guest"}

//       # Key Data
//       **Courses** (NGN):
//       | Course | Fee | Duration | Link |
//       |--------|-----|----------|------|
//       | Frontend | ₦150k | 12w | http://www.techxos.com/pages/frontend |
//       | Fullstack | ₦250k | 16w | http://www.techxos.com/pages/fullstack |
//       | Cybersecurity | ₦350k | 16w | http://www.techxos.com/pages/cybersecurity |
//       | Software Development | ₦350k | 16w | http://www.techxos.com/pages/software-devt |
//       | UI-UX Design | ₦150k | 12w | http://www.techxos.com/pages/ui-ux |
//       | Artificial Intelligence | ₦450k | 16w | http://www.techxos.com/pages/ai-ml |
//       | Digital Marketing | ₦150k | 16w | http://www.techxos.com/pages/digital-marketing |
//       | Graphic Design | ₦250k | 16w | http://www.techxos.com/pages/graphic-design |
//       | Project Management | ₦250k | 16w | http://www.techxos.com/pages/project-mgt |
//       | Data Science | ₦250k | 16w | http://www.techxos.com/pages/data-science |

//       **Payment Options**:
//       - 50% initial payment required
//       - Remaining balance + 10% fee due within 30 days
//       - Example: ₦150k course = ₦75k deposit + ₦82.5k final payment

//       **Training Details**:
//       - Modes: Online (Zoom) or On-site (Lagos HQ)
//       - Address: Techxos Headquarters, Lagos, Nigeria
//       - Schedule Options:
//         • Morning: 9:00 AM - 12:00 PM
//         • Afternoon: 1:00 PM - 4:00 PM
//         • Evening: 6:00 PM - 9:00 PM
//       - Max 30-minute breaks between sessions

//       **Requirements**:
//       - Reliable internet connection
//       - Computer: Windows 10/11 or macOS 10.5+

//       **Certification & Resources**:
//       - Certificate of Completion for all courses
//       - Source code: Available via GitHub for enrolled students
//       - Course materials: www.techxos.com/portal

//       **Support**:
//       - Email: <1hr response time
//       - Live Chat: 24/7 for Pro+ members

//       # Conversation Rules
//       1. Start with: "${welcomeMessage}"
//       2. Present links as plain text without formatting
//       3. Address users by first name if available, otherwise username
//       4. Never reveal GitHub repository URL
//       5. Keep responses concise and focused
//       6. Escalate complex requests to sales@techxos.com
//       7. Never repeat introductory information`,
//     };

//     // Retrieve website content and extend system message without modifying existing conversation rules.
//     const websiteContent = await getWebsiteContent();
//     const extendedSystemMessage = {
//       ...systemMessage,
//       content: `${systemMessage.content}

//     # Website Content Snapshot
//     ${
//       websiteContent
//         ? websiteContent.slice(0, 1000)
//         : "Website content unavailable."
//     }`,
//     };

//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 10000);

//     const groqResponse = await fetch(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "llama3-8b-8192",
//           messages: [extendedSystemMessage, { role: "user", content: message }],
//           temperature: 0.3,
//           max_tokens: 300,
//           stream: false,
//         }),
//         signal: controller.signal,
//       }
//     );

//     clearTimeout(timeout);

//     const responseText = await groqResponse.text();
//     let data: GroqResponse;
//     try {
//       data = JSON.parse(responseText);
//     } catch (e) {
//       console.error("Invalid JSON from Groq API:", responseText.slice(0, 200));
//       throw new Error(`Received invalid response from AI provider`);
//     }

//     if (!groqResponse.ok) {
//       const errorMessage =
//         data?.error?.message || `Groq API error: ${groqResponse.status}`;
//       throw new Error(errorMessage);
//     }

//     if (!data.choices?.[0]?.message?.content) {
//       throw new Error("Invalid response structure from AI provider");
//     }

//     return NextResponse.json({
//       reply: data.choices[0].message.content,
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         error: "chat_error",
//         message: error.message || "Unable to process chat request",
//       },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";

// interface GroqResponse {
//   choices: Array<{
//     message: {
//       content: string;
//     };
//   }>;
//   error?: {
//     message: string;
//   };
// }

// export async function POST(req: Request) {
//   try {
//     if (!req.headers.get("content-type")?.includes("application/json")) {
//       return NextResponse.json(
//         { error: "Invalid content type" },
//         { status: 400 }
//       );
//     }

//     const { message, user } = await req.json();

//     if (!process.env.GROQ_API_KEY) {
//       throw new Error("GROQ_API_KEY environment variable not configured");
//     }

//     // User greeting logic
//     let welcomeMessage = "How can I assist you today?";
//     if (user?.firstName) {
//       welcomeMessage = `Welcome back, ${user.firstName}! How can I help?`;
//     } else if (user?.username) {
//       welcomeMessage = `Hi ${user.username}! How can I assist you?`;
//     }

//     const systemMessage = {
//       role: "system",
//       content: `# Wandy's Profile
//       ## Core Identity
//       - Techxos LMS Sales Expert
//       - Next cohort starts: 1 April 2025
//       - Tone: Professional + friendly
//       - Current user: ${user?.firstName || user?.username || "Guest"}

//       # Key Data
//       **Courses** (NGN):
//       | Course | Fee | Duration | Link |
//       |--------|-----|----------|------|
//       | Frontend | ₦150k | 12w | http://www.techxos.com/pages/frontend |
//       | Fullstack | ₦250k | 16w | http://www.techxos.com/pages/fullstack |
//       | Cybersecurity | ₦350k | 16w | http://www.techxos.com/pages/cybersecurity |
//       | Software Development | ₦350k | 16w | http://www.techxos.com/pages/software-devt |
//       | UI-UX Design | ₦150k | 12w | http://www.techxos.com/pages/ui-ux |
//       | Artificial Intelligence | ₦450k | 16w | http://www.techxos.com/pages/ai-ml |
//       | Digital Marketing | ₦150k | 16w | http://www.techxos.com/pages/digital-marketing |
//       | Graphic Design | ₦250k | 16w | http://www.techxos.com/pages/graphic-design |
//       | Project Management | ₦250k | 16w | http://www.techxos.com/pages/project-mgt |
//       | Data Science | ₦250k | 16w | http://www.techxos.com/pages/data-science |

//       **Payment Options**:
//       - 50% initial payment required
//       - Remaining balance + 10% fee due within 30 days
//       - Example: ₦150k course = ₦75k deposit + ₦82.5k final payment

//       **Training Details**:
//       - Modes: Online (Zoom) or On-site (Lagos HQ)
//       - Address: Techxos Headquarters, Lagos, Nigeria
//       - Schedule Options:
//         • Morning: 9:00 AM - 12:00 PM
//         • Afternoon: 1:00 PM - 4:00 PM
//         • Evening: 6:00 PM - 9:00 PM
//       - Max 30-minute breaks between sessions

//       **Requirements**:
//       - Reliable internet connection
//       - Computer: Windows 10/11 or macOS 10.5+

//       **Certification & Resources**:
//       - Certificate of Completion for all courses
//       - Source code: Available via GitHub for enrolled students
//       - Course materials: www.techxos.com/portal

//       **Support**:
//       - Email: <1hr response time
//       - Live Chat: 24/7 for Pro+ members

//       # Conversation Rules
//       1. Start with: "${welcomeMessage}"
//       2. Present links as plain text without formatting
//       3. Address users by first name if available, otherwise username
//       4. Never reveal GitHub repository URL
//       5. Keep responses concise and focused
//       6. Escalate complex requests to sales@techxos.com
//       7. Never repeat introductory information`
//     };

//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 10000);

//     const groqResponse = await fetch(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "llama3-8b-8192",
//           messages: [systemMessage, { role: "user", content: message }],
//           temperature: 0.3,
//           max_tokens: 300,
//           stream: false,
//         }),
//         signal: controller.signal,
//       }
//     );

//     clearTimeout(timeout);

//     const responseText = await groqResponse.text();
//     let data: GroqResponse;
//     try {
//       data = JSON.parse(responseText);
//     } catch (e) {
//       console.error("Invalid JSON from Groq API:", responseText.slice(0, 200));
//       throw new Error(`Received invalid response from AI provider`);
//     }

//     if (!groqResponse.ok) {
//       const errorMessage = data?.error?.message || `Groq API error: ${groqResponse.status}`;
//       throw new Error(errorMessage);
//     }

//     if (!data.choices?.[0]?.message?.content) {
//       throw new Error("Invalid response structure from AI provider");
//     }

//     return NextResponse.json({
//       reply: data.choices[0].message.content
//     });

//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         error: "chat_error",
//         message: error.message || "Unable to process chat request"
//       },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";

// interface GroqResponse {
//   choices: Array<{
//     message: {
//       content: string;
//     };
//   }>;
//   error?: {
//     message: string;
//   };
// }

// export async function POST(req: Request) {
//   try {
//     // Validate request format
//     if (!req.headers.get("content-type")?.includes("application/json")) {
//       return NextResponse.json(
//         { error: "Invalid content type" },
//         { status: 400 }
//       );
//     }

//     const { message } = await req.json();

//     // Validate environment configuration
//     if (!process.env.GROQ_API_KEY) {
//       throw new Error("GROQ_API_KEY environment variable not configured");
//     }

//     // System message template
//     const systemMessage = {
//       role: "system",
//       content: `# Wandy's Profile
//       ## Core Identity
//       - Techxos LMS Sales Expert
//       - Tone: Professional + friendly

//       # Key Data
//       **Courses** (NGN):
//       | Course | Fee | Duration | Link |
//       |--------|-----|----------|------|
//       | Frontend | ₦150k | 12w | http://www.techxos.com/pages/frontend |
//       | Fullstack | ₦250k | 16w | http://www.techxos.com/pages/fullstack |
//       | Cybersecurity | ₦350k | 16w | http://www.techxos.com/pages/cybersecurity |
//       | Software Development | ₦350k | 16w | http://www.techxos.com/pages/software-devt |
//       | UI-UX Design | ₦150k | 12w | http://www.techxos.com/pages/ai-ml |
//       | Artificial Intelligence | ₦450k | 16w | http://www.techxos.com/pages/ui-ux |
//       | Digital Marketing | ₦250k | 16w | http://www.techxos.com/pages/graphic-design |
//       | Graphic Design | ₦250k | 16w | http://www.techxos.com/pages/graphic design |
//       | Project Management | ₦250k | 16w | http://www.techxos.com/pages/project-mgt |
//       | Digital Marketing | ₦150k | 16w | http://www.techxos.com/pages/digital-marketing |
//       | Data Science | ₦250k | 16w | http://www.techxos.com/pages/data-science |

//       **Support**:
//       - Email: <1hr response
//       - Chat: 24/7 for Pro+

//       # Rules
//       1. ALWAYS use course data from table
//       2. Redirect to www.techxos.com/about for guides
//       3. Escalate to sales@techxos.com for:
//         - Custom solutions
//         - Enterprise pricing
//         - Bulk enrollments`
//     };

//     // API call with timeout protection
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 10000);

//     const groqResponse = await fetch(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "llama3-8b-8192",
//           messages: [systemMessage, { role: "user", content: message }],
//           temperature: 0.3,
//           max_tokens: 300,
//           stream: false,
//         }),
//         signal: controller.signal,
//       }
//     );

//     clearTimeout(timeout);

//     // Handle non-JSON responses
//     const responseText = await groqResponse.text();
//     let data: GroqResponse;
//     try {
//       data = JSON.parse(responseText);
//     } catch (e) {
//       console.error("Invalid JSON from Groq API:", responseText.slice(0, 200));
//       throw new Error(`Received invalid response from AI provider`);
//     }

//     // Handle API errors
//     if (!groqResponse.ok) {
//       const errorMessage = data?.error?.message || `Groq API error: ${groqResponse.status}`;
//       throw new Error(errorMessage);
//     }

//     // Validate response structure
//     if (!data.choices?.[0]?.message?.content) {
//       throw new Error("Invalid response structure from AI provider");
//     }

//     return NextResponse.json({
//       reply: data.choices[0].message.content
//     });

//   } catch (error: any) {
//     // Consistent error format
//     return NextResponse.json(
//       {
//         error: "chat_error",
//         message: error.message || "Unable to process chat request"
//       },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     console.log("Received request");
//     const { message } = await req.json();
//     console.log("Processing message:", message);

//     const systemMessage = {
//       role: "system",
//             content: `# Wandy's Profile
//       ## Core Identity
//       - Techxos LMS Sales Expert
//       - Tone: Professional + friendly

//       # Key Data
//       **Courses** (NGN):
//       | Course | Fee | Duration | Link |
//       |--------|-----|----------|------|
//       | Frontend | ₦150k | 12w | http://www.techxos.com/pages/frontend |
//       | Fullstack | ₦250k | 16w | http://www.techxos.com/pages/fullstack |
//       | Cybersecurity | ₦350k | 16w | http://www.techxos.com/pages/cybersecurity |
//       | Software Development | ₦350k | 16w | http://www.techxos.com/pages/software-devt |
//       | UI-UX Design | ₦150k | 12w | http://www.techxos.com/pages/ai-ml |
//       | Artificial Intelligence | ₦450k | 16w | http://www.techxos.com/pages/ui-ux |
//       | Digital Marketing | ₦250k | 16w | http://www.techxos.com/pages/graphic-design |
//       | Graphic Design | ₦250k | 16w | http://www.techxos.com/pages/graphic design |
//       | Project Management | ₦250k | 16w | http://www.techxos.com/pages/project-mgt |
//       | Digital Marketing | ₦150k | 16w | http://www.techxos.com/pages/digital-marketing |
//       | Data Science | ₦250k | 16w | http://www.techxos.com/pages/data-science |

//       **Support**:
//       - Email: <1hr response
//       - Chat: 24/7 for Pro+

//       # Rules
//       1. ALWAYS use course data from table
//       2. Redirect to www.techxos.com/about for guides
//       3. Escalate to sales@techxos.com for:
//         - Custom solutions
//         - Enterprise pricing
//         - Bulk enrollments`,
//     };

//     const response = await fetch(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "llama3-8b-8192",
//           messages: [systemMessage, { role: "user", content: message }],
//           temperature: 0.3,
//           max_tokens: 300, // Increased for better responses
//           stream: false,
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         `Groq API error: ${response.status} - ${
//           errorData?.error?.message || "Unknown error"
//         }`
//       );
//     }

//     const data = await response.json();
//     return NextResponse.json({ reply: data.choices[0].message.content });
//   } catch (error: any) {
//     console.error("API error:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { message } = await req.json();

//     const response = await fetch(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         },
//         // Modify the Groq API call body:
//         body: JSON.stringify({
//           model: "llama3-8b-8192",
//           messages: [
//             {
//               role: "system",
//               content: `You are Wandy, the AI sales expert for Techxos. Focus on helping with:
//               - Course creation and management
//               - Student enrollment processes
//               - Reporting and analytics features
//               - LMS technical requirements
//               - Course Enrollment fees (Frontend-Development: N150,000, Fullstack-Development: N250,000, Cybersecurity: N250,000,  Enterprise: Custom)
//               - Integration capabilities (Zoom, Stripe, Google Workspace)
//               - Support: email support <1hr response, 24/7 chat support for Pro+
//               - Always be polite and encourage users to visit docs.techxos.com for guides
//               - For sales: Connect to sales@techxos.com`,
//             },
//             { role: "user", content: message },
//           ],
//           temperature: 0.3, // Lower temp for structured data
//           max_tokens: 120,  // Enforce concise responses
//           response_format: { type: "json_object" } // Optional for structured output
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Groq API error: ${response.status}`);
//     }

//     const data = await response.json();
//     const content = data.choices[0].message.content;
//     return NextResponse.json({ reply: content }, { status: 200 });
//   } catch (error) {
//     console.error("API error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   try {
//     const { message } = await req.json();

//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: "llama3-8b-8192",
//         messages: [{ role: "user", content: message }],
//         temperature: 0.7,
//         max_tokens: 500
//       })
//     });

//     if (!response.ok) {
//       throw new Error(`Groq API error: ${response.status}`);
//     }

//     const data = await response.json();
//     const content = data.choices[0].message.content;
//     return NextResponse.json({ reply: content }, { status: 200 });
//   } catch (error) {
//     console.error("API error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
