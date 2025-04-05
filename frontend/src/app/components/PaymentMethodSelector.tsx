"use client"
import { faBuildingColumns, faMoneyBillWave, faWallet } from "@fortawesome/free-solid-svg-icons";
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
    { id: 'Shoping', label: 'Ví Shoping', icon: faWallet },
    { id: 'wallet', label: 'Tiền trong ví (đ70.000)',  icon: faWallet, extra: <button className="text-orange-500">Nạp tiền</button> },
    { id: 'bank', label: 'MB *2003', icon: faBuildingColumns, selected: true },
    { id: 'spaylater', label: 'SPayLater', icon: faMoneyBillWave, description: 'Mua trước trả sau đến 12 kỳ', extra: <button className="text-orange-500">Kích hoạt ngay</button> }
  ];

  return (
    <div className=" p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
      <div>
        {paymentOptions.map((option) => (
          <div
            key={option.id}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${paymentMethod === option.id ? 'bg-orange-100 border-orange-500 text-black' : 'border-gray-300'} border mb-2`}
            onClick={() => setPaymentMethod(option.id)}
          >
            <div className="flex items-center gap-2">
			        <FontAwesomeIcon icon={option.icon} className="mr-2" />
              <div>
                <p className="font-medium">{option.label}</p>
                {option.description && <p className="text-sm text-gray-500">{option.description}</p>}
              </div>
            </div>
            {option.extra}
            {paymentMethod === option.id && <span className="text-orange-500">✔️</span>}
          </div>
        ))}
      </div>
      <button
        onClick={handlePayment}
        className="mt-4 bg-orange-500 text-white w-full py-2 rounded-2xl hover:bg-orange-600"
      >
        Xác nhận thanh toán
      </button>
    </div>
  );
};

export default PaymentMethodSelector;
