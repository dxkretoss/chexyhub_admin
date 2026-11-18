import { create } from 'zustand';
import { INITIAL_ORDERS } from '../data/initialOrders';

const ORDERS_STORAGE_KEY = 'chexyhub_admin_orders';

export const useOrderStore = create((set, get) => ({
  orders: (() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  })(),

  updateOrderStatus: (orderId, newStatus) => {
    const updated = get().orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        };
      }
      return order;
    });

    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    set({ orders: updated });
  },

  updateShippingInfo: (orderId, { courier, trackingNumber }) => {
    const updated = get().orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          courier: courier ?? order.courier,
          trackingNumber: trackingNumber ?? order.trackingNumber,
          lastUpdated: new Date().toISOString()
        };
      }
      return order;
    });

    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    set({ orders: updated });
  },

  deleteOrder: (orderId) => {
    const updated = get().orders.filter((order) => order.id !== orderId);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    set({ orders: updated });
  },

  getStats: () => {
    const orders = get().orders;
    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
    const processingOrders = orders.filter((o) => o.status === 'Processing').length;
    const inTransitOrders = orders.filter((o) => o.status === 'In Transit').length;
    const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
    const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      processingOrders,
      inTransitOrders,
      deliveredOrders,
      cancelledOrders
    };
  }
}));
