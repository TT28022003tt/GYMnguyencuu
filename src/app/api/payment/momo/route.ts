import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packageType, months, voucher, totalPrice } = body;

    const partnerCode = process.env.NEXT_PUBLIC_MOMO_PARTNER_CODE!;
    const accessKey = process.env.NEXT_PUBLIC_MOMO_ACCESS_KEY!;
    const secretKey = process.env.NEXT_PUBLIC_MOMO_SECRET_KEY!;
    const redirectUrl = process.env.NEXT_PUBLIC_MOMO_REDIRECT_URL!;
    const ipnUrl = process.env.NEXT_PUBLIC_MOMO_IPN_URL!;


    // Tạo orderId và requestId
    const orderId = `${Date.now()}`;
    const requestId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const amount = totalPrice.toString();
    const orderInfo = "Thanh toán gói tập gym";
    const requestType = 'captureWallet';

    // Tạo rawSignature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    console.log("chuki", rawSignature)
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
    console.log("sign", signature)

    // Xây dựng body request
    const bodyRequest = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData: '',
      requestType,
      signature,
      lang: 'vi',
    };

    // Debug log các tham số gửi đi
    console.log("MOMO Request Payload:", bodyRequest);

    // Gửi request đến MOMO API
    const response = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyRequest),
    });

    // Kiểm tra phản hồi từ MOMO
    const result = await response.json();
    console.log("MOMO Response:", result)
    if (result.payUrl) {
      // Trả về URL thanh toán MOMO
      return NextResponse.json({ payUrl: result.payUrl });
    } else {
      // Trường hợp không có URL thanh toán
      console.error('MOMO response error:', result);
      return NextResponse.json({ message: 'Không tạo được đơn thanh toán MOMO' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating MOMO payment:', error);
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
