

import { GoogleGenAI, Type } from "@google/genai";
import type { Song } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const schema = {
  type: Type.OBJECT,
  properties: {
    title: { 
      type: Type.STRING,
      description: "A creative and catchy song title that strongly reflects the provided lyrics and style."
    },
    description: { 
      type: Type.STRING,
      description: "A detailed, vivid description of the song's musical composition, instrumentation, mood, and progression, like a music critic. Mention specific instruments, BPM, and key."
    },
    duration: { 
      type: Type.INTEGER,
      description: "A plausible song duration in seconds (between 30 and 360)."
    },
    albumArtPrompt: {
      type: Type.STRING,
      description: "A detailed, imaginative prompt for an image generation model to create album art that visually represents the song's mood, style, and themes. Describe the scene, colors, and artistic style."
    }
  },
  required: ['title', 'description', 'duration', 'albumArtPrompt']
};

export const generateSongDetails = async (lyrics: string, style: string, isInstrumental: boolean, title?: string, duration?: number, tempo?: number, musicalKey?: string): Promise<Partial<Omit<Song, 'albumArtUrl'>> & { albumArtPrompt: string }> => {
  const prompt = `
    You are an expert AI music producer and creative director. Your task is to generate compelling metadata for a new song based on the user's input.

    User's Input:
    ${title ? `- Title: "${title}"` : ''}
    - Style: "${style}"
    - Lyrics: ${lyrics ? `"${lyrics}"` : "The user wants an instrumental track."}
    - Is Instrumental: ${isInstrumental}
    ${duration ? `- Desired Duration: Around ${duration} seconds.` : ''}
    ${tempo ? `- Desired Tempo: ${tempo} BPM.` : ''}
    ${musicalKey ? `- Desired Musical Key: ${musicalKey}.` : ''}

    Your instructions:
    1.  **Title:** ${title ? `Use the user-provided title exactly: "${title}".` : "Create a creative and memorable song title that strongly reflects the provided lyrics and style. It should be evocative and catchy."}
    2.  **Description:** Write a detailed and vivid musical description, like a professional music critic.
        - Mention specific instruments (e.g., "haunting piano melody", "thumping 808 bass", "shimmering synth pads").
        - Describe the song's mood, atmosphere, and progression (e.g., "starts with a melancholic intro, builds to a powerful, uplifting chorus").
        - ${tempo && musicalKey ? `**Crucially, the description must state the song is in ${musicalKey} at approximately ${tempo} BPM.**` : "If applicable, mention the BPM and musical key."}
    3.  **Duration:** Provide a plausible song duration in seconds. ${duration ? `The duration must be very close to the requested ${duration} seconds.` : "The duration should be between 120 and 360 seconds."}
    4.  **Album Art Prompt:** Generate a detailed, imaginative prompt for an image generation model (like Imagen) to create album art. This prompt should visually represent the song's mood, style, and lyrical themes. ${title ? `The album art should strongly reflect the title "${title}".` : ''} Describe the desired scene, color palette, artistic style (e.g., "oil painting", "photorealistic", "abstract digital art"), and overall feeling.

    Generate a JSON object with these details.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const songData = JSON.parse(jsonText);
    
    return {
      title: songData.title,
      description: songData.description,
      duration: songData.duration,
      style: style,
      albumArtPrompt: songData.albumArtPrompt,
    };
  } catch (error) {
    console.error("Error generating song details with Gemini:", error);
    throw new Error("Failed to generate song details. Please try again.");
  }
};

export const generateAlbumArt = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
            return imageUrl;
        } else {
            // Fallback image if generation returns no images
            console.warn("Image generation returned no images, using fallback.");
            return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/200`;
        }
    } catch (error) {
        console.error("Error generating album art with Gemini:", error);
        // Fallback image on error
        throw new Error("Failed to generate album art. Please try again.");
    }
};

export const generateLyrics = async (style: string): Promise<string> => {
  const lyricsSchema = {
    type: Type.OBJECT,
    properties: {
      lyrics: {
        type: Type.STRING,
        description: "The generated song lyrics, including verses and a chorus. Should be formatted with line breaks, without labels like (Verse 1) or (Chorus)."
      }
    },
    required: ['lyrics']
  };

  const prompt = `
    You are a creative songwriter AI. Your task is to generate lyrics for a song.

    Instructions:
    - Generate two verses and a chorus based on the following style and mood.
    - Style & Mood: "${style || 'an upbeat pop song'}"
    - The lyrics should be concise, evocative, and fit the specified mood.
    - **Crucially, do not include section labels like "(Verse 1)", "(Chorus)", etc.** Just provide the raw lyric text with line breaks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: lyricsSchema,
        temperature: 0.9,
      },
    });
    
    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    return data.lyrics || '';
  } catch (error) {
    console.error("Error generating lyrics with Gemini:", error);
    throw new Error("Failed to generate lyrics. Please try again.");
  }
};