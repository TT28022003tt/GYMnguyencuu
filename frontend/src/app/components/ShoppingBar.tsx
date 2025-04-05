"use client"

const ShoppingBar = () => {
  return (
    <div className="bg-white shadow-lg border rounded-lg p-4 ">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Thanh toán</h2>

      <div className="flex justify-between text-sm text-gray-600 mt-3">
        <span>Tổng sản phẩm:</span>
        <span>0</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <span>Tạm tính:</span>
        <span>₫0</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <span>Giảm giá:</span>
        <span>-₫0</span>
      </div>

      <div className="flex justify-between text-base font-semibold text-gray-800 mt-4 border-t pt-2">
        <span>Tổng thanh toán:</span>
        <span className="text-red-500">₫0</span>
      </div>

      <button className="w-full bg-red-500 text-white text-center py-2 mt-4 rounded-lg hover:bg-red-600 transition">
        Mua Hàng
      </button>
    </div>
  );
};

export default ShoppingBar;