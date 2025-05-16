"use client";
import React, { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import QuantitySelector from './QuantitySelector';
import PaymentMethodSelector from './PaymentMethodSelector';

const GymPayment: React.FC = () => {
  const [packageType, setPackageType] = useState<'FIRE' | 'FIRE-PLUS' | 'FIRE-VIP'>('FIRE');
  const [voucher, setVoucher] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [months, setMonths] = useState<number>(1);
  const [displayTotalPrice, setDisplayTotalPrice] = useState<string>('0'); // State để hiển thị tổng tiền

  const packagePrices: Record<'FIRE' | 'FIRE-PLUS' | 'FIRE-VIP', number> = {
    FIRE: 500000,
    'FIRE-PLUS': 800000,
    'FIRE-VIP': 1200000
  };

  const discount = voucher === 'GIAM50K' ? 50000 : 0;
  const totalPrice = packagePrices[packageType] * months - discount;

  // Cập nhật tổng tiền hiển thị khi totalPrice thay đổi
  useEffect(() => {
    setDisplayTotalPrice(totalPrice.toLocaleString());
  }, [totalPrice]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!paymentMethod) {
      // alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }

    try {
      let apiUrl = '';
      if (paymentMethod === 'momo') {
        apiUrl = '/api/payment/momo';
      } else if (paymentMethod === 'zalopay') {
        apiUrl = '/api/payment/zalopay';
      } else {
        alert('Phương thức thanh toán không hợp lệ');
        return;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageType,
          months,
          voucher,
          totalPrice,
        }),
      });

      const data = await response.json();

      if (data.payUrl) {
        window.location.href = data.payUrl; // Redirect sang trang thanh toán
      } else {
        alert('Không tạo được đơn thanh toán.');
      }
    } catch (error) {
      console.error(error);
      alert('Đã xảy ra lỗi khi tạo đơn thanh toán.');
    }
  };

  const handlePayment = (method: string) => {
    setPaymentMethod(method);
  };

  return (
    <motion.div className="max-w-lg mx-auto p-6 " initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="rounded-2xl shadow-lg p-6 bg-base-300 ">
        <div>
          <h2 className="text-xl font-bold mb-4">Đăng Ký Gói Tập Gym</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Chọn Gói Tập</label>
              <div onChange={(e: any) => setPackageType(e.target.value)}>
                <label className="block"><input type="radio" value="FIRE" checked={packageType === 'FIRE'} onChange={() => setPackageType("FIRE")} className="mr-2" />FIRE - 500.000đ/tháng</label>
                <label className="block"><input type="radio" value="FIRE-PLUS" checked={packageType === 'FIRE-PLUS'} onChange={() => setPackageType("FIRE-PLUS")} className="mr-2" />FIRE-PLUS - 800.000đ/tháng</label>
                <label className="block"><input type="radio" value="FIRE-VIP" checked={packageType === 'FIRE-VIP'} onChange={() => setPackageType("FIRE-VIP")} className="mr-2" />FIRE-VIP - 1.200.000đ/tháng</label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Số Tháng Đăng Ký</label>
              <QuantitySelector defaultValue={1} onValueChange={setMonths} />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Áp Voucher (nếu có)</label>
              <input
                type="text"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                placeholder="Nhập mã giảm giá"
                className="w-full p-2 border rounded-2xl"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Tổng Tiền Phải Trả</label>
              <div className="text-lg font-bold">{displayTotalPrice}đ</div>
            </div>
            <PaymentMethodSelector onPayment={handlePayment} />
            {/* <button type="submit" className="w-full p-2 mt-4 bg-blue-500 text-white rounded-2xl">Thanh Toán</button> */}
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default GymPayment;