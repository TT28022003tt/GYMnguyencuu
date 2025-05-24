// app/api/payment/vnpay/return/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const vnp_Params = Object.fromEntries(url.searchParams.entries());

    // Lấy chữ ký gửi lên
    const vnp_SecureHash = vnp_Params["vnp_SecureHash"] || "";
    if (!vnp_SecureHash) {
      return NextResponse.json({ error: "Missing secure hash" }, { status: 400 });
    }

    // Bỏ trường vnp_SecureHash và vnp_SecureHashType để tạo lại chữ ký
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    // Lấy secret key
    const vnp_HashSecret = process.env.VNP_HASH_SECRET?.trim() || "";
    if (!vnp_HashSecret) {
      return NextResponse.json({ error: "Missing hash secret" }, { status: 500 });
    }

    // Tạo chuỗi dữ liệu để ký (theo thứ tự key alphabet, không encode)
    const signData = Object.entries(vnp_Params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    console.log("sing", signData)
    // Tạo chữ ký từ chuỗi dữ liệu
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    hmac.update(signData);
    const checkSum = hmac.digest("hex");

    // So sánh chữ ký gửi lên và chữ ký tạo ra
    if (checkSum !== vnp_SecureHash) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Kiểm tra kết quả thanh toán
    const vnp_ResponseCode = vnp_Params["vnp_ResponseCode"] || "";
    const vnp_TxnRef = vnp_Params["vnp_TxnRef"] || ""; // Mã đơn hàng bạn gửi lúc tạo paymentUrl

    // Bạn xử lý logic cập nhật đơn hàng theo vnp_ResponseCode, vnp_TxnRef ở đây
    // vnp_ResponseCode = "00" là thanh toán thành công

    if (vnp_ResponseCode === "00") {
      // Thanh toán thành công
      // TODO: cập nhật trạng thái đơn hàng trong DB
      return NextResponse.json({
        message: "Thanh toán thành công",
        orderId: vnp_TxnRef,
      });
    } else {
      // Thanh toán thất bại hoặc hủy
      return NextResponse.json({
        message: "Thanh toán không thành công",
        orderId: vnp_TxnRef,
        responseCode: vnp_ResponseCode,
      });
    }
  } catch (error) {
    console.error("VNPAY return error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
