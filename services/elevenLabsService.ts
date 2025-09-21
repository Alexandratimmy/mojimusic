import type { Song } from '../types';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

interface ElevenLabsMusicRequest {
  text: string;
  duration_seconds?: number;
  prompt_influence?: number;
  style?: string;
  title?: string;
}

interface ElevenLabsMusicResponse {
  audio_url: string;
  generation_id: string;
  status: string;
}

export const generateMusicWithElevenLabs = async (
  lyrics: string,
  style: string,
  duration: number = 180,
  title?: string
): Promise<string> => {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key is not configured');
  }

  try {
    const requestBody: ElevenLabsMusicRequest = {
      text: lyrics || `Create an instrumental ${style} track`,
      duration_seconds: Math.min(Math.max(duration, 30), 300), // Clamp between 30-300 seconds
      prompt_influence: 0.7,
      style: style,
      title: title
    };

    const response = await fetch(`${ELEVENLABS_BASE_URL}/music/generate`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data: ElevenLabsMusicResponse = await response.json();
    
    // If the response includes a generation ID, we might need to poll for completion
    if (data.status === 'processing') {
      return await pollForCompletion(data.generation_id);
    }
    
    return data.audio_url;
  } catch (error) {
    console.error('Error generating music with ElevenLabs:', error);
    throw new Error('Failed to generate music. Please try again.');
  }
};

const pollForCompletion = async (generationId: string, maxAttempts: number = 30): Promise<string> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(`${ELEVENLABS_BASE_URL}/music/generate/${generationId}`, {
        headers: {
          'Accept': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY!
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to check generation status: ${response.status}`);
      }

      const data: ElevenLabsMusicResponse = await response.json();
      
      if (data.status === 'completed' && data.audio_url) {
        return data.audio_url;
      } else if (data.status === 'failed') {
        throw new Error('Music generation failed');
      }
      
      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Polling attempt ${attempt + 1} failed:`, error);
      if (attempt === maxAttempts - 1) {
        throw error;
      }
    }
  }
  
  throw new Error('Music generation timed out');
};

export const getMusicGenerationStatus = async (generationId: string): Promise<ElevenLabsMusicResponse> => {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key is not configured');
  }

  const response = await fetch(`${ELEVENLABS_BASE_URL}/music/generate/${generationId}`, {
    headers: {
      'Accept': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get generation status: ${response.status}`);
  }

  return await response.json();
};