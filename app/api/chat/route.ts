import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
// import { pipeline } from "@huggingface/transformers";
import { HfInference } from '@huggingface/inference';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const hf = new HfInference(process.env.HF_TOKEN);

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});
const index = pinecone.index('docrux');

export async function GET(req: Request){
    try {
        console.log("checkpoint-1");
        const { searchParams } = new URL(req.url);
        const user = searchParams.get("user");
        const query = searchParams.get("query");

        // const embedder = await pipeline("feature-extraction", "sentence-transformers/all-MiniLM-L6-v2");
        if(!query){
            return new Response(JSON.stringify({ error: "No Query Provided" }), {
                status: 400,
            });
        }
        console.log("checkpoint-2");

        const embed_query = await hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: query,
        })

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
        // const embeddings = await embedder(query);

        // const newArray = embeddings.tolist();
        // const pooledEmbedding = newArray[0].reduce((acc: number[], row: number[]) => 
        //     acc.map((value, index) => value + row[index] / newArray[0].length), 
        //     new Array(384).fill(0)
        // );

        console.log("checkpoint-3");
        const response = await index.query({
            topK: 2,
            vector: queryEmbedding,
            includeValues: true,
            includeMetadata: true,
            filter: { user }
        });

        let text = "";
        for(let i = 0; i < response.matches.length; i++){
            text += response.matches[i]?.metadata?.text;
        }

        console.log("checkpoint-4");
        const promt = text + " " + query;
        const data = await groq.chat.completions.create({
            messages: [
              {
                role: "user",
                content: promt,
              },
            ],
            model: "llama-3.3-70b-versatile",
            max_tokens: 300,
        });
        console.log("checkpoint-5");

        return NextResponse.json(data.choices[0].message.content);
    } catch (error) {
        return NextResponse.json("error occured!");
    }
}