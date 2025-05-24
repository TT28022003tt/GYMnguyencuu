import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params = url.searchParams;

    const partnerCode = params.get('partnerCode') || '';
    const accessKey = process.env.MOMO_ACCESS_KEY!;
    const requestId = params.get('requestId') || '';
    const amount = params.get('amount') || '';
    const orderId = params.get('orderId') || '';
    const orderInfo = decodeURIComponent(params.get('orderInfo') || '');
    const orderType = params.get('orderType') || '';
    const transId = params.get('transId') || '';
    const resultCode = params.get('resultCode') || '';
    const message = decodeURIComponent(params.get('message') || '');
    const payType = params.get('payType') || '';
    const responseTime = params.get('responseTime') || '';
    const extraData = params.get('extraData') || '';
    const signature = params.get('signature') || '';

    const secretKey = process.env.MOMO_SECRET_KEY!;

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    console.log("raw", rawSignature)
    const signatureCheck = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
    console.log("sign", signatureCheck)
    if (signature !== signatureCheck) {
      console.error('Chữ ký MOMO không hợp lệ', { signature, signatureCheck, rawSignature });
      return NextResponse.json({ message: 'Chữ ký không hợp lệ' }, { status: 400 });
    }

    if (resultCode === '0') {
      console.log(`Thanh toán MOMO thành công đơn hàng: ${orderId}, transaction: ${transId}`);
      return NextResponse.redirect(new URL(`/payment-success?orderId=${orderId}`, req.url));
    } else {
      console.log(`Thanh toán MOMO thất bại đơn hàng: ${orderId}, message: ${message}`);
      return NextResponse.redirect(new URL(`/payment-failed?orderId=${orderId}`, req.url));
    }
  } catch (error) {
    console.error('MOMO Return Error:', error);
    return NextResponse.json({ message: 'Lỗi xử lý trả về MOMO' }, { status: 500 });
  }
}
