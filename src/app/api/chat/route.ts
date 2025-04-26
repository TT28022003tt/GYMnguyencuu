import { callGemini } from '@/app/lib/gemini/client';
import { buildPrompt } from '@/app/lib/gemini/promptBuilder';
import { parseGeminiResponse } from '@/app/lib/gemini/responseParser';
import { formatMetrics } from '@/app/lib/metrics/formatMetrics';
import { logDebug } from '@/app/lib/utils/logger';
import { validateChatInput } from '@/app/lib/utils/validate';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  const { metrics, question } = await req.json();

  // Xác định requestType dựa trên câu hỏi
  let requestType: 'program' | 'thucdon' | 'lichtap';
  const lowerQuestion = question.toLowerCase();
  if (lowerQuestion.includes('lịch tập') || lowerQuestion.includes('buổi tập')) {
    requestType = 'lichtap';
  } else if (lowerQuestion.includes('thực đơn') || lowerQuestion.includes('dinh dưỡng')) {
    requestType = 'thucdon';
  } else {
    requestType = 'program';
  }

  const validation = validateChatInput(metrics, question, requestType);
  if (!validation.isValid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API Key không được cấu hình');
    }

    const metricsText = formatMetrics(metrics);
    const prompt = buildPrompt(metricsText, question, requestType);
    const replyText = await callGemini(prompt, apiKey);

    logDebug('Phản hồi từ Gemini', replyText);

    const result = parseGeminiResponse(replyText, metrics.data.idMaHV, requestType);

    logDebug('Dữ liệu trả về từ /api/chat', result);

    return NextResponse.json(result);
  } catch (err) {
    logDebug('Gemini API error', err);
    let errorMessage = 'Gemini không phản hồi';
  if (err instanceof Error) {
    errorMessage = err.message;
  }

  return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}