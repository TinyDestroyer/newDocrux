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
  try {
    console.log("upload point1");
    const formData = await req.formData();
    const user = formData.get("user");
    const files = formData.getAll("files");

    if (!user || typeof user!== "string") {
      return new Response(JSON.stringify({ error: "No username provided" }), {
        status: 400,
      });
    }

    let data : any = [];
    console.log("upload point2");
    // const embedder = await pipeline("feature-extraction", "sentence-transformers/all-MiniLM-L6-v2");

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
        //   const embeddings = await embedder(sentences[i]);

        //   const newArray = embeddings.tolist();
        //   const pooledEmbedding = newArray[0].reduce((acc: number[], row: number[]) => 
        //     acc.map((value, index) => value + row[index] / newArray[0].length), 
        //     new Array(384).fill(0)
        //   );
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
    }
    console.log("upload point3");
    if(data.length > 0){
      try {
        await index.upsert(data);
      } catch (error) {
        console.error("Error upserting vectors:", error);
      }
    }
    console.log("upload point4");
    const imgData = await  fetch('http://127.0.0.1:5000/pdf-img', {
          method: 'POST',
          body: formData,
    });
    const imgs = await imgData.json();
    
    return NextResponse.json({"images" : imgs});

  } catch (error) {
    return NextResponse.json("error Occured");
  }
}