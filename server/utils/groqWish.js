import { Groq } from "groq-sdk";

let groqClient = null;

/**
 * Get or create the Groq client (lazy initialization so dotenv loads first).
 */
function getGroq() {
  if (!groqClient) {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      throw new Error("GROQ_API_KEY not configured");
    }
    groqClient = new Groq({ apiKey: groqApiKey });
  }
  return groqClient;
}

/**
 * Generate a personalized Diwali wish using Groq AI based on name and birthdate.
 * Falls back to template-based generation if Groq is unavailable or fails.
 */
export async function generateAIPersonalizedWish({
  recipientName,
  birthdate,
  zodiacSign,
  luckyColor,
  luckyNumber,
  luckyFlower,
  personalityTrait,
  language = "en",
  theme = "royal-gold",
}) {
  const zodiacDisplayName = {
    aries: "Aries",
    taurus: "Taurus",
    gemini: "Gemini",
    cancer: "Cancer",
    leo: "Leo",
    virgo: "Virgo",
    libra: "Libra",
    scorpio: "Scorpio",
    sagittarius: "Sagittarius",
    capricorn: "Capricorn",
    aquarius: "Aquarius",
    pisces: "Pisces",
  }[zodiacSign] || zodiacSign;

  const age = Math.floor(
    (new Date() - new Date(birthdate)) / (365.25 * 24 * 60 * 60 * 1000),
  );

  const systemPrompt = `You are DiwaliWish, a premium, warm, and festive Diwali greeting generator. 
Create a personalized, heartfelt Diwali wish for someone based on their details.

Guidelines:
- Write in ${language === "en" ? "English" : language}
- Tone: warm, personal, festive, elegant (like lighting a diya for a loved one)
- Mention their zodiac sign (${zodiacDisplayName}) and lucky details naturally
- Include a fun prediction for the coming year
- Include lucky color (${luckyColor}), lucky number (${luckyNumber}), lucky flower (${luckyFlower})
- Include personality trait (${personalityTrait})
- Age: ${age} years old
- Theme: ${theme}
- No emojis, no hashtags, no excessive punctuation
- Keep it under 200 words
- Structure: greeting + wish message + prediction + lucky details sign-off
- Make it feel like it was written just for ${recipientName}`;

  const userPrompt = `Generate a personalized Diwali wish for:
Name: ${recipientName}
Birthdate: ${birthdate}
Zodiac Sign: ${zodiacDisplayName}
Age: ${age}
Lucky Color: ${luckyColor}
Lucky Number: ${luckyNumber}
Lucky Flower: ${luckyFlower}
Personality Trait: ${personalityTrait}
Theme: ${theme}
Language: ${language}`;

  try {
    const completion = await getGroq().chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from Groq");

    return parseAIWishResponse(content, {
      recipientName,
      zodiacSign: zodiacDisplayName,
      luckyColor,
      luckyNumber,
      luckyFlower,
      personalityTrait,
    });
  } catch (error) {
    console.error("Groq AI error:", error.message);
    throw error;
  }
}

/**
 * Parse the AI response into structured wish parts.
 */
function parseAIWishResponse(content, details) {
  const {
    recipientName,
    zodiacSign,
    luckyColor,
    luckyNumber,
    luckyFlower,
    personalityTrait,
  } = details;

  const greeting = `Happy Diwali, ${recipientName}!`;

  return {
    recipientName,
    zodiacSign,
    luckyColor,
    luckyNumber,
    luckyFlower,
    personalityTrait,
    wishMessage: `${greeting}\n\n${content}`,
    prediction: content,
    generatedBy: "groq-ai",
  };
}
