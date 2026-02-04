
import React, { useState } from 'react';
import { MenuItem, Order, OrderItem } from '../types';

interface OrderManagerProps {
  orders: Order[];
  menu: MenuItem[];
  onAdd: (order: Omit<Order, 'id'>) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const OrderManager: React.FC<OrderManagerProps> = ({ orders, menu, onAdd, onToggleStatus, onDelete }) => {
  const [customerName, setCustomerName] = useState('');
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [currentItems, setCurrentItems] = useState<OrderItem[]>([]);

  const handleAddItemToDraft = () => {
    if (!selectedFoodId || Number(quantity) < 1) return;
    
    // Check if already in draft
    const existingIndex = currentItems.findIndex(item => item.foodId === selectedFoodId);
    if (existingIndex > -1) {
      const updated = [...currentItems];
      updated[existingIndex].quantity += Number(quantity);
      setCurrentItems(updated);
    } else {
      setCurrentItems([...currentItems, { foodId: selectedFoodId, quantity: Number(quantity) }]);
    }
    
    setSelectedFoodId('');
    setQuantity('1');
  };

  const handleRemoveItemFromDraft = (index: number) => {
    setCurrentItems(currentItems.filter((_, i) => i !== index));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || currentItems.length === 0) return;
    
    onAdd({
      customerName,
      items: currentItems,
      date: new Date().toISOString(),
      isDelivered: false
    });
    
    setCustomerName('');
    setCurrentItems([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý Đơn hàng</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tên khách hàng</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Nhập tên khách hàng..."
              required
            />
          </div>

          {/* Add Item Subsection */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thêm món vào đơn</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <select
                  value={selectedFoodId}
                  onChange={(e) => setSelectedFoodId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none bg-white"
                >
                  <option value="">Chọn món ăn...</option>
                  {menu.map(item => (
                    <option key={item.id} value={item.id}>{item.name} - {item.price.toLocaleString('vi-VN')}đ</option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAddItemToDraft}
                className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-200 transition-colors"
              >
                + Thêm
              </button>
            </div>
          </div>
        </div>

        {/* Draft Items List */}
        {currentItems.length > 0 && (
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-sm font-semibold text-slate-600 mb-3">Danh sách món đang chọn:</h4>
            <div className="flex flex-wrap gap-2">
              {currentItems.map((item, idx) => {
                const food = menu.find(m => m.id === item.foodId);
                return (
                  <div key={idx} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm border border-indigo-100">
                    <span className="font-bold">{item.quantity}x</span>
                    <span>{food?.name}</span>
                    <button 
                      onClick={() => handleRemoveItemFromDraft(idx)}
                      className="ml-2 text-indigo-300 hover:text-indigo-600 font-bold"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmitOrder}
          disabled={!customerName || currentItems.length === 0}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:bg-slate-200 disabled:text-slate-400 shadow-lg shadow-indigo-100"
        >
          Xác nhận tạo đơn hàng
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ngày</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Khách hàng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Chi tiết món ăn</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tổng tiền</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">Chưa có đơn hàng nào được ghi nhận</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const total = order.items.reduce((sum, item) => {
                    const food = menu.find(m => m.id === item.foodId);
                    return sum + (food ? food.price * item.quantity : 0);
                  }, 0);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {new Date(order.date).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">{order.customerName}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {order.items.map((item, i) => {
                            const food = menu.find(m => m.id === item.foodId);
                            return (
                              <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                {item.quantity}x {food?.name || 'Món đã xóa'}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {total.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onToggleStatus(order.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
                            order.isDelivered
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}
                        >
                          {order.isDelivered ? 'Đã giao' : 'Đang xử lý'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onDelete(order.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                          title="Xóa đơn hàng"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManager;
