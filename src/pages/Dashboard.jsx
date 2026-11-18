import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Shirt,
  Users,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Eye,
  Plus
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { useOrderStore } from '../store/useOrderStore';
import { useProductStore } from '../store/useProductStore';
import { toast } from 'sonner';

export function Dashboard() {
  const { orders, getStats, updateOrderStatus, updateShippingInfo } = useOrderStore();
  const { products, addProduct } = useProductStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const stats = getStats();
  const inStockCount = products.filter((p) => p.stockStatus === 'In Stock').length;
  const lowStockCount = products.filter((p) => p.stockStatus === 'Low Stock').length;

  const handleUpdateStatus = (id, newStatus) => {
    updateOrderStatus(id, newStatus);
    toast.success(`Order ${id} marked as ${newStatus}`);
  };

  const handleUpdateShipping = (id, info) => {
    updateShippingInfo(id, info);
    toast.success(`Shipping details saved for ${id}`);
  };

  const handleAddProduct = (productData) => {
    addProduct(productData);
    toast.success(`"${productData.name}" added to catalog`);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 block mb-1">
            Executive Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-normal">
            ATELIER DASHBOARD
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Live metrics across checkered apparel orders, stock reserves, and revenues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-85 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Shirt</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          change="+18.4% this month"
          icon={IndianRupee}
          note="Prepaid & Settled"
        />
        <StatCard
          title="All Customer Orders"
          value={stats.totalOrders}
          change="+12 today"
          icon={ShoppingBag}
          note={`${stats.pendingOrders} pending verification`}
        />
        <StatCard
          title="Active Check Designs"
          value={products.length}
          change={`${inStockCount} in stock`}
          icon={Shirt}
          note={lowStockCount > 0 ? `${lowStockCount} low stock alerts` : 'Full availability'}
        />
        <StatCard
          title="Atelier Clients"
          value="1,420"
          change="+64 new signups"
          icon={Users}
          note="94% satisfaction score"
        />
      </div>

      {/* Order Status Breakdown Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-[#121212]">
        <div className="p-3 border-r border-black/10 dark:border-white/10 last:border-0">
          <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Pending</span>
          </div>
          <p className="font-serif text-xl sm:text-2xl mt-1 text-black dark:text-white">
            {stats.pendingOrders}
          </p>
        </div>

        <div className="p-3 border-r border-black/10 dark:border-white/10 last:border-0">
          <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle className="w-3 h-3 text-sky-500" />
            <span>Processing</span>
          </div>
          <p className="font-serif text-xl sm:text-2xl mt-1 text-black dark:text-white">
            {stats.processingOrders}
          </p>
        </div>

        <div className="p-3 border-r border-black/10 dark:border-white/10 last:border-0">
          <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
            <Truck className="w-3 h-3 text-blue-500" />
            <span>In Transit</span>
          </div>
          <p className="font-serif text-xl sm:text-2xl mt-1 text-black dark:text-white">
            {stats.inTransitOrders}
          </p>
        </div>

        <div className="p-3 border-r border-black/10 dark:border-white/10 last:border-0">
          <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>Delivered</span>
          </div>
          <p className="font-serif text-xl sm:text-2xl mt-1 text-black dark:text-white">
            {stats.deliveredOrders}
          </p>
        </div>

        <div className="p-3 last:border-0">
          <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
            <AlertCircle className="w-3 h-3 text-rose-500" />
            <span>Cancelled</span>
          </div>
          <p className="font-serif text-xl sm:text-2xl mt-1 text-black dark:text-white">
            {stats.cancelledOrders}
          </p>
        </div>
      </div>

      {/* Recent Orders & Top Selling Checkered Shirts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10 mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 block">
                Dispatches
              </span>
              <h3 className="font-serif text-lg font-normal">Recent Customer Orders</h3>
            </div>
            <Link
              to="/orders"
              className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Order ID</th>
                  <th className="py-2.5">Client</th>
                  <th className="py-2.5">Items</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 font-light">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-bold text-black dark:text-white">
                      {ord.id}
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-black dark:text-white">{ord.customer?.name}</p>
                      <p className="text-[10px] text-stone-400 truncate max-w-[140px]">
                        {ord.customer?.email}
                      </p>
                    </td>
                    <td className="py-3 text-stone-500">
                      {ord.items?.length} {ord.items?.length === 1 ? 'shirt' : 'shirts'}
                    </td>
                    <td className="py-3 font-mono font-bold text-black dark:text-white">
                      ₹{ord.total?.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider underline hover:opacity-75"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Checkered Shirts Column (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-6 space-y-4">
          <div className="pb-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 block">
                Best Sellers
              </span>
              <h3 className="font-serif text-lg font-normal">Top Check Shirts</h3>
            </div>
            <Link
              to="/products"
              className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:opacity-70"
            >
              Catalog →
            </Link>
          </div>

          <div className="space-y-3.5">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2 border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all">
                <img
                  src={p.thumbnail}
                  alt={p.name}
                  className="w-12 h-14 object-cover bg-stone-100 dark:bg-stone-800"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium truncate text-black dark:text-white">
                    {p.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5">
                    {p.category} • {p.collection}
                  </p>
                  <p className="font-mono text-xs font-bold text-black dark:text-white mt-1">
                    ₹{p.price.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge status={p.stockStatus} />
                  <p className="text-[10px] text-stone-400 mt-1 font-mono">{p.stock} pcs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onUpdateShipping={handleUpdateShipping}
      />

      {/* Add Product Modal */}
      <ProductFormModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSave={handleAddProduct}
      />
    </div>
  );
}
