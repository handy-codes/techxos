import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        // Modify the Groq API call body:
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `You are Wandy, the AI assistant for Techxos LMS. Focus on helping with:
              - Course creation and management
              - Student enrollment processes
              - Reporting and analytics features
              - LMS technical requirements
              - Subscription plans (Basic: $99/mo, Pro: $299/mo, Enterprise: Custom)
              - Integration capabilities (Zoom, Stripe, Google Workspace)
              - Support: email support <1hr response, 24/7 chat support for Pro+
              - Always be polite and encourage users to visit docs.techxos.com for guides
              - For sales: Connect to sales@techxos.com`,
            },
            { role: "user", content: message },
          ],
          temperature: 0.5, // Lower for more factual responses
          max_tokens: 300,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    return NextResponse.json({ reply: content }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
