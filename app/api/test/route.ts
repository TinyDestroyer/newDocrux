import { NextResponse } from "next/server"

export async function GET(req : Request){
    const { searchParams } = new URL(req.url);
    console.log("shubh");
    const user = searchParams.get("query");
    return NextResponse.json(user);
}