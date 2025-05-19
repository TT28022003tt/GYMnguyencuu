import { Metrics } from '../metrics/types';

export function buildPrompt(
  metricsText: string,
  question: string,
  requestType: 'program' | 'thucdon' | 'lichtap' | 'free' | 'hlv' | 'lophoc' | 'goitap' | 'thehoivien',
  publicData: any,
  chatHistory: string,
  user: any,
  currentDate?: string
): string {
  const chuongtrinhtapList = publicData?.chuongtrinhtap?.map((ct: any) =>
    `- ${ct.TenCTT ?? 'Không tên'}: ${ct.MucTieu ?? 'Không có mục tiêu'}, Thời gian: ${ct.ThoiGian ?? 'Không rõ'}`
  ).join('\n') || 'Không có chương trình tập nào.';

  const goitapList = publicData?.goitap?.map((gt: any) =>
    `- ${gt.Ten}: ${gt.Loai}, Giá: ${gt.Gia}`
  ).join('\n') || 'Không có gói tập nào.';

  const huanluyenvienList = publicData?.huanluyenvien?.map((hlv: any) =>
    `- ${hlv.Ten}: Chuyên môn: ${hlv.ChuyenMon || 'N/A'}, Chứng chỉ: ${hlv.ChungChi || 'N/A'}, Bằng cấp: ${hlv.BangCap || 'N/A'}, Giới tính: ${hlv.GioiTinh || 'N/A'}, SĐT: ${hlv.SoDienThoai || 'N/A'}`
  ).join('\n') || 'Không có huấn luyện viên nào.';

  const lophocList = publicData?.lophoc?.map((lh: any) => {
    const lichHocStr = lh.LichLopHoc?.map((llh: any) =>
      `Thứ ${llh.Thu} - ${llh.GioBatDau}`
    ).join(', ') || 'Chưa có lịch học';
    `- ${lh.Ten ?? 'Không tên'}: Thể loại: ${lh.TheLoai ?? 'N/A'}, Mô tả: ${lh.MoTa ?? 'Không có'}, ` +
      `Bắt đầu: ${lh.ThoiGianBatDau ? new Date(lh.ThoiGianBatDau).toLocaleDateString() : 'Chưa rõ'}, ` +
      `Kết thúc: ${lh.ThoiGianKetThuc ? new Date(lh.ThoiGianKetThuc).toLocaleDateString() : 'Chưa rõ'}, ` +
      `Số lượng: ${lh.DangKy ?? '0/0'}, ` +
      `Học phí: ${lh.Phi ? `${lh.Phi} VNĐ` : 'Miễn phí'}, Thời lượng: ${lh.ThoiLuong ?? 'Không rõ'}` +
      `Phòng: ${lh.Phong ?? 'N/A'}` +
      `Lịch học: ${lichHocStr}`;
  }).join('\n') || 'Không có lớp học nào.';

  const thehoivienList = publicData?.thehoivien?.map((thv: any) =>
    `- Thẻ ${thv.idMaThe}: Tình trạng: ${thv.TinhTrang ?? 'Không rõ'}, Ngày cấp: ${thv.NgayCap ? new Date(thv.NgayCap).toLocaleDateString() : 'Chưa cấp'}, Hết hạn: ${thv.NgayHetHan ? new Date(thv.NgayHetHan).toLocaleDateString() : 'Chưa rõ'}`
  ).join('\n') || 'Không có thẻ hội viên nào.';

  const tomorrow = currentDate
    ? new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() + 1)).toISOString().split('T')[0]
    : new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  const basePrompt = `
    Bạn là một trợ lý sức khỏe AI. Dựa trên lịch sử hội thoại:
    ${chatHistory || 'Không có lịch sử hội thoại.'}
    
    Người dùng hỏi: "${question}"
    
    Thông tin chỉ số (nếu có):
    ${metricsText || 'Không có chỉ số được cung cấp.'}
    
    Dữ liệu công khai:
    - Chương trình tập: ${chuongtrinhtapList}
    - Gói tập: ${goitapList}
    - Huấn luyện viên: ${huanluyenvienList}
    - Lớp học: ${lophocList}
    - Thẻ hội viên: ${thehoivienList}
    
    Ngày hiện tại: ${currentDate || new Date().toISOString().split('T')[0]}
    Khi xử lý yêu cầu liên quan đến thời gian (VD: "ngày mai", "tuần sau", "thứ Tư tuần này", hoặc ngày cụ thể):
    - Sử dụng ngày hiện tại (${currentDate || new Date().toISOString().split('T')[0]}) làm mốc.
    - Nếu người dùng yêu cầu "ngày mai", sử dụng ngày hiện tại + 1 ngày (${tomorrow}).
    - Nếu yêu cầu "tuần sau", sử dụng ngày hiện tại + 7 ngày.
    - Nếu yêu cầu ngày cụ thể (VD: "1/6/2025"), sử dụng ngày đó nếu nó >= ngày hiện tại; nếu không, sử dụng ngày hiện tại và đưa ra thông báo không thể tạo ... trong quá khứ.
    - Không tạo ngày giờ trong quá khứ (trước ${currentDate || new Date().toISOString().split('T')[0]}).
    - Định dạng ngày: YYYY-MM-DD (VD: "${currentDate || new Date().toISOString().split('T')[0]}").
    - Định dạng ngày giờ: YYYY-MM-DDTHH:mm:ssZ (VD: "${currentDate || new Date().toISOString().split('T')[0]}T08:00:00Z").

    Hãy trả lời câu hỏi một cách tự nhiên và hữu ích:
    - Trình bày dễ nhìn ưu tiên các thông tin hiện ra xuống dòng gọn gàng
    - Nếu người dùng hỏi về chương trình tập, thực đơn, lịch tập, lớp học, gói tập, thẻ hội viên đề xuất dựa trên dữ liệu công khai phù hợp hoặc tạo mới nếu người dùng yêu cầu tạo.
    - Nếu có chỉ số (chiều cao, cân nặng, BMI), sử dụng để đưa ra gợi ý cá nhân hóa (VD: BMI < 18.5 thì đề xuất tăng cân, >24.9 thì giảm cân).
    - Nếu hỏi về huấn luyện viên , cung cấp thông tin chi tiết bao gồm tên, giới tính, số điện thoại, chuyên môn, chứng chỉ, bằng cấp. Nếu hỏi cụ thể về HLV nữ, lọc danh sách theo giới tính những tiêu chí khác cũng vậy và nếu không có cứ đề cử các huấn luyện viên khác ưu tiên huấn luyện viên gần với câu hỏi.
    - Nếu hỏi về lớp học(VD: đang có lớp học nào,...), liệt kê các lớp đang mở với thông tin về thể loại, thời gian bắt đầu, số lượng,...
    - Nếu hỏi về gói tập(VD: đang có gói tập nào,...), cung cấp danh sách gói tập với tên, loại, giá, và thời gian hiệu lực,...
    - Nếu hỏi về thẻ hội viên (VD: đang thẻ hội viên gì,...), cung cấp thông tin về tình trạng, ngày cấp, và ngày hết hạn,...
    - Nếu không đăng nhập, thông báo rằng không thể lưu dữ liệu nhưng vẫn có thể tư vấn.
    - Đảm bảo trả lời liền mạch, dựa trên lịch sử hội thoại để nhớ ngữ cảnh (VD: chiều cao, cân nặng đã nhắc trước đó).
    - Đừng nhầm lẫn giữa chương trình tập, thực đơn, lịch tập, lớp học, gói tập, thẻ hội viên nếu người dùng hỏi về cái gì hãy đưa nó lên đầu tiên và đề xuất thêm 1 số cái liên quan phía sau
  `;

  if (requestType === 'program') {
    return `
      ${basePrompt}
      Hãy tạo một chương trình tập luyện phù hợp với mục tiêu (VD: tăng cơ, giảm mỡ,...). Chương trình cần:
      - Tên chương trình (TenCTT): Tên ngắn gọn, mô tả mục tiêu.
      - Mục tiêu (MucTieu): Mô tả mục tiêu tổng thể.
      - Thời gian (ThoiGian): Tổng thời gian (VD: "12 tuần").
      - Chi tiết mục tiêu (chiTietMucTieu): Danh sách các giai đoạn, mỗi giai đoạn có:
        - ThoiGian: Định dạng "Tuần X-Y" (VD: "Tuần 1-4", "Tuần 5-8", "Tuần 9-12").
        - MoTa: Mô tả chi tiết.
      Trả về định dạng JSON:
      {
        "reply": "Dưới đây là chương trình tập luyện được thiết kế cho bạn:\\n- **Tên chương trình**: {TenCTT}\\n- **Mục tiêu**: {MucTieu}\\n- **Thời gian**: {ThoiGian}\\n- **Chi tiết mục tiêu**:\\n{format chiTietMucTieu as bullet points}\\nNếu bạn có vấn đề sức khỏe, hãy tham khảo bác sĩ trước khi bắt đầu.",
        "program": {
          "TenCTT": "Tên chương trình",
          "MucTieu": "Mô tả mục tiêu",
          "ThoiGian": "Tổng thời gian",
          "MaHV": number,
          "chiTietMucTieu": [
            {
              "ThoiGian": "Tuần X-Y",
              "MoTa": "Mô tả giai đoạn"
            }
          ]
        },
        "thucdon": null,
        "lichtap": null
      }
    `;
  }

  if (requestType === 'thucdon') {
    return `
      ${basePrompt}
      Hãy tạo một thực đơn phù hợp với mục tiêu (VD: tăng cơ, giảm mỡ hoặc phù hợp với chương trình tập ở trên) và ngày bắt đầu dựa trên yêu cầu thời gian trong câu hỏi (${question}) . Thực đơn cần:
      - Tên thực đơn (TenThucDon): Tên ngắn gọn, mô tả mục tiêu.
      - Tổng calo (SoCalo): Ước lượng tổng calo mỗi ngày kiểu number.
      - Ngày bắt đầu (NgayBatDau): Định dạng YYYY-MM-DD , >= ${currentDate || new Date().toISOString().split('T')[0]}, dựa trên yêu cầu (VD: "ngày mai" thì dùng ${tomorrow}) .
      - Chi tiết thực đơn (chiTietThucDon): Danh sách các ngày, mỗi ngày có 3-6 bữa ăn, mỗi bữa có tên (TenBuaAn) và mô tả (MoTa).
      Trả về định dạng JSON:
      {
        "reply": "Dưới đây là thực đơn được thiết kế cho bạn:\\n- **Tên thực đơn**: {TenThucDon}\\n- **Tổng calo**: {SoCalo} kcal/ngày\\n- **Ngày bắt đầu**: {NgayBatDau}\\n- **Chi tiết thực đơn**:\\n{format chiTietThucDon as bullet points}\\nLưu ý: Đây chỉ là thực đơn gợi ý, bạn có thể điều chỉnh phù hợp với nhu cầu cá nhân.",
        "program": null,
        "thucdon": {
          "TenThucDon": "Tên thực đơn",
          "SoCalo": number,
          "NgayBatDau": "YYYY-MM-DD",
          "MaHV": number,
          "chiTietThucDon": [
            {
              "Ngay": "YYYY-MM-DD",
              "buaAn": [
                {
                  "TenBua": "Tên bữa ăn",
                  "MoTa": "Mô tả bữa ăn"
                }
              ]
            }
          ]
        },
        "lichtap": null
      }
    `;
  }

  if (requestType === 'lichtap') {
    return `
      ${basePrompt}
      Hãy tạo một lịch tập luyện phù hợp với mục tiêu (VD: thân dưới, toàn thân,hoặc phù hợp với chương trình tập ở trên) cho ngày dựa trên yêu cầu thời gian trong câu hỏi (${question}). Lịch tập cần:
      - Ngày giờ bắt đầu (NgayGioBatDau): Định dạng YYYY-MM-DDTHH:mm:ssZ, >= ${currentDate || new Date().toISOString().split('T')[0]}, dựa trên yêu cầu (VD: "ngày mai" thì dùng ${tomorrow}).
      - Ngày giờ kết thúc (NgayGioKetThuc): Sau NgayGioBatDau 1-2 giờ.định dạng tương tự.
      - Ghi chú (GhiChu):Mô tả ngắn về lịch tập, tối đa 255 ký tự (VD: "Buổi tập giảm cân với cardio và tạ").
      - Bài tập (baitap): Danh sách 3-5 bài tập cho buổi tập, mỗi bài có:
          - TenBaiTap: Tên bài tập (VD: "Chạy bộ").
          - NhomCo: Nhóm cơ chính (VD: "Toàn thân", "Chân", "Ngực").
          - SoRep: Số lần lặp (VD: 12).
          - SoSet: Số hiệp (VD: 3).
          - MoTa: Mô tả ngắn, tối đa 255 ký tự (VD: "Chạy tốc độ trung bình trên máy chạy").
        Tạo ít nhất 1 buổi tập, tối đa 6 buổi/tuần, tùy theo yêu cầu.
      Trả về định dạng JSON:
      {
        "reply": "Dưới đây là lịch tập luyện được thiết kế cho bạn:\\n- **Thời gian bắt đầu**: {NgayGioBatDau} ở định dạng DD/MM/YYYY\\n- **Thời gian kết thúc**: {NgayGioKetThuc}\\n- **Ghi chú**: {GhiChu}\\n- **Danh sách bài tập**:\\n{format baitap as bullet points}\\nHãy khởi động kỹ trước khi tập và nghỉ ngơi đầy đủ.",
        "program": null,
        "thucdon": null,
        "lichtap": [
          {
            "NgayGioBatDau": string,
            "NgayGioKetThuc": string,
            "MaHV": number,
            "MaHLV": null,
            "idMaLH": null,
            "idMaCTT": null,
            "idMaGT": null,
            "GhiChu": string,
            "TinhTrang": Ongoing,
            "baitap": [
              {
                "TenBaiTap": string,
                "NhomCo": string,
                "SoRep": number,
                "SoSet": number,
                "MoTa": string
              }
            ]
          }
        ]
      }
    `;
  }

  return `
    ${basePrompt}
    Trả về định dạng JSON:
    {
      "reply": "Câu trả lời chi tiết cho người dùng, có thể bao gồm danh sách chương trình tập, thực đơn, lịch tập, huấn luyện viên, lớp học, gói tập, hoặc thẻ hội viên. Nếu không thể lưu, nhắc nhở đăng nhập để lưu.",
      "program": null,
      "thucdon": null,
      "lichtap": null
    }
  `;
}