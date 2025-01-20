import { db } from "@/lib/db";
import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
    try {
        // Get authenticated user
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userid");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Get form data
        const formData = await req.formData()
        const title = formData.get('title') as string
        const files = formData.getAll('files') as File[]

        if (!files.length) {
            return new NextResponse("At least one file is required", { status: 400 })
        }

        // Upload all files and gather their data
        const uploadPromises = files.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
    
            const uploadResult: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "raw" },
                (error, result) => {
                if (error) return reject(error);
                resolve(result);
                }
            );
            uploadStream.end(buffer);
            });
    
            // File URL from Cloudinary
            const fileUrl = uploadResult.secure_url;
            console.log("File uploaded successfully:", fileUrl);
            return {
                name: file.name,
                url: fileUrl,
                size: file.size,
                type: file.type
            }
        })

        const uploadedFiles = await Promise.all(uploadPromises)

        // Create conversation with all files
        const conversation = await db.conversation.create({
            data: {
                title,
                userId,
                files: {
                    create: uploadedFiles
                }
            },
            include: {
                files: true
            }
        })
        const response = await fetch("http://localhost:3000/api/upload", {
            method: "POST",
            body: formData,
        });

  
      return NextResponse.json(response)
  
    } catch (error) {
      console.error('[FILE_UPLOAD]', error)
      return new NextResponse("Internal Error", { status: 500 })
    }
  }