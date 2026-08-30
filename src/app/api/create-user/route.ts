import connectDB from "@/lib/db";
import { User } from "@/models/user";
import { NextResponse } from "next/server";


export async function GET() {

  await connectDB()

  const userExist = await User.findById("6a943e00e48d6112e9120932")
  if (userExist) return NextResponse.json({ message: "User already exist", userExist })

  const user = await User.create({
    clerkUserId: "baseer",
    firstName: "baseer",
    lastName: "groot",
    email: "iuiug" 
  })

  return NextResponse.json(user)
}