import { getSingleConversation } from "@/data/conversations";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const data = await getSingleConversation(conversationId || "");
    return NextResponse.json(data);
}