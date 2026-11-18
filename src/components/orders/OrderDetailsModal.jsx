import React, { useState } from 'react';
import { X, Truck, Package, Check, Clock, User, MapPin, CreditCard } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

const STATUS_OPTIONS = ['Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'];

export function OrderDetailsModal({ isOpen, onClose, order, onUpdateStatus, onUpdateShipping }) {
  if (!isOpen || !order) return null;

  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [courier, setCourier] = useState(order.courier || '');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    onUpdateStatus(order.id, newStatus);
  };

  const handleShippingSave = (e) => {
    e.preventDefault();
    onUpdateShipping(order.id, { courier, trackingNumber });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="bg-white dark:bg-[#121212] w-full max-w-3xl border border-black/10 dark:border-white/10 shadow-2xl max-h-[92vh] flex flex-col animate-fade-in text-black dark:text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold">{order.id}</span>
                <StatusBadge status={currentStatus} />
              </div>
              <p className="text-[11px] text-stone-500 font-light mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Status Control Bar */}
          <div className="p-4 border border-black/10 dark:border-white/10 bg-stone-50 dark:bg-[#161616] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Fulfillment Milestone
              </span>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-light">
                Update the dispatch lifecycle of this checkered fashion parcel.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Status:</span>
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                className="bg-white dark:bg-[#202020] border border-black/20 dark:border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider focus:outline-none"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer & Shipping Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2 text-stone-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5" />
                <span>Atelier Client</span>
              </div>
              <h4 className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">
                {order.customer?.name}
              </h4>
              <p className="text-xs text-stone-500 font-light mt-1">{order.customer?.email}</p>
              <p className="text-xs text-stone-500 font-light">{order.customer?.phone}</p>
            </div>

            <div className="p-4 border border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2 text-stone-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Delivery Address</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 font-light leading-relaxed">
                {order.customer?.address}
              </p>
            </div>
          </div>

          {/* Items Purchased */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500 block mb-3">
              Checkered Apparel in Package ({order.items?.length || 0})
            </span>
            <div className="border border-black/10 dark:border-white/10 divide-y divide-black/10 dark:divide-white/10">
              {order.items?.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.thumbnail || 'https://images.unsplash.com/photo-1623162905251-e98a25a45a67?auto=format&fit=crop&w=150&q=80'}
                      alt={item.name}
                      className="w-12 h-14 object-cover bg-stone-100 dark:bg-stone-800"
                    />
                    <div>
                      <h5 className="text-xs font-medium text-black dark:text-white">
                        {item.name}
                      </h5>
                      <p className="text-[11px] text-stone-500 font-light mt-0.5">
                        Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Dispatch Info */}
          <form onSubmit={handleShippingSave} className="p-4 border border-black/10 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 flex items-center gap-2">
                <Truck className="w-3.5 h-3.5" />
                <span>Logistics Partner & AWB</span>
              </span>
              <button
                type="submit"
                className="text-[10px] uppercase font-bold tracking-wider underline hover:opacity-75 transition-opacity"
              >
                Save Tracking
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-stone-400 block mb-1">Carrier Name</label>
                <input
                  type="text"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  placeholder="e.g. BlueDart Air Express"
                  className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1 text-xs focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-400 block mb-1">Waybill / Tracking #</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BLU-984210"
                  className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1 text-xs font-mono focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>
            </div>
          </form>

          {/* Financial Breakdown */}
          <div className="p-4 border border-black/10 dark:border-white/10 bg-stone-50 dark:bg-[#161616] space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-500 font-light">
              <span>Subtotal</span>
              <span>₹{order.subtotal?.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Promotional Atelier Discount</span>
                <span>-₹{order.discount?.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-500 font-light">
              <span>Doorstep Air Express Transit</span>
              <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-black dark:text-white pt-2 border-t border-black/10 dark:border-white/10">
              <span>Total Settlement</span>
              <span>₹{order.total?.toLocaleString()}</span>
            </div>
            <div className="pt-2 text-[10px] text-stone-500 flex items-center justify-between">
              <span>Payment: {order.paymentMethod}</span>
              {order.notes && <span className="italic">{order.notes}</span>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-black/10 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-85 transition-opacity"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
