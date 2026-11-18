import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';

function fromDbOrder(row) {
  return {
    id: row.id,
    customerId: row.customer_id,
    customer: {
      name: row.customer_name || 'Valued Client',
      email: row.customer_email || '',
      phone: row.shipping_address?.phone || '',
      city: row.shipping_address?.city || '',
      address: row.shipping_address?.street || '',
    },
    items: row.items || [],
    subtotal: Number(row.subtotal || 0),
    discount: Number(row.discount || 0),
    shippingFee: Number(row.shipping || 0),
    total: Number(row.total || 0),
    status: row.status || 'Pending',
    shippingAddress: row.shipping_address || {},
    trackingNumber: row.tracking_number || '',
    courier: row.courier || 'BlueDart Express',
    timeline: row.timeline || [],
    createdAt: row.created_at,
  };
}

export const useOrderStore = create((set, get) => ({
  orders: [],
  loading: true,

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const liveOrders = data.map(fromDbOrder);
        set({ orders: liveOrders, loading: false });
        return liveOrders;
      }
    } catch (err) {
      console.warn('Failed to fetch orders from Supabase:', err.message);
    }
    set({ orders: [], loading: false });
    return [];
  },

  updateOrderStatus: async (orderId, newStatus) => {
    const updated = get().orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          lastUpdated: new Date().toISOString(),
        };
      }
      return order;
    });

    set({ orders: updated });

    try {
      await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
    } catch (err) {
      console.warn('Supabase order status update error:', err);
    }
  },

  updateShippingInfo: async (orderId, { courier, trackingNumber }) => {
    const updated = get().orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          courier: courier ?? order.courier,
          trackingNumber: trackingNumber ?? order.trackingNumber,
          lastUpdated: new Date().toISOString(),
        };
      }
      return order;
    });

    set({ orders: updated });

    try {
      await supabase
        .from('orders')
        .update({
          courier,
          tracking_number: trackingNumber,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);
    } catch (err) {
      console.warn('Supabase shipping info update error:', err);
    }
  },

  deleteOrder: async (orderId) => {
    set({ orders: get().orders.filter((order) => order.id !== orderId) });

    try {
      await supabase.from('orders').delete().eq('id', orderId);
    } catch (err) {
      console.warn('Supabase order deletion error:', err);
    }
  },

  getStats: () => {
    const orders = get().orders;
    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === 'Pending').length,
      processingOrders: orders.filter((o) => o.status === 'Processing').length,
      inTransitOrders: orders.filter((o) => o.status === 'In Transit').length,
      deliveredOrders: orders.filter((o) => o.status === 'Delivered').length,
      cancelledOrders: orders.filter((o) => o.status === 'Cancelled').length,
    };
  },
}));
