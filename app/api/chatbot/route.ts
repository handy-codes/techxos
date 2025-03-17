import OpenAI from 'openai';
import { NextResponse } from 'next/server';

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check if OPENAI_API_KEY is present
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing. Skipping API call.");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are Emy, a helpful AI tutor. Keep responses concise and educational. Format answers using markdown where appropriate."
        },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const reply = completion.choices[0].message.content;
    return NextResponse.json({ reply }, { status: 200 });
    
  } catch (error: any) {
    console.error('OpenAI API error:', error);

    if (error.message === "OpenAI API key is missing. Skipping API call.") {
      return NextResponse.json({ 
        reply: "Sorry, my chatbot model is currently under training for improved user-experience. Please try again later."
      }, { status: 500 });
    }

    if (error.code === 'insufficient_quota') {
      return NextResponse.json({ 
        reply: "I'm currently experiencing high demand and have reached my limit. Please try again later."
      }, { status: 429 }); // Use 429 status code for Too Many Requests
    }

    return NextResponse.json({ 
      reply: "Sorry, I'm experiencing technical difficulties. Please try again later."
    }, { status: 500 });
  }
}