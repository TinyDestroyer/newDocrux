import { NextResponse } from "next/server"
import { Pinecone } from '@pinecone-database/pinecone';
import { HfInference } from '@huggingface/inference';
import Groq from "groq-sdk";

const hf = new HfInference(process.env.HF_TOKEN);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function GET(req : Request){
    const { searchParams } = new URL(req.url);
    console.log("shubh");
    const query = searchParams.get("query") || "";

    const embed_query = await hf.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: query,
    }).catch((error) => {
        console.error("Error during Hugging Face feature extraction:", error);
        throw error;
    });

    const data = await groq.chat.completions.create({
            messages: [
              {
                role: "user",
                content: query,
              },
            ],
            model: "llama-3.3-70b-versatile",
            max_tokens: 300,
        });
    return NextResponse.json(data.choices[0].message.content);
}