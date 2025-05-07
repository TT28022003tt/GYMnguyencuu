import { callGemini } from '@/app/lib/gemini/client';
import { buildPrompt } from '@/app/lib/gemini/promptBuilder';
import { parseGeminiResponse } from '@/app/lib/gemini/responseParser';
import { formatMetrics } from '@/app/lib/metrics/formatMetrics';
import { logDebug } from '@/app/lib/utils/logger';
import { validateChatInput } from '@/app/lib/utils/validate';
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/utils/Auth';
import prisma from '../../../../prisma/client';

export async function POST(req: NextRequest) {
  const { metrics, question, publicData, currentDate } = await req.json();
  const user = await getUser(req);

  let requestType: 'program' | 'thucdon' | 'lichtap' | 'free' | 'hlv' | 'lophoc' | 'goitap' | 'thehoivien';
  const lowerQuestion = question.toLowerCase();
  if (metrics && (lowerQuestion.includes('chương trình tập') || lowerQuestion.includes('tạo chương trình'))) {
    requestType = 'program';
  } else if (metrics && (lowerQuestion.includes('thực đơn') || lowerQuestion.includes('dinh dưỡng'))) {
    requestType = 'thucdon';
  } else if (metrics && (lowerQuestion.includes('lịch tập') || lowerQuestion.includes('buổi tập'))) {
    requestType = 'lichtap';
  } else if (lowerQuestion.includes('huấn luyện viên') || lowerQuestion.includes('hlv')) {
    requestType = 'hlv';
  } else if (lowerQuestion.includes('lớp học') || lowerQuestion.includes('lớp')) {
    requestType = 'lophoc';
  } else if (lowerQuestion.includes('gói tập') || lowerQuestion.includes('gói')) {
    requestType = 'goitap';
  } else if (lowerQuestion.includes('thẻ hội viên') || lowerQuestion.includes('thẻ')) {
    requestType = 'thehoivien';
  } else {
    requestType = 'free';
  }

  const validation = validateChatInput(metrics, question, requestType);
  if (!validation.isValid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API Key không được cấu hình');
    }

    let chatHistory: string = '';
    let chatMessages: any[] = [];
    if (user?.idUser) {
      const messages = await prisma.chatmessage.findMany({
        where: { idUser: user.idUser },
        orderBy: { Timestamp: 'asc' },
        take: 10,
      });
      chatMessages = messages.map(m => ({
        from: m.from,
        text: m.Text,
        timestamp: m.Timestamp,
      }));
      chatHistory = chatMessages.map(m => `${m.from === 'user' ? 'Người dùng' : 'Bot'}: ${m.text}`).join('\n');
    }

    const metricsText = metrics ? formatMetrics(metrics) : '';

    // Sử dụng currentDate từ request hoặc ngày hiện tại
    const effectiveDate = currentDate || new Date().toISOString().split('T')[0];

    const prompt = buildPrompt(metricsText, question, requestType, publicData, chatHistory, user, effectiveDate);
    const replyText = await callGemini(prompt, apiKey);

    logDebug('Phản hồi từ Gemini', replyText);

    // Truyền idMaHV từ metrics nếu có, nếu không thì 0
    const idMaHV = metrics?.data?.idMaHV || 0;
    const result = parseGeminiResponse(replyText, idMaHV, requestType, effectiveDate);

    if (user?.idUser) {
      const botMessage = { from: 'bot', text: result.reply, timestamp: new Date() };
      const userMessage = { from: 'user', text: question, timestamp: new Date() };
      await prisma.chatmessage.createMany({
        data: [
          {
            idUser: user.idUser,
            from: userMessage.from,
            Text: userMessage.text,
            Timestamp: userMessage.timestamp,
          },
          {
            idUser: user.idUser,
            from: botMessage.from,
            Text: botMessage.text,
            Timestamp: botMessage.timestamp,
          },
        ],
      });
    }

    logDebug('Dữ liệu trả về từ /api/chat', result);

    return NextResponse.json({
      ...result,
      canSave: !!user?.idUser,
      userRole: user?.VaiTro || 'guest',
    });
  } catch (err) {
    logDebug('Gemini API error', err);
    let errorMessage = 'Gemini không phản hồi';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}