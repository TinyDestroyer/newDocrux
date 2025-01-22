import pdf from "pdf-parse";
import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN);

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});
const index = pinecone.index('docrux');

export const runtime = 'nodejs';

export async function POST(req: Request){
  const formData = await req.formData();
  const user = formData.get("user");
  const files = formData.getAll("files");
  const conversationId = formData.get("conversationId");

  if (!user || typeof user!== "string") {
    return new Response(JSON.stringify({ error: "No username provided" }), {
      status: 400,
    });
  }

  let data : any = [];

  for(let file of files){
    if(file instanceof File){
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const pdfData = await pdf(buffer);

      const sentences = pdfData.text
      .replace(/\n/g, ' ') // Replace all newlines with spaces
      .split(/(?<=\.)\s+/) // Split by full stop followed by whitespace
      .map((sentence) => sentence.trim()) // Trim whitespace from each sentence
      .filter((sentence) => sentence.length > 0); // Remove empty strings

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
            user,
            conversationId
          }
        };
        data.push(newData);
      }
    }
  }

  if(data.length > 0){
    try {
      await index.upsert(data);
    } catch (error) {
      console.error("Error upserting vectors:", error);
    }
  }
  const imgData = await  fetch('https://docrux.pythonanywhere.com/', {
        method: 'POST',
        body: formData,
  });
  const imgs = await imgData.json();

  return NextResponse.json({"images" : imgs});
}