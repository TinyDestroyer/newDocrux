import { NextResponse } from "next/server"
import { Pinecone } from '@pinecone-database/pinecone';
import { HfInference } from '@huggingface/inference';
import Groq from "groq-sdk";

const hf = new HfInference(process.env.HF_TOKEN);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});
const index = pinecone.index('docrux');

export async function GET(req : Request){
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const user = searchParams.get("user");

    const embed_query = await hf.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: query,
    }).catch((error) => {
        console.error("Error during Hugging Face feature extraction:", error);
        throw error;
    });

    let queryEmbedding: number[];

    if (Array.isArray(embed_query) && Array.isArray(embed_query[0])) {
            // If it's a nested array, take the first array
            queryEmbedding = embed_query[0] as number[];
        } else if (Array.isArray(embed_query)) {
            // If it's already a flat array
            queryEmbedding = embed_query as number[];
        } else {
            // If it's a single number (shouldn't happen with this model)
            queryEmbedding = [embed_query as number];
        }

        const response = await index.query({
            topK: 2,
            vector: queryEmbedding,
            includeValues: true,
            includeMetadata: true,
            filter: { user }
        });
        console.log(response.matches[0].metadata?.text);
        let text = "";
        for(let i = 0; i < response.matches.length; i++){
            text += response.matches[i]?.metadata?.text;
        }
        const prompt = text + "," + query;
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