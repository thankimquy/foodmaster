
import React, { useState, useEffect } from 'react';
import { MenuItem, Order, ViewState } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MenuManager from './components/MenuManager';
import OrderManager from './components/OrderManager';

const App: React.FC = () => {
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('food-menu-v2');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load menu", e);
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('food-orders-v2');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load orders", e);
      return [];
    }
  });

  const [activeView, setActiveView] = useState<ViewState>('dashboard');

  useEffect(() => {
    // Check if it's iOS and not already installed
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isIOS && !isStandalone) {
      setShowIOSPrompt(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('food-menu-v2', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('food-orders-v2', JSON.stringify(orders));
  }, [orders]);

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setMenu([...menu, newItem]);
  };

  const deleteMenuItem = (id: string) => {
    if (!window.confirm("Xóa món này sẽ ảnh hưởng đến dữ liệu hiển thị trong đơn hàng cũ. Bạn chắc chắn chứ?")) return;
    setMenu(menu.filter(item => item.id !== id));
    setOrders(prevOrders => 
      prevOrders.map(order => ({
        ...order,
        items: order.items.filter(item => item.foodId !== id)
      })).filter(order => order.items.length > 0)
    );
  };

  const addOrder = (order: Omit<Order, 'id'>) => {
    const newOrder = { ...order, id: Math.random().toString(36).substr(2, 9) };
    setOrders([newOrder, ...orders]);
  };

  const toggleOrderStatus = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, isDelivered: !o.isDelivered } : o));
  };

  const deleteOrder = (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;
    setOrders(orders.filter(o => o.id !== id));
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard orders={orders} menu={menu} />;
      case 'menu':
        return <MenuManager menu={menu} onAdd={addMenuItem} onDelete={deleteMenuItem} />;
      case 'orders':
        return (
          <OrderManager
            orders={orders}
            menu={menu}
            onAdd={addOrder}
            onToggleStatus={toggleOrderStatus}
            onDelete={deleteOrder}
          />
        );
      default:
        return <Dashboard orders={orders} menu={menu} />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {showIOSPrompt && (
        <div className="fixed bottom-20 left-4 right-4 bg-white p-4 rounded-2xl shadow-2xl border border-indigo-100 z-[100] animate-bounce">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📱</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">Cài đặt ứng dụng trên iPhone</p>
              <p className="text-xs text-slate-500 mt-1">
                Nhấn vào nút <span className="inline-block bg-slate-100 px-1 rounded">Chia sẻ</span> (hình ô vuông có mũi tên lên) ở dưới cùng Safari, sau đó chọn <b>"Thêm vào MH chính"</b>.
              </p>
            </div>
            <button onClick={() => setShowIOSPrompt(false)} className="text-slate-400">✕</button>
          </div>
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
