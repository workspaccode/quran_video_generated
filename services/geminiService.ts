import { GoogleGenAI, Type } from "@google/genai";
import { VideoMetadata } from "../types";

// Helper to get client with current key
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const generateVideoPromptsAndMetadata = async (topic: string, style: string): Promise<VideoMetadata> => {
  const ai = getClient();
  
  const prompt = `
    You are an expert content creator for Islamic YouTube Shorts. 
    The user wants a video about: "${topic}".
    The visual style should be: "${style}".

    1. Create a detailed visual prompt for a video generation AI (Veo). It should describe a background scene suitable for overlaying Quranic text. NO TEXT in the video itself. Focus on nature, light, mosques, or abstract peaceful patterns. 
    2. Create a YouTube Title (catchy, short).
    3. Create a YouTube Description (include a relevant Quranic translation or quote if applicable to the topic).
    4. Create 5-10 hashtags.

    Return JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          visualPrompt: { type: Type.STRING, description: "Prompt for Veo video generator" },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          quranTranslation: { type: Type.STRING, description: "Relevant quote/verse" },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["visualPrompt", "title", "description", "tags"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate metadata");
  
  return JSON.parse(text) as VideoMetadata;
};

export const generateVeoVideo = async (visualPrompt: string): Promise<string> => {
  const ai = getClient();
  
  // We use Veo fast for preview/speed, aimed at Shorts (9:16)
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: visualPrompt,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: '9:16' // Vertical for Shorts
    }
  });

  // Poll for completion
  while (!operation.done) {
    // Wait 10 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) {
    throw new Error("Video generation failed or returned no URI");
  }

  return videoUri;
};

export const fetchVideoBlob = async (uri: string): Promise<string> => {
    // Veo URIs require the API key appended
    const apiKey = process.env.API_KEY;
    const response = await fetch(`${uri}&key=${apiKey}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
};
