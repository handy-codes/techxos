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
    $('.course-card, .course-item, .course, [data-course]').each((index: number, element: cheerio.Cheerio) => {
      const course: Course = {
        name: $(element).find('.course-title, .title, h2, h3').first().text().trim(),
        price: $(element).find('.course-price, .price, [data-price]').first().text().trim(),
        duration: $(element).find('.course-duration, .duration, [data-duration]').first().text().trim(),
        link: $(element).find('a').attr('href') || '',
        description: $(element).find('.course-description, .description, p').first().text().trim()
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

      **Contact Information**:
      - Email: ${websiteData.structuredData.contact.email}
      - Phone: ${websiteData.structuredData.contact.phone}
      - Address: ${websiteData.structuredData.contact.address}

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
