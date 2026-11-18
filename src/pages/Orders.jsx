import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { StatusBadge } from '../components/common/StatusBadge';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal';
import { DeleteConfirmModal } from '../components/products/DeleteConfirmModal';
import { toast } from 'sonner';

const STATUS_TABS = ['All', 'Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'];

export function Orders() {
  const { orders, updateOrderStatus, updateShippingInfo, deleteOrder } = useOrderStore();
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        o.id.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.email?.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q));

      const matchesTab =
        selectedStatusTab === 'All' || o.status === selectedStatusTab;

      return matchesSearch && matchesTab;
    });
  }, [orders, searchQuery, selectedStatusTab]);

  const handleUpdateStatus = (id, newStatus) => {
    updateOrderStatus(id, newStatus);
    toast.success(`Order ${id} milestone set to ${newStatus}`);
  };

  const handleUpdateShipping = (id, info) => {
    updateShippingInfo(id, info);
    toast.success(`Air waybill / logistics saved for ${id}`);
  };

  const handleDeleteConfirm = () => {
    if (deletingOrder) {
      deleteOrder(deletingOrder.id);
      toast.success(`Order ${deletingOrder.id} purged from archive`);
      setDeletingOrder(null);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 block mb-1">
            Fulfillment Logistics
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-normal">
            ORDERS FULFILLMENT ({orders.length})
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Track customer check shirt orders, update dispatch milestones, and assign air waybill numbers.
          </p>
        </div>
      </div>

      {/* Status Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-black/10 dark:border-white/10">
        {STATUS_TABS.map((tab) => {
          const count =
            tab === 'All' ? orders.length : orders.filter((o) => o.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setSelectedStatusTab(tab)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b-2 -mb-[1px] ${
                selectedStatusTab === tab
                  ? 'border-black text-black dark:border-white dark:text-white font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              <span>{tab}</span>
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-mono rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-[#121212]">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="SEARCH BY ORDER ID, CLIENT NAME, PHONE, OR AWB..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 pl-9 pr-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-black dark:focus:border-white"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10 text-stone-400 font-bold uppercase tracking-wider text-[10px] bg-stone-50/50 dark:bg-[#161616]">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Apparel Items</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-stone-400">
                    No orders match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    {/* Order ID & Date */}
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-black dark:text-white">
                        {ord.id}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <p className="font-medium text-black dark:text-white">{ord.customer?.name}</p>
                      <p className="text-[10px] text-stone-400 truncate max-w-[160px]">
                        {ord.customer?.phone}
                      </p>
                    </td>

                    {/* Items */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {ord.items?.slice(0, 2).map((item, i) => (
                          <img
                            key={i}
                            src={item.thumbnail}
                            alt={item.name}
                            title={`${item.name} (${item.size})`}
                            className="w-8 h-10 object-cover bg-stone-100 dark:bg-stone-800 border border-black/10 dark:border-white/10"
                          />
                        ))}
                        {ord.items?.length > 2 && (
                          <span className="text-[10px] font-mono text-stone-400 font-bold">
                            +{ord.items.length - 2}
                          </span>
                        )}
                        <span className="text-[11px] text-stone-500 font-light ml-1">
                          {ord.items?.reduce((sum, it) => sum + it.quantity, 0)} pcs
                        </span>
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="py-3 px-4">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-stone-600 dark:text-stone-300">
                        {ord.paymentMethod}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-black dark:text-white">
                        ₹{ord.total?.toLocaleString()}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={ord.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3 py-1.5 border border-black/15 dark:border-white/15 text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                        >
                          Details & Dispatch
                        </button>

                        <button
                          onClick={() => setDeletingOrder(ord)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title="Purge Order Archive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Logistics Modal */}
      <OrderDetailsModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onUpdateShipping={handleUpdateShipping}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingOrder)}
        onClose={() => setDeletingOrder(null)}
        onConfirm={handleDeleteConfirm}
        itemName={`Order #${deletingOrder?.id}`}
      />
    </div>
  );
}
