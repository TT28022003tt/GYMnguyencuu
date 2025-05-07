export function parseGeminiResponse(
  replyText: string,
  idMaHV: number,
  requestType: 'program' | 'thucdon' | 'lichtap' | 'free' | 'hlv' | 'lophoc' | 'goitap' | 'thehoivien',
  currentDate: string = new Date().toISOString().split('T')[0]
): any {
  try {
    const cleanedText = replyText.replace(/```json\n|\n```/g, '').trim();
    const result = JSON.parse(cleanedText);

    if (!result.reply) {
      throw new Error('Phản hồi thiếu trường reply');
    }

    const today = new Date(currentDate);
    const minDate = today.toISOString().split('T')[0];

    if (requestType === 'program' && result.program?.chiTietMucTieu) {
      let currentWeek = 1;
      result.program.chiTietMucTieu.forEach((phase: any) => {
        const weeks = parseInt(phase.ThoiGian) || 4;
        phase.ThoiGian = `Tuần ${currentWeek}-${currentWeek + weeks - 1}`;
        currentWeek += weeks;
      });
      result.program.MaHV = idMaHV;
    }

    if (requestType === 'thucdon' && result.thucdon?.chiTietThucDon) {
      let startDate = new Date(result.thucdon.NgayBatDau);
      if (startDate < today) {
        startDate = today;
        result.thucdon.NgayBatDau = minDate;
      }
      result.thucdon.chiTietThucDon.forEach((day: any) => {
        const dayDate = new Date(day.Ngay);
        if (dayDate < today) {
          day.Ngay = minDate;
        }
      });
      result.thucdon.MaHV = idMaHV;
    }

    if (requestType === 'lichtap' && result.lichtap) {
      result.lichtap = result.lichtap.map((schedule: any) => {
        const startDate = new Date(schedule.NgayGioBatDau);
        const endDate = new Date(schedule.NgayGioKetThuc);
        if (startDate < today) {
          const timePart = schedule.NgayGioBatDau.split('T')[1] || '08:00:00Z';
          schedule.NgayGioBatDau = `${minDate}T${timePart}`;
        }
        if (endDate < today) {
          const timePart = schedule.NgayGioKetThuc.split('T')[1] || '09:30:00Z';
          schedule.NgayGioKetThuc = `${minDate}T${timePart}`;
        }
        return {
          ...schedule,
          MaHV: idMaHV,
        };
      });
    }

    return result;
  } catch (err) {
    let errorMessage: string;
    switch (requestType) {
      case 'program':
        errorMessage = 'Không thể tạo chương trình tập do lỗi xử lý phản hồi.';
        break;
      case 'thucdon':
        errorMessage = 'Không thể tạo thực đơn do lỗi xử lý phản hồi.';
        break;
      case 'lichtap':
        errorMessage = 'Không thể tạo lịch tập do lỗi xử lý phản hồi.';
        break;
      default:
        errorMessage = replyText || 'Xin lỗi, không thể xử lý yêu cầu. Vui lòng thử lại!';
    }

    return {
      reply: errorMessage,
      program: null,
      thucdon: null,
      lichtap: null,
    };
  }
}