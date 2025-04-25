"use client"
import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import QuantitySelector from './QuantitySelector';
import PaymentMethodSelector from './PaymentMethodSelector';

const GymPayment: React.FC = () => {
  const [packageType, setPackageType] = useState<'FIRE' | 'FIRE-PLUS' | 'FIRE-VIP'>('FIRE');
  const [voucher, setVoucher] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [months, setMonths] = useState<number>(1);

  const packagePrices: Record<'FIRE' | 'FIRE-PLUS' | 'FIRE-VIP', number> = {
    FIRE: 500000,
    'FIRE-PLUS': 800000,
    'FIRE-VIP': 1200000
  };

  const discount = voucher === 'GIAM50K' ? 50000 : 0;
  const totalPrice = packagePrices[packageType] * months - discount;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ packageType, months, voucher, totalPrice, paymentMethod });
  };

  const handlePayment = (method: string) => {
    setPaymentMethod(method);
    console.log(`Phương thức thanh toán: ${method}`);
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
                <label className="block"><input type="radio" value="FIRE" checked={packageType === 'FIRE'} onChange={()=> setPackageType("FIRE")} className="mr-2" />FIRE - 500.000đ/tháng</label>
                <label className="block"><input type="radio" value="FIRE-PLUS" checked={packageType === 'FIRE-PLUS'} onChange={()=> setPackageType("FIRE-PLUS")} className="mr-2" />FIRE-PLUS - 800.000đ/tháng</label>
                <label className="block"><input type="radio" value="FIRE-VIP" checked={packageType === 'FIRE-VIP'} onChange={()=> setPackageType("FIRE-VIP")} className="mr-2" />FIRE-VIP - 1.200.000đ/tháng</label>
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
              <div className="text-lg font-bold">{totalPrice.toLocaleString()}đ</div>
            </div>
            <PaymentMethodSelector onPayment={handlePayment} />
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default GymPayment;
