import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { metrics, question } = await req.json();

  if (!metrics || !question) {
    return NextResponse.json({ error: 'Vui lòng cung cấp chỉ số và câu hỏi' }, { status: 400 });
  }

  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API Key không được cấu hình');
    }

    // Format metrics for prompt
    let metricsText = '';
    if (metrics.type === 'basic') {
      const { Height, Weight, BMI, Chest, Waist, hips, Arm, Thigh, Calf, Mota } = metrics.data;
      metricsText = `
        Chỉ số cơ bản:
        - Chiều cao: ${Height ? `${Height} cm` : 'N/A'}
        - Cân nặng: ${Weight ? `${Weight} kg` : 'N/A'}
        - BMI: ${BMI ? BMI.toFixed(2) : 'N/A'}
        - Vòng ngực: ${Chest ? `${Chest} cm` : 'N/A'}
        - Vòng eo: ${Waist ? `${Waist} cm` : 'N/A'}
        - Vòng mông: ${hips ? `${hips} cm` : 'N/A'}
        - Vòng bắp tay: ${Arm ? `${Arm} cm` : 'N/A'}
        - Vòng đùi: ${Thigh ? `${Thigh} cm` : 'N/A'}
        - Vòng bắp chân: ${Calf ? `${Calf} cm` : 'N/A'}
        - Mô tả: ${Mota || 'Không có mô tả'}
      `;
    } else {
      const { BodyFatPercent, MuscleMass, VisceralFat, BasalMetabolicRate, BoneMass, WaterPercent, Mota } = metrics.data;
      metricsText = `
        Chỉ số nâng cao:
        - % Mỡ cơ thể: ${BodyFatPercent ? `${BodyFatPercent}%` : 'N/A'}
        - Khối cơ: ${MuscleMass ? `${MuscleMass} kg` : 'N/A'}
        - Mỡ nội tạng: ${VisceralFat ? VisceralFat : 'N/A'}
        - Tỷ lệ trao đổi chất: ${BasalMetabolicRate ? `${BasalMetabolicRate} kcal` : 'N/A'}
        - Khối lượng xương: ${BoneMass ? `${BoneMass} kg` : 'N/A'}
        - % Nước cơ thể: ${WaterPercent ? `${WaterPercent}%` : 'N/A'}
        - Mô tả: ${Mota || 'Không có mô tả'}
      `;
    }

    const prompt = `
      Bạn là một trợ lý sức khỏe AI. Dựa trên các chỉ số sau của người dùng:
      ${metricsText}
      Người dùng yêu cầu: "${question}"
      Hãy tạo một chương trình tập luyện phù hợp, bao gồm:
      - Tên chương trình (TenCTT): Một tên ngắn gọn, phù hợp với mục tiêu (VD: "Chương trình Giảm Cân").
      - Mục tiêu (MucTieu): Mô tả mục tiêu của chương trình (VD: "Giảm mỡ toàn thân").
      - Thời gian (ThoiGian): Khoảng thời gian thực hiện (VD: "8 tuần").
      - Chi tiết mục tiêu (chitietmuctieu): Một danh sách các giai đoạn hoặc bài tập cụ thể, mỗi giai đoạn có:
        - ThoiGian: Thời điểm hoặc tuần (VD: "Tuần 1-2").
        - MoTa: Mô tả đầy đủ các bài tập hoặc kế hoạch, bao gồm tất cả chi tiết như danh sách bài tập, số hiệp, số lần lặp, hoặc lưu ý dinh dưỡng (VD: "Cardio 30 phút, 3 lần/tuần (chạy bộ, đạp xe). Tập tạ 3 hiệp, 12 lần/hiệp. Giảm đường, tăng protein.").
      Trả về định dạng JSON:
      {
        "reply": "Dưới đây là chương trình tập luyện được thiết kế cho bạn:\\n- **Tên chương trình**: {TenCTT}\\n- **Mục tiêu**: {MucTieu}\\n- **Thời gian**: {ThoiGian}\\n- **Chi tiết mục tiêu**:\\n{format chitietmuctieu as bullet points}\\nNếu bạn có vấn đề sức khỏe, hãy tham khảo bác sĩ trước khi bắt đầu.",
        "program": {
          "TenCTT": string,
          "MucTieu": string,
          "ThoiGian": string,
          "MaHV": number,
          "chitietmuctieu": [
            {
              "ThoiGian": string,
              "MoTa": string
            }
          ]
        }
      }
      Trong reply, format chitietmuctieu as bullet points (VD: "- Tuần 1-2: Cardio 30 phút, 3 lần/tuần (chạy bộ, đạp xe)."). Trong program.chitietmuctieu, MoTa phải chứa toàn bộ mô tả chi tiết, bao gồm tất cả bullet points nếu có (VD: "Cardio 30 phút, 3 lần/tuần (chạy bộ, đạp xe). Tập tạ 3 hiệp, 12 lần/hiệp. Giảm đường, tăng protein.").
    `;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
              role: 'user',
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có phản hồi từ AI';

    // Parse JSON from reply
    let result;
    try {
      const jsonMatch = replyText.match(/```json\n([\s\S]*?)\n```/) || replyText.match(/{[\s\S]*}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        result.program.MaHV = metrics.data.idMaHV; // Gán MaHV từ metrics
      } else {
        throw new Error('Không tìm thấy JSON trong phản hồi');
      }
    } catch (err) {
      console.error('Parse JSON error:', err);
      return NextResponse.json({ reply: 'Không thể tạo chương trình tập do lỗi định dạng.' });
    }

    return NextResponse.json({
      reply: result.reply,
      program: result.program,
    });
  } catch (err) {
    console.error('Gemini API error:', err);
    return NextResponse.json({ error: 'Gemini không phản hồi' }, { status: 500 });
  }
}