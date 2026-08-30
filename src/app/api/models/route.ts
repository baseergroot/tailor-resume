import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables" }, { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Google API error: ${response.status} ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    const rawModels: Array<{ name: string; displayName?: string; description?: string; supportedGenerationMethods?: string[] }> = data.models || [];
    
    const generateContentModels = rawModels
      .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m) => ({
        id: m.name.replace("models/", ""),
        fullName: m.name,
        displayName: m.displayName || m.name.replace("models/", ""),
        description: m.description,
        supportedMethods: m.supportedGenerationMethods,
      }));

    return NextResponse.json({
      count: generateContentModels.length,
      models: generateContentModels,
    });
  } catch (error) {
    console.log("error fetching models: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



