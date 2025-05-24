import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log('MOMO webhook data:', body);


    if (body.resultCode === 0) {


      console.log(`Thanh toán thành công cho đơn hàng ${body.orderId}`);
    } else {
      console.log(`Thanh toán không thành công, resultCode: ${body.resultCode}`);
    }

    // Trả về cho MOMO biết đã nhận webhook thành công
    return NextResponse.json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Error handling MOMO webhook:', error);
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
