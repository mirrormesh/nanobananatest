import { GoogleGenAI } from "@google/genai";

export const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
export type ModelType = "gemini-2.5-flash-image" | "gemini-3.1-flash-image-preview";

export interface GenerationConfig {
  prompt: string;
  aspectRatio: AspectRatio;
  model: ModelType;
  negativePrompt?: string;
  numImages?: number;
}

export const generateImage = async (config: GenerationConfig) => {
  const ai = getAI();
  
  const response = await ai.models.generateContent({
    model: config.model,
    contents: {
      parts: [
        { text: config.prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: config.aspectRatio,
      }
    }
  });

  const images: string[] = [];
  
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
      }
    }
  }

  return images;
};
