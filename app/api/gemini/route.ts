// app/api/gemini/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    
    // Define an array of models to try
    const modelsToTry = ["gemini-2.5-flash", "gemini-3-flash-preview"];
    let result;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        break; // If success, exit loop
      } catch (err) {
        console.log(`Model ${modelName} failed, trying next...`);
        continue; // If fail, try next model
      }
    }

    if (!result) throw new Error("All models failed");
    
    return NextResponse.json({ text: (await result.response).text() });
  } catch (error) {
    return NextResponse.json({ error: "Service busy, please try again." }, { status: 500 });
  }
}
