import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import { HfInference } from '@huggingface/inference';

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
});
const index = pinecone.index('docrux');

const hf = new HfInference(process.env.HF_TOKEN);

export const runtime = 'nodejs';

export async function POST(req: Request){
    try {
        const formData = await req.formData();
        const user = formData.get("user");
        const imgText = formData.get("imgText");

        if(!imgText) return NextResponse.json("No image Text recieved");

        if (!user || typeof user!== "string") {
            return new Response(JSON.stringify({ error: "No username provided" }), {
            status: 400,
            });
        }

        const text = JSON.parse(imgText as string);

        const data : any = [];

        for(let i = 0; i < text.length; i++){
            const sentences = text[i]
            .replace(/\n/g, ' ') // Replace all newlines with spaces
            .split(/(?<=\.)\s+/) // Split by full stop followed by whitespace
            .map((sentence : string) => sentence.trim()) // Trim whitespace from each sentence
            .filter((sentence : string) => sentence.length > 0); // Remove empty strings

            const embeddings = await hf.featureExtraction({
                model: 'sentence-transformers/all-MiniLM-L6-v2',
                inputs: sentences,
            })

            for(let i = 0; i < embeddings.length; i++){
                const newData = {
                    id: `sentence-${Date.now()}-${i}`,
                    values: embeddings[i],
                    metadata:{
                        text: sentences[i],
                        user
                    }
                };
                  data.push(newData);
            }
        }

        if(data.length > 0){
            try {
                await index.upsert(data);
            } catch (error) {
                console.error("Error upserting vectors:", error);
            }
        }

        return NextResponse.json("Uploaded img text Successfully!!");
    } catch (error) {
        return NextResponse.json("error occured in upserting image text");
    }
}