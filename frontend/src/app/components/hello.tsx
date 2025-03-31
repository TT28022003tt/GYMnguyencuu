"use client"
import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => (
  <div className=" rounded-2xl shadow-lg p-6">{children}</div>
);

interface CardContentProps {
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ children }) => <div>{children}</div>;

interface ButtonProps {
  children: React.ReactNode;
  type: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ children, type }) => (
  <button type={type} className="bg-blue-500 text-white w-full py-2 rounded-2xl hover:bg-blue-600">
    {children}
  </button>
);

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const Input: React.FC<InputProps> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full p-2 border rounded-2xl"
  />
);

interface RadioGroupProps {
  children: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ children, value, onChange }) => (
  <div onChange={onChange}>{children}</div>
);

interface RadioProps {
  value: string;
  children: React.ReactNode;
}

const Radio: React.FC<RadioProps> = ({ value, children }) => (
  <label className="block">
    <input type="radio" value={value} className="mr-2" />
    {children}
  </label>
);

interface QuantitySelectorProps {
  defaultValue: number;
  onValueChange: (value: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ defaultValue, onValueChange }) => {
  const [value, setValue] = useState<number>(defaultValue);

  const up = () => {
    const newValue = value + 1;
    setValue(newValue);
    onValueChange(newValue);
  };

  const down = () => {
    const newValue = value > 1 ? value - 1 : 1;
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <div className="h-3 flex justify-center items-center gap-3 bg-orange-600 p-3">
      <button onClick={up} className="text-black text-xl cursor-pointer">
        +
      </button>
      <span className="text-lg font-bold">{value}</span>
      <button onClick={down} className="text-black text-xl cursor-pointer">
        -
      </button>
    </div>
  );
};

const GymPaymentForm: React.FC = () => {
  const [packageType, setPackageType] = useState<'FIRE' | 'FIRE-PLUS' | 'FIRE-VIP'>('FIRE');
  const [voucher, setVoucher] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'momo' | 'cash'>('bank');
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

  return (
    <motion.div className="max-w-lg mx-auto p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Đăng Ký Gói Tập Gym</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Chọn Gói Tập</label>
              <RadioGroup value={packageType} onChange={(e) => setPackageType(e.target.value as 'FIRE' | 'FIRE-PLUS' | 'FIRE-VIP')}>
                <Radio value="FIRE">FIRE - 500.000đ/tháng</Radio>
                <Radio value="FIRE-PLUS">FIRE-PLUS - 800.000đ/tháng</Radio>
                <Radio value="FIRE-VIP">FIRE-VIP - 1.200.000đ/tháng</Radio>
              </RadioGroup>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Số Tháng Đăng Ký</label>
              <QuantitySelector defaultValue={1} onValueChange={setMonths} />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Áp Voucher (nếu có)</label>
              <Input
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                placeholder="Nhập mã giảm giá"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Tổng Tiền Phải Trả</label>
              <div className="text-lg font-bold">{totalPrice.toLocaleString()}đ</div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Phương Thức Thanh Toán</label>
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'bank' | 'momo' | 'cash')}>
                <Radio value="bank">Liên Kết Ngân Hàng</Radio>
                <Radio value="momo">Momo</Radio>
                <Radio value="cash">Thanh Toán Khi Tới Phòng Gym</Radio>
              </RadioGroup>
            </div>

            <Button type="submit">Xác Nhận Thanh Toán</Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GymPaymentForm;
