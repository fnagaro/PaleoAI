import { GoogleGenAI } from "@google/genai";
import { TranscriptionRequest } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert paleographer and historian specializing in 16th and 17th-century Spanish colonial manuscripts, specifically those found in the Archivo General de Indias.

Your task is to transcribe the provided image exactly as it is written.
1. Preserve archaic spelling (e.g., "vuestra merced", "tierra", archaic abbreviations).
2. If a word is abbreviated in the manuscript (e.g., "dho" for "dicho", "V.M." for "Vuestra Merced"), expand it in brackets like this: d[ich]o, V[uestra] M[erced], or keep it as is if commonly understood.
3. Maintain line breaks where possible to match the image structure.
4. If a word is illegible, mark it as [illegible].
5. Do not add conversational filler. Output only the transcription.
6. If the image is not a document, state that you cannot transcribe it.
`;

export const transcribeImage = async (request: TranscriptionRequest): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Using gemini-3-pro-preview for best vision capabilities on complex handwriting
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: request.mimeType,
              data: request.base64Image,
            },
          },
          {
            text: "Transcribe this historical Spanish manuscript text found in the Archivo de Indias.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Low temperature for factual transcription
      },
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("No transcription could be generated.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};