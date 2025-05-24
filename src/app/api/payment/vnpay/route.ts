import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import moment from "moment";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Math.round(Number(body.totalPrice || body.amount));

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const vnp_TmnCode = process.env.VNP_TMN_CODE?.trim() || "";
    const vnp_HashSecret = process.env.VNP_HASH_SECRET?.trim() || "";
    const vnp_Url = process.env.VNP_URL?.trim() || "";
    const vnp_ReturnUrl = process.env.VNP_RETURN_URL?.trim() || "";

    if (!vnp_TmnCode || !vnp_HashSecret || !vnp_Url || !vnp_ReturnUrl) {
      return NextResponse.json({ error: "Missing VNPAY config" }, { status: 500 });
    }

    const rawIp = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const ipAddrRaw = rawIp.split(",")[0].trim();
    const ipAddr = ipAddrRaw === "::1" ? "127.0.0.1" : ipAddrRaw;

    const orderId = moment().format("HHmmss");
    const createDate = moment().format("YYYYMMDDHHmmss");

    const orderInfo = body.orderDescription || "Thanh toan don hang";
    const orderType = body.orderType || "other";
    const locale = body.language || "vn";
    const bankCode = body.bankCode;

    const vnp_Params: { [key: string]: string } = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: orderType,
      vnp_Amount: (amount * 100).toString(),
      vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    // Sắp xếp object theo thứ tự alphabet key
    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((acc: any, key) => {
        acc[key] = vnp_Params[key];
        return acc;
      }, {});

    // Tạo chuỗi ký không encode
    const signData = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
      console.log("signdata", signData)

    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(signData, "utf-8").digest("hex");
    console.log("signed", signed)
    sortedParams["vnp_SecureHash"] = signed;

    // Tạo URL
    const query = new URLSearchParams(sortedParams).toString();
    const paymentUrl = `${vnp_Url}?${query}`;
    console.log("payment", paymentUrl)
    return NextResponse.json({ payUrl: paymentUrl });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
