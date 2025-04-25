"use client";

import { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
  outOfStock?: boolean;
  selected: boolean;
}

const initialCart: CartItem[] = [
  { id: 1, name: "Relaxed Fit T-shirt", image: "/images/123.jpg", price: 12.99, quantity: 1, category: "XL / Blue", selected: false },
  { id: 2, name: "Nylon Sports Cap", image: "/images/123.jpg", price: 14.99, quantity: 1, category: "One Size", selected: false },
  { id: 3, name: "Sneakers", image: "/images/123.jpg", price: 34.99, quantity: 1, category: "42 / White", outOfStock: true, selected: false },
];

export default function ShoppingCart() {
  const [cart, setCart] = useState<CartItem[]>(initialCart);

  const updateQuantity = (id: number, amount: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const toggleSelect = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const updateCategory = (id: number, newCategory: string) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, category: newCategory } : item))
    );
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">Giỏ Hàng</h2>

      {cart.map((item) => (
        <div key={item.id} className="flex items-center border-b py-4 gap-4">
          {/* Checkbox chọn sản phẩm */}
          <input
            type="checkbox"
            checked={item.selected}
            onChange={() => toggleSelect(item.id)}
            className="w-5 h-5 text-red-500 accent-red-500"
          />

          {/* Hình ảnh sản phẩm */}
          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />

          {/* Thông tin sản phẩm */}
          <div className="flex-1 space-y-2">
            <p className="font-semibold text-black">{item.name}</p>
            
            {/* Giá & Trạng thái tồn kho */}
            <div className="flex items-center ">
              <p className="text-sm text-gray-500 border-r pr-3">${item.price.toFixed(2)}</p>
              <p className={`text-sm px-3 ${item.outOfStock ? "text-red-500" : "text-green-500"}`}>
                {item.outOfStock ? "Out of stock" : "In Stock"}
              </p>
            </div>

            {/* Select, Quantity, Total Price, Delete */}
            <div className="flex items-center justify-between gap-4 mt-2">
              {/* Chọn mẫu mã */}
              <select
                value={item.category}
                onChange={(e) => updateCategory(item.id, e.target.value)}
                className="p-1 border rounded text-gray-700 min-w-[100px]"
              >
                <option value="XL / Blue">XL / Blue</option>
                <option value="L / Black">L / Black</option>
                <option value="M / Red">M / Red</option>
                <option value="42 / White">42 / White</option>
              </select>

              {/* Chỉnh số lượng */}
              <div className="flex items-center space-x-2">
                <button
                  className="border px-2 py-1 rounded text-gray-600"
                  onClick={() => updateQuantity(item.id, -1)}
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <span className="px-3 py-1 border rounded text-black">{item.quantity}</span>
                <button
                  className="border px-2 py-1 rounded text-gray-600"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
              </div>

              {/* Tổng giá */}
              <p className="text-lg font-bold text-black">${(item.price * item.quantity).toFixed(2)}</p>

              {/* Nút xóa */}
              <button className="hover:text-red-500 text-gray-500" onClick={() => removeItem(item.id)}>
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
