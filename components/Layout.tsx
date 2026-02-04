
import React from 'react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  const navItems: { id: ViewState; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: '📊' },
    { id: 'menu', label: 'Thực đơn', icon: '🍲' },
    { id: 'orders', label: 'Đơn hàng', icon: '📝' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar for Desktop / Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 w-full md:relative md:w-64 bg-white border-t md:border-t-0 md:border-r border-slate-200 z-50">
        <div className="hidden md:flex p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <span className="text-2xl">🍕</span> FoodMaster
          </h1>
        </div>
        <ul className="flex md:flex-col justify-around md:justify-start p-2 md:p-4 gap-1">
          {navItems.map((item) => (
            <li key={item.id} className="flex-1 md:flex-none">
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex flex-col md:flex-row items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === item.id
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs md:text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
