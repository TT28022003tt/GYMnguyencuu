import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Hàm fetch có retry
async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<any> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status >= 500 && retries > 0) {
        console.warn(`Retrying... (${3 - retries + 1})`);
        return fetchWithRetry(url, options, retries - 1);
      }
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Fetch error, retrying... (${3 - retries + 1})`);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packageType, months, totalPrice } = body;

    // Load biến môi trường
    const app_id = process.env.NEXT_PUBLIC_ZALO_APP_ID!;
    const key1 = process.env.NEXT_PUBLIC_ZALO_KEY1!;
    const redirectUrl = process.env.NEXT_PUBLIC_ZALO_REDIRECT_URL!;
    const callbackUrl = process.env.NEXT_PUBLIC_ZALO_CALLBACK_URL!;

    if (!app_id || !key1 || !redirectUrl || !callbackUrl) {
      throw new Error('Thiếu biến môi trường cấu hình ZaloPay');
    }

    // Chuẩn bị order
    const app_trans_id = `${new Date().getFullYear()}${(Date.now() % 1000000000)}`; // YYYY + timestamp (9 số cuối)
    const app_time = Math.floor(Date.now() / 1000); // Thời gian tính bằng giây
    const amount = totalPrice.toString(); // Chuyển đổi thành chuỗi
    const description = `Thanh toán gói tập Gym: ${packageType} (${months} tháng)`;

    // Data truyền đi
    const data: any = {
      app_id,
      app_trans_id,
      app_time,
      amount,
      app_user: 'gym_customer', // Tên user phía mình tự định nghĩa
      embed_data: JSON.stringify({ redirecturl: redirectUrl, description }),
      item: JSON.stringify([]),
      description,
      bank_code: '',
      callback_url: callbackUrl,
    };

    // Tạo chữ ký MAC đúng chuẩn
    const dataRaw = `${app_id}|${app_trans_id}|gym_customer|${amount}|${app_time}|${data.embed_data}|${data.item}`;
    data.mac = crypto.createHmac('sha256', key1).update(dataRaw).digest('hex');

    console.info('[ZALOPAY] Sending Payment Request:', JSON.stringify(data, null, 2));

    // Gửi yêu cầu tạo đơn
    const result = await fetchWithRetry('https://sandbox.zalopay.com.vn/v001/tpe/createorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data).toString(), // Chuyển đổi thành chuỗi
    });

    console.info('[ZALOPAY] Received Response:', JSON.stringify(result, null, 2));

    // Xử lý phản hồi
    if (result.order_url) {
      return NextResponse.json({ payUrl: result.order_url });
    } else {
      console.error('[ZALOPAY] Failed to create payment:', result);
      return NextResponse.json({ message: result.message || 'Không tạo được đơn thanh toán ZaloPay' }, { status: 400 });
    }
  } catch (error) {
    console.error('[ZALOPAY] Error:', error);
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}