export function buildPrompt(metricsText: string, question: string, requestType: 'program' | 'thucdon' | 'lichtap'): string {
    if (requestType === 'lichtap') {
      return `
        Bạn là một chuyên gia huấn luyện AI. Dựa trên các chỉ số cơ thể sau của người dùng:
        ${metricsText}
        Người dùng yêu cầu: "${question}"
        Hãy tạo một lịch tập luyện phù hợp với mục tiêu (VD: giảm cân, tăng cơ). Lịch tập cần:
        - Ngày giờ bắt đầu (NgayGioBatDau): Định dạng YYYY-MM-DDTHH:mm:ssZ (VD: "2025-05-01T08:00:00Z").
        - Ngày giờ kết thúc (NgayGioKetThuc): Sau NgayGioBatDau 1-2 giờ, định dạng tương tự.
        - Ghi chú (GhiChu): Mô tả ngắn về lịch tập, tối đa 255 ký tự (VD: "Buổi tập giảm cân với cardio và tạ").
        - Bài tập (baitap): Danh sách 3-5 bài tập cho buổi tập, mỗi bài có:
          - TenBaiTap: Tên bài tập (VD: "Chạy bộ").
          - NhomCo: Nhóm cơ chính (VD: "Toàn thân", "Chân", "Ngực").
          - SoRep: Số lần lặp (VD: 12).
          - SoSet: Số hiệp (VD: 3).
          - MoTa: Mô tả ngắn, tối đa 255 ký tự (VD: "Chạy tốc độ trung bình trên máy chạy").
        Tạo ít nhất 1 buổi tập, tối đa 3 buổi/tuần, tùy theo yêu cầu. Nếu không có thời gian cụ thể, chọn ngày bắt đầu là ngày mai (VD: 2025-05-02).
        Dựa vào:
        - BMI (nếu có): BMI < 18.5 (thiếu cân, tập nhẹ), 18.5-24.9 (bình thường), >24.9 (thừa cân, tập cardio).
        - BasalMetabolicRate (nếu có): Ước lượng cường độ tập.
        - Mục tiêu từ câu hỏi (VD: "giảm cân" thì ưu tiên cardio, "tăng cơ" thì tập tạ).
        Trả về định dạng JSON:
        {
          "reply": "Dưới đây là lịch tập được thiết kế cho bạn:\\n{format lịch tập as bullet points, bao gồm ngày giờ và bài tập}",
          "lichtap": [
            {
              "NgayGioBatDau": string,
              "NgayGioKetThuc": string,
              "MaHV": number,
              "MaHLV": null,
              "idMaGT": null,
              "idMaCTT": null,
              "idMaLH": null,
              "GhiChu": string,
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
        Trong reply, format lịch tập as bullet points (VD: "- 2025-05-01 08:00-09:00: GhiChu\\n  - Chạy bộ: Toàn thân, 12 reps, 3 sets"). Đảm bảo MoTa và GhiChu tối đa 255 ký tự.
        Nếu không tạo được lịch tập hợp lệ, trả về lỗi trong reply: "Không thể tạo lịch tập do thiếu thông tin."
      `;
    } else if (requestType === 'thucdon') {
      return `
        Bạn là một chuyên gia dinh dưỡng AI. Dựa trên các chỉ số cơ thể sau của người dùng:
        ${metricsText}
        Người dùng yêu cầu: "${question}"
        Hãy tạo một thực đơn dinh dưỡng phù hợp với mục tiêu (VD: giảm cân, tăng cơ). Thực đơn cần:
        - Tên thực đơn (TenThucDon): Một tên ngắn gọn (VD: "Thực Đơn Giảm Cân").
        - Tổng calo (SoCalo): Số calo mỗi ngày, tính toán dựa trên chỉ số cơ thể (VD: BMI, tỷ lệ trao đổi chất nếu có).
        - Ngày bắt đầu (NgayBatDau): Ngày áp dụng, định dạng YYYY-MM-DD (VD: "2025-05-01").
        - Chi tiết thực đơn (chiTietThucDon): Danh sách các ngày (ít nhất 3 ngày), mỗi ngày có:
          - Ngay: Ngày cụ thể, định dạng YYYY-MM-DD (VD: "2025-05-01").
          - BuaAn: Danh sách 3-6 bữa ăn (VD: sáng, trưa, tối, phụ), mỗi bữa có:
            - TenBua: Tên bữa ăn (VD: "Bữa Sáng").
            - MoTa: Mô tả món ăn, tối đa 255 ký tự (VD: "Yến mạch với sữa không đường, 1 quả chuối").
        Tính toán calo dựa trên:
        - BMI (nếu có): BMI < 18.5 (thiếu cân, tăng calo), 18.5-24.9 (bình thường), >24.9 (thừa cân, giảm calo).
        - BasalMetabolicRate (nếu có): Ước lượng calo cần thiết.
        - Mục tiêu từ câu hỏi (VD: "giảm cân" thì giảm 10-15% calo, "tăng cơ" thì tăng protein).
        Trả về định dạng JSON:
        {
          "reply": "Dưới đây là thực đơn được thiết kế cho bạn:\\n- **Tên thực đơn**: {TenThucDon}\\n- **Tổng calo**: {SoCalo} kcal\\n- **Ngày bắt đầu**: {NgayBatDau}\\n- **Chi tiết thực đơn**:\\n{format chiTietThucDon as bullet points}",
          "thucdon": {
            "TenThucDon": string,
            "SoCalo": number,
            "NgayBatDau": string,
            "MaHV": number,
            "chiTietThucDon": [
              {
                "Ngay": string,
                "buaan": [
                  {
                    "TenBua": string,
                    "MoTa": string
                  }
                ]
              }
            ]
          }
        }
        Trong reply, format chiTietThucDon as bullet points (VD: "- 2025-05-01: Bữa Sáng: Yến mạch với sữa không đường"). Đảm bảo MoTa tối đa 255 ký tự.
        Nếu không tạo được chiTietThucDon hợp lệ, trả về lỗi trong reply: "Không thể tạo chi tiết thực đơn do thiếu thông tin."
      `;
    }
  
    // chương trình tập
    return `
      Bạn là một trợ lý sức khỏe AI. Dựa trên các chỉ số sau của người dùng:
      ${metricsText}
      Người dùng yêu cầu: "${question}"
      Hãy tạo một chương trình tập luyện phù hợp, bao gồm:
      - Tên chương trình (TenCTT): Một tên ngắn gọn, phù hợp với mục tiêu (VD: "Chương trình Giảm Cân").
      - Mục tiêu (MucTieu): Mô tả mục tiêu của chương trình (VD: "Giảm mỡ toàn thân").
      - Thời gian (ThoiGian): Khoảng thời gian thực hiện (VD: "8 tuần").
      - Chi tiết mục tiêu (chiTietMucTieu): Một danh sách các giai đoạn hoặc bài tập cụ thể, mỗi giai đoạn có:
        - ThoiGian: Thời điểm hoặc tuần (VD: "Tuần 1-2").
        - MoTa: Mô tả đầy đủ các bài tập hoặc kế hoạch, tối đa 1000 ký tự, bao gồm tất cả chi tiết như danh sách bài tập, số hiệp, số lần lặp, hoặc lưu ý dinh dưỡng (VD: "Cardio 30 phút, 3 lần/tuần (chạy bộ, đạp xe). Tập tạ 3 hiệp, 12 lần/hiệp. Giảm đường, tăng protein.").
      Đảm bảo chiTietMucTieu không rỗng và mỗi mục có ThoiGian và MoTa hợp lệ.
      Trả về định dạng JSON:
      {
        "reply": "Dưới đây là chương trình tập luyện được thiết kế cho bạn:\\n- **Tên chương trình**: {TenCTT}\\n- **Mục tiêu**: {MucTieu}\\n- **Thời gian**: {ThoiGian}\\n- **Chi tiết mục tiêu**:\\n{format chiTietMucTieu as bullet points}\\nNếu bạn có vấn đề sức khỏe, hãy tham khảo bác sĩ trước khi bắt đầu.",
        "program": {
          "TenCTT": string,
          "MucTieu": string,
          "ThoiGian": string,
          "MaHV": number,
          "chiTietMucTieu": [
            {
              "ThoiGian": string,
              "MoTa": string
            }
          ]
        }
      }
      Trong reply, format chiTietMucTieu as bullet points (VD: "- Tuần 1-2: Cardio 30 phút, 3 lần/tuần (chạy bộ, đạp xe)."). Trong program.chiTietMucTieu, MoTa phải chứa toàn bộ mô tả chi tiết, tối đa 1000 ký tự.
      Nếu không tạo được chiTietMucTieu hợp lệ, trả về lỗi trong reply: "Không thể tạo chi tiết mục tiêu do thiếu thông tin."
    `;
  }