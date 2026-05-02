import { GoogleGenAI } from "@google/genai";
import { ReadingCard } from "../lib/tarot";

// In Vite, environment variables should be prefixed with VITE_ to be exposed to the client.
// However, AI Studio uses process.env. GEMINI_API_KEY is usually provided by the platform.
const DEFAULT_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

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
  options?: { model?: string; apiKey?: string; history?: { role: 'user' | 'model'; content: string }[] }
) {
  const apiKey = options?.apiKey || DEFAULT_API_KEY;
  const modelName = options?.model || "gemini-3-flash-preview";

  if (!apiKey) {
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const history = options?.history?.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  })) || [];

  return ai.chats.create({
    model: modelName,
    history: history,
    config: {
      systemInstruction: lang === 'vi' 
        ? `Bạn là Nhà Tiên Tri (Oracle) vừa thực hiện trải bài Tarot sau: "${readingContext}". 
           Nhiệm vụ của bạn:
           1. Trả lời các câu hỏi về trải bài này một cách trọng tâm, sát nghĩa và sâu sắc.
           2. Tránh nói dài dòng, lan man. Hãy đi thẳng vào vấn đề cốt lõi của lá bài và câu hỏi của người dùng.
           3. Luôn giữ phong thái huyền bí, tôn nghiêm nhưng dễ hiểu.
           4. Sử dụng tiếng Việt.`
        : `You are the Oracle that just provided this tarot reading: "${readingContext}". 
           Your tasks:
           1. Answer follow-up questions accurately, insightfully, and with focus.
           2. Be concise and stay on point. Do not wander into unrelated topics.
           3. Maintain a mystical, professional, yet clear tone.`
    }
  });
}
