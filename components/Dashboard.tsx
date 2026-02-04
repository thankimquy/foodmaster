
import React, { useState } from 'react';
import { MenuItem, Order } from '../types';
import { getOrderInsights } from '../services/geminiService';

interface DashboardProps {
  orders: Order[];
  menu: MenuItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders, menu }) => {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalRevenue = orders.reduce((sum, order) => {
    const orderTotal = order.items.reduce((itemSum, item) => {
      const food = menu.find(m => m.id === item.foodId);
      return itemSum + (food ? food.price * item.quantity : 0);
    }, 0);
    return sum + orderTotal;
  }, 0);

  const pendingOrders = orders.filter(o => !o.isDelivered).length;
  const completedOrders = orders.filter(o => o.isDelivered).length;

  const handleGenerateAIReport = async () => {
    if (orders.length === 0) return;
    setIsLoading(true);
    const report = await getOrderInsights(orders, menu);
    setAiReport(report);
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Tổng quan hệ thống</h2>
          <p className="text-slate-500">Chào mừng bạn quay lại! Đây là tình hình kinh doanh của bạn.</p>
        </div>
        <button
          onClick={handleGenerateAIReport}
          disabled={isLoading || orders.length === 0}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <span className={`${isLoading ? 'animate-spin' : ''} text-xl`}>✨</span>
          {isLoading ? 'Đang phân tích...' : 'Phân tích AI'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl text-2xl">💰</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg italic">DOANH THU</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Tổng giá trị đơn</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {totalRevenue.toLocaleString('vi-VN')} đ
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-amber-50 text-amber-600 rounded-2xl text-2xl">⏳</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Đơn đang chờ</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl text-2xl">✅</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Đã hoàn thành</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{completedOrders}</p>
          </div>
        </div>
      </div>

      {aiReport && (
        <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-3xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🤖</span>
            <h3 className="text-xl font-bold text-indigo-900">Báo cáo từ AI Assistant</h3>
          </div>
          <div className="text-indigo-800 leading-relaxed whitespace-pre-line text-lg">
            {aiReport}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
