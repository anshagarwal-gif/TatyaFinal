import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

export interface SoilData {
  ph: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  organicMatter: string;
}

export interface WeatherData {
  temp: string;
  rainfall: string;
  humidity: string;
  forecast: string;
}

export const analyzeCropIssue = async (imageBase64: string, mimeType: string): Promise<string> => {
  // const model = "gemini-3-flash-preview"; // OLD: Retired or 429
  const model = "gemini-2.5-flash"; // NEW: Active & Stable
  
  const prompt = `You are an expert agricultural scientist specializing in Indian farming conditions. 
  Analyze this image of a crop problem. 
  1. Identify the issue (disease, pest, or nutrient deficiency).
  2. Provide a detailed explanation of why it occurred.
  3. Suggest practical solutions tailored for Indian farmers.
  4. Include specific chemical dosages (if applicable) and application methods.
  5. Suggest organic/natural alternatives if available.
  6. Provide preventative measures for the future.
  
  Format your response in clear Markdown with headings.`;

  const response = await ai.models.generateContent({
    model,
    contents: [ // Added [] brackets here to fix SDK requirement
      {
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          { text: prompt }
        ]
      }
    ]
  });

  return response.text || "Sorry, I couldn't analyze the image.";
};

export const getAgriRecommendations = async (soil: SoilData, weather: WeatherData): Promise<string> => {
  const model = "gemini-2.5-flash"; 
  
  const prompt = `You are an expert agricultural advisor for Indian farmers. 
  Based on the following data, provide tailored recommendations:
  
  SOIL DATA:
  - pH: ${soil.ph}
  - Nitrogen (N): ${soil.nitrogen}
  - Phosphorus (P): ${soil.phosphorus}
  - Potassium (K): ${soil.potassium}
  - Organic Matter: ${soil.organicMatter}
  
  WEATHER DATA:
  - Current Temperature: ${weather.temp}°C
  - Rainfall: ${weather.rainfall}
  - Humidity: ${weather.humidity}%
  - Forecast: ${weather.forecast}
  
  Please provide:
  1. Planting recommendations (suitable crops for these conditions).
  2. Irrigation schedule based on weather and soil.
  3. Fertilizer application plan (specific to the NPK levels).
  4. Pest and disease risk assessment for the current weather.
  
  Context: Focus on Indian agricultural practices, seasons (Kharif/Rabi/Zaid), and locally available resources.
  Format your response in clear Markdown.`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }]
  });

  return response.text || "Sorry, I couldn't generate recommendations.";
};

export const chatWithAssistant = async (
  message: string, 
  image?: { data: string, mimeType: string },
  fieldContext?: { location?: string, crop?: string, plantingDate?: string }
): Promise<string> => {
  const model = "gemini-2.5-flash"; 
  
  const systemInstruction = `You are Tatya — India’s first public-led agriculture AI operator.
You are a field-experienced agriculture operator, drone expert, and brutally honest mentor.

CORE PERSONALITY RULES
- Serious agriculture/business: Direct, Analytical, short answers.
- Basic/Silly: Sarcastic. Use Marathi mhani ONLY if poked.

LANGUAGE RULE
COMPULSORY: Always respond in Marathi (Devanagari). 
Even if the user provides context in English, your response must be 100% Marathi.
Use advanced agricultural terminology in Marathi.

LIVE DATA & TOOLS
You have access to Google Search. Use it to get LIVE weather data, market prices, and latest pest outbreaks based on the user's location.

AGRICULTURE PRIORITY
- Advanced Diagnosis: Use field context (crop, date, location) and symptoms to provide precise chemical/organic solutions.
- Advisory: Provide seasonal planning, irrigation schedules, and ROI calculations for drone spraying.

ENDING STYLE RULE
End with a Marathi punch line like: “काम करा, वेळ घालवू नका.” or “नियोजन करा, प्रगती करा.”`;

  let fullMessage = message;
  if (fieldContext) {
    fullMessage = `[FIELD CONTEXT: Location: ${fieldContext.location || 'Unknown'}, Crop: ${fieldContext.crop || 'Not specified'}, Planting Date: ${fieldContext.plantingDate || 'Not specified'}]
    
    User Message: ${message}`;
  }

  const parts: any[] = [{ text: fullMessage }];
  if (image) {
    parts.unshift({
      inlineData: {
        data: image.data,
        mimeType: image.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts }],
    config: {
      systemInstruction,
      // tools: [{ googleSearch: {} }], // Commented out to save quota and prevent 429
    }
  });

  return response.text || "I'm not sure how to respond to that.";
};