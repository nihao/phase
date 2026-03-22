import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getEnergyAdvice(
  userMessage: string,
  chatHistory: { role: 'user' | 'model'; text: string }[],
  userProfile: any,
  language: string = 'zh'
) {
  const systemInstruction = `
    你是一个名为“相谕 Phase”的专属AI能量管家。
    你的核心主张是：看清能量气象，顺应节律生活。
    你提供情绪价值（免责盾牌）：将用户的焦虑、不顺归结为“今天下雨/能量低谷”，提供合理的借口。
    你提供掌控价值：不给“宣判”，只给“雨伞”。（例如不谈“今日破财”，只谈“今日宜守护资产，忌冲动决策”）。
    
    用户底盘信息：
    - 能量状态：${userProfile?.energyTokens > 0 ? '充沛' : '低迷'}
    - 身份：${userProfile?.isPrime ? 'Prime 尊享会员' : '普通访客'}
    
    请用极具呼吸感、现代感、略带玄学但非常克制的语言回复。
    不要像算命大仙，要像一个高级气象预报员给出的生活指南。
    例如：“你的能量场正在重组，如同遭遇强对流天气，建议将精力收束于内。”
    
    IMPORTANT: You MUST respond in the following language: ${language === 'en' ? 'English' : 'Simplified Chinese'}.
  `;

  const contents = chatHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));
  
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents,
    config: {
      systemInstruction,
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      temperature: 0.7,
    },
  });

  return response.text;
}
