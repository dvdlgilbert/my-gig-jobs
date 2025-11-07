
import { GoogleGenAI, Type } from "@google/genai";
import type { GigDetails, GigPlan } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const gigPlanSchema = {
  type: Type.OBJECT,
  properties: {
    setlist: {
      type: Type.ARRAY,
      description: "A list of 10-15 song titles, including a mix of originals and covers appropriate for the genre. Structure it like a real setlist with an opener, middle section, and closer.",
      items: { type: Type.STRING },
    },
    banter: {
      type: Type.ARRAY,
      description: "3-5 short, engaging things the artist can say between songs to connect with the audience. Should be tailored to the event type and audience vibe.",
      items: { type: Type.STRING },
    },
    socialMediaPost: {
      type: Type.STRING,
      description: "A short, exciting social media post (approx 280 characters) to promote the gig. Include relevant hashtags.",
    },
  },
  required: ["setlist", "banter", "socialMediaPost"],
};

export const generateGigPlan = async (details: GigDetails): Promise<GigPlan> => {
  const { artistName, venue, eventType, genre, audienceVibe } = details;

  const prompt = `
    You are an expert music manager and creative director for an artist named ${artistName}.
    The artist is playing a gig with the following details:
    - Venue: ${venue}
    - Type of Event: ${eventType}
    - Music Genre: ${genre}
    - Desired Audience Vibe: ${audienceVibe}

    Generate a comprehensive gig plan. The plan must be creative, engaging, and perfectly tailored to the details provided.
    Please provide a setlist, some stage banter ideas, and a social media post to promote the event.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: gigPlanSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedPlan: GigPlan = JSON.parse(jsonText);
    return parsedPlan;

  } catch (error) {
    console.error("Error generating gig plan:", error);
    throw new Error("Failed to generate gig plan. Please check your API key and try again.");
  }
};
