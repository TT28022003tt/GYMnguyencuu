"use client";

import { faMobileAlt, faCreditCard, faMoneyCheckAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface PaymentMethodSelectorProps {
  onPayment: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ onPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const handlePayment = () => {
    if (paymentMethod) {
      onPayment(paymentMethod);
    } else {
      alert('Vui lòng chọn phương thức thanh toán');
    }
  };

  const paymentOptions = [
    { id: 'momo', label: 'Ví MoMo', icon: faMobileAlt },
    { id: 'zalopay', label: 'ZaloPay', icon: faMoneyCheckAlt },
    { id: 'card', label: 'Thẻ ATM / Visa', icon: faCreditCard },
  ];

  return (
    <div className="p-4 rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
      <div className="space-y-3">
        {paymentOptions.map((option) => (
          <div
            key={option.id}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all ${
              paymentMethod === option.id
                ? 'bg-orange-100 border-orange-500 text-black'
                : 'border-gray-300 hover:border-orange-400'
            }`}
            onClick={() => setPaymentMethod(option.id)}
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={option.icon} className="text-xl text-orange-500" />
              <p className="font-medium">{option.label}</p>
            </div>
            {paymentMethod === option.id && <span className="text-orange-500 text-xl">✔️</span>}
          </div>
        ))}
      </div>
      <button
        onClick={handlePayment}
        className="mt-5 bg-orange-500 text-white w-full py-2 rounded-2xl hover:bg-orange-600 transition"
      >
        Xác nhận thanh toán
      </button>
    </div>
  );
};

export default PaymentMethodSelector;
