import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Chat } from "@/models/chat";

export async function GET(_request: Request, { params }: { params: Promise<{ chatId: string }> }) {
  try {
    const { chatId } = await params;
    await connectDB();
    const chat = await Chat.findOne({ chatId }).lean();
    return NextResponse.json({ messages: chat?.messages ?? [] });
  } catch (error) {
    console.error("GET /api/chat/[chatId] error:", error);
    return NextResponse.json({ messages: [] });
  }
}