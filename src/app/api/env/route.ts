import getEnv from "@/helper/env";
import { NextResponse } from "next/server";


export async function GET() {
  return NextResponse.json({
    env: getEnv
  })
}