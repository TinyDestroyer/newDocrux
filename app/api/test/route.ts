import { NextResponse } from "next/server"
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function GET(req : Request){
    const { searchParams } = new URL(req.url);
    console.log("shubh");
    const query = searchParams.get("query");
    const prompt = "" + query;
    const data = await groq.chat.completions.create({
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            model: "llama-3.3-70b-versatile",
            max_tokens: 300,
        });
    return NextResponse.json(data.choices[0].message.content);
}