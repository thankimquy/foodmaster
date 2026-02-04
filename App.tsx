
import React, { useState, useEffect } from 'react';
import { MenuItem, Order, ViewState } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MenuManager from './components/MenuManager';
import OrderManager from './components/OrderManager';

const App: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('food-menu-v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('food-orders-v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeView, setActiveView] = useState<ViewState>('dashboard');

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
    
    // We keep the orders but the items might show 'Món đã xóa'
    // Alternatively, we could filter out the specific item from all orders:
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
      {renderContent()}
    </Layout>
  );
};

export default App;
