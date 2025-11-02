
import { GoogleGenAI } from "@google/genai";
import type { Article } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const buildPrompt = (article: Article): string => {
  const bodyContent = article.sections.map(section => 
    `${section.heading}\n${section.points.map(p => `- ${p}`).join('\n')}`
  ).join('\n\n');

  return `
Based on the following article content, write a new, short, and compelling conclusion. 
The conclusion must be a single paragraph. 
It should summarize the key benefit of the service and end with a strong call-to-action encouraging the user to visit pngtopdff.com.
Do not just rephrase the existing conclusion. Be creative and persuasive.

--- ARTICLE CONTENT ---

Title: ${article.title}

Introduction: ${article.introduction}

Body:
${bodyContent}
--- END ARTICLE CONTENT ---

New Conclusion:
  `;
};

export const generateConclusion = async (article: Article): Promise<string> => {
  try {
    const prompt = buildPrompt(article);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    
    const text = response.text.trim();
    if (!text) {
      throw new Error("The AI returned an empty response.");
    }
    return text;

  } catch (error) {
    console.error("Error generating conclusion with Gemini API:", error);
    if (error instanceof Error) {
        return `Error: Could not generate conclusion. ${error.message}`;
    }
    return "Error: An unknown error occurred while generating the conclusion.";
  }
};
