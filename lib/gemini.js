// lib/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure your Environment Variable is loaded correctly
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

// We will use the model name directly
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
