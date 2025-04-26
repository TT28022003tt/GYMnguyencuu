export interface ProgramResponse {
    reply: string;
    program: {
      TenCTT: string;
      MucTieu: string;
      ThoiGian: string;
      MaHV: number;
      chiTietMucTieu: { ThoiGian: string; MoTa: string }[];
    };
  }
  
  export interface ThucDonResponse {
    reply: string;
    thucdon: {
      TenThucDon: string;
      SoCalo: number;
      NgayBatDau: string;
      MaHV: number;
      chiTietThucDon: { Ngay: string; buaan: { TenBua: string; MoTa: string }[] }[];
    };
  }
  
  export interface LichTapResponse {
    reply: string;
    lichtap: {
      NgayGioBatDau: string;
      NgayGioKetThuc: string;
      MaHV: number;
      MaHLV: number | null;
      idMaGT: number | null;
      idMaCTT: number | null;
      idMaLH: number | null;
      GhiChu: string;
      baitap: { TenBaiTap: string; NhomCo: string; SoRep: number; SoSet: number; MoTa: string }[];
    }[];
  }
  
  export function parseGeminiResponse(replyText: string, idMaHV: number, requestType: 'program' | 'thucdon' | 'lichtap'): ProgramResponse | ThucDonResponse | LichTapResponse {
    const jsonMatch = replyText.match(/```json\n([\s\S]*?)\n```/) || replyText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error('Không tìm thấy JSON trong phản hồi');
    }
  
    const result = JSON.parse(jsonMatch[1] || jsonMatch[0]);
  
    if (requestType === 'lichtap') {
      if (!result.lichtap || !Array.isArray(result.lichtap) || result.lichtap.length === 0) {
        throw new Error('Lịch tập rỗng hoặc không hợp lệ');
      }
  
      const maxLength = 255;
      for (const schedule of result.lichtap) {
        schedule.MaHV = idMaHV;
        if (!schedule.NgayGioBatDau || !schedule.NgayGioKetThuc || !schedule.baitap || !Array.isArray(schedule.baitap) || schedule.baitap.length < 3) {
          throw new Error('Lịch tập thiếu thông tin hoặc ít hơn 3 bài tập');
        }
        if (schedule.GhiChu && schedule.GhiChu.length > maxLength) {
          schedule.GhiChu = schedule.GhiChu.substring(0, maxLength - 3) + '...';
        }
        for (const bt of schedule.baitap) {
          if (!bt.TenBaiTap || !bt.NhomCo || !bt.SoRep || !bt.SoSet || !bt.MoTa) {
            throw new Error('Bài tập thiếu thông tin');
          }
          if (bt.MoTa.length > maxLength) {
            bt.MoTa = bt.MoTa.substring(0, maxLength - 3) + '...';
          }
        }
      }
  
      return result as LichTapResponse;
    } else if (requestType === 'thucdon') {
      result.thucdon.MaHV = idMaHV;
  
      if (!result.thucdon.chiTietThucDon || !Array.isArray(result.thucdon.chiTietThucDon) || result.thucdon.chiTietThucDon.length < 3) {
        throw new Error('chiTietThucDon phải có ít nhất 3 ngày');
      }
  
      const maxMoTaLength = 255;
      for (const detail of result.thucdon.chiTietThucDon) {
        if (!detail.Ngay || !detail.buaan || !Array.isArray(detail.buaan) || detail.buaan.length < 3) {
          throw new Error('Chi tiết thực đơn thiếu Ngay hoặc ít hơn 3 bữa ăn');
        }
        for (const bua of detail.buaan) {
          if (!bua.TenBua || !bua.MoTa) {
            throw new Error('Bữa ăn thiếu TenBua hoặc MoTa');
          }
          if (bua.MoTa.length > maxMoTaLength) {
            bua.MoTa = bua.MoTa.substring(0, maxMoTaLength - 3) + '...';
          }
        }
      }
  
      return result as ThucDonResponse;
    }
  
    // Logic cho chương trình tập
    result.program.MaHV = idMaHV;
  
    if (!result.program.chiTietMucTieu || !Array.isArray(result.program.chiTietMucTieu) || result.program.chiTietMucTieu.length === 0) {
      throw new Error('chiTietMucTieu rỗng hoặc không hợp lệ');
    }
  
    const maxMoTaLength = 1000;
    for (const detail of result.program.chiTietMucTieu) {
      if (!detail.ThoiGian || !detail.MoTa) {
        throw new Error('Chi tiết mục tiêu thiếu ThoiGian hoặc MoTa');
      }
      if (detail.MoTa.length > maxMoTaLength) {
        detail.MoTa = detail.MoTa.substring(0, maxMoTaLength - 3) + '...';
      }
    }
  
    return result as ProgramResponse;
  }