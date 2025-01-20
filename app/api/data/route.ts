import { getConversations } from "@/data/conversations";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userid");
    const data = await getConversations(userId || "");
    return NextResponse.json(data);
}