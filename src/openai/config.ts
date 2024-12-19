import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment variables.");
}

export const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
