import { GoogleGenAI } from "@google/genai";
import { ReadingCard } from "../lib/tarot";

const DEFAULT_API_KEY = process.env.GEMINI_API_KEY;

export async function* streamTarotInterpretation(
  question: string,
  spreadType: string,
  cards: ReadingCard[],
  lang: string = 'en',
  options?: { model?: string; apiKey?: string }
) {
  const apiKey = options?.apiKey || DEFAULT_API_KEY;
  const modelName = options?.model || "gemini-3-flash-preview";

  if (!apiKey) {
    yield lang === 'vi' ? "Lỗi: Chưa cấu hình Gemini API key." : "Error: Gemini API key is not configured.";
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  const cardsDescription = cards.map(c => 
    `${c.positionName}: ${c.name[lang as 'en' | 'vi']} ${c.isReversed ? (lang === 'vi' ? '(Ngược)' : '(Reversed)') : (lang === 'vi' ? '(Xuôi)' : '(Upright)')}`
  ).join(", ");

  const prompt = `You are a professional, deep, and insightful tarot reader.
  RESPOND ENTIRELY IN ${lang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.
  
  The user is asking: "${question}"
  Spread type: ${spreadType}
  Cards drawn: ${cardsDescription}

  Guidelines:
  - Generate a deep, insightful interpretation in a natural, human-like tone. 
  - Connect the cards together logically. 
  - Avoid vague answers or repetition. 
  - End with clear, actionable advice.
  - Use markdown for formatting.`;

  try {
    const stream = await ai.models.generateContentStream({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
      }
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    yield lang === 'vi' 
      ? "\n\nĐã xảy ra lỗi khi tạo lời giải. Vui lòng thử lại hoặc kiểm tra API key của bạn."
      : "\n\nAn error occurred while generating the interpretation. Please try again or check your API key.";
  }
}

export function getChatSession(
  readingContext: string,
  lang: string = 'en',
  options?: { model?: string; apiKey?: string }
) {
  const apiKey = options?.apiKey || DEFAULT_API_KEY;
  const modelName = options?.model || "gemini-3-flash-preview";

  if (!apiKey) {
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  return ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: lang === 'vi' 
        ? `Bạn là Oracle vừa thực hiện trải bài Tarot sau: "${readingContext}". Hãy trả lời các câu hỏi tiếp theo dựa trên bối cảnh này bằng tiếng Việt.`
        : `You are the Oracle that just provided this tarot reading: "${readingContext}". Please answer follow-up questions based on this context and interpretation.`
    }
  });
}
