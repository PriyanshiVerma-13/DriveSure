
import { GoogleGenAI } from "@google/genai";
import { Car } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getInsuranceAssessment = async (car: Car): Promise<string> => {
  if (!process.env.API_KEY) {
    return Promise.reject(new Error("API key is not configured."));
  }
  
  const prompt = `
    You are an expert car insurance underwriter. 
    Based on the following car details, assess its risk and suggest a fair annual insurance premium.
    Provide a brief justification for your suggestion.
    Format your response as a single paragraph.

    Car Details:
    - Make: ${car.make}
    - Model: ${car.model}
    - Year: ${car.year}
    - Condition: ${car.condition}
    - Price: $${car.price.toLocaleString()}
    - Description: ${car.description}

    Your assessment:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get AI assessment. Please check your API key and connection.");
  }
};
