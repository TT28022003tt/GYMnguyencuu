'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentFailedClient() {
  const searchParams = useSearchParams();
  const [txnRef, setTxnRef] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get('vnp_TxnRef');
    if (ref) setTxnRef(ref);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Thanh toán thất bại</h1>
        <p className="text-gray-700 mb-2">Rất tiếc! Giao dịch của bạn không thành công.</p>
        <p className="text-gray-600">Mã giao dịch: <strong>{txnRef || 'Không có'}</strong></p>
        <a href="/" className="mt-6 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
}
