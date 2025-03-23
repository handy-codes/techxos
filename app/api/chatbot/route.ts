import { NextResponse } from "next/server";



export async function POST(req: Request) {
  try {
    console.log("Received request");
    const { message } = await req.json();
    console.log("Processing message:", message);

    const systemMessage = {
      role: "system",
            content: `# Wandy's Profile
      ## Core Identity
      - Techxos LMS Sales Expert
      - Tone: Professional + friendly

      # Key Data
      **Courses** (NGN):
      | Course | Fee | Duration | Link |
      |--------|-----|----------|------|
      | Frontend | ₦150k | 12w | http://www.techxos.com/pages/frontend |
      | Fullstack | ₦250k | 16w | http://www.techxos.com/pages/fullstack |
      | Cybersecurity | ₦350k | 16w | http://www.techxos.com/pages/cybersecurity |
      | Software Development | ₦350k | 16w | http://www.techxos.com/pages/software-devt |
      | UI-UX Design | ₦150k | 12w | http://www.techxos.com/pages/ai-ml |
      | Artificial Intelligence | ₦450k | 16w | http://www.techxos.com/pages/ui-ux |
      | Digital Marketing | ₦250k | 16w | http://www.techxos.com/pages/graphic-design |
      | Graphic Design | ₦250k | 16w | http://www.techxos.com/pages/graphic design |
      | Project Management | ₦250k | 16w | http://www.techxos.com/pages/project-mgt |
      | Digital Marketing | ₦150k | 16w | http://www.techxos.com/pages/digital-marketing |
      | Data Science | ₦250k | 16w | http://www.techxos.com/pages/data-science |

      **Support**:
      - Email: <1hr response
      - Chat: 24/7 for Pro+

      # Rules
      1. ALWAYS use course data from table
      2. Redirect to www.techxos.com/about for guides
      3. Escalate to sales@techxos.com for:
        - Custom solutions
        - Enterprise pricing
        - Bulk enrollments`,
    };

    const response = await fetch(
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
          max_tokens: 300, // Increased for better responses
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Groq API error: ${response.status} - ${
          errorData?.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

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
