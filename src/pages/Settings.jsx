import React, { useState } from 'react';
import { Save, RefreshCw, Shield, Bell, Truck, CreditCard } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { toast } from 'sonner';

export function Settings() {
  const { resetToDefault } = useProductStore();

  const [settings, setSettings] = useState({
    storeName: 'CHEXY HUB',
    tagline: 'STYLE IS A STATEMENT.',
    currency: 'INR (₹)',
    freeShippingThreshold: 1999,
    standardShippingFee: 150,
    supportEmail: 'concierge@chexyhub.com',
    supportPhone: '+91 98200 98241',
    headquarters: 'Boutique Atelier #402, Worli Sea Face, Mumbai 400018',
    razorpayKey: 'rzp_live_chexyhub_production_2026',
    emailNotifications: true,
    smsDispatchAlerts: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Atelier configuration saved successfully');
  };

  const handleResetCatalog = () => {
    if (window.confirm('Reset catalog inventory to official 10 checkered shirt defaults?')) {
      resetToDefault();
      toast.success('Catalog reset to initial curated collection');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl select-none">
      {/* Header */}
      <div className="pb-6 border-b border-black/10 dark:border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 block mb-1">
          System Parameters
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-normal">
          ATELIER SETTINGS
        </h1>
        <p className="text-xs text-stone-500 font-light mt-1">
          Storewide configurations, logistics rates, payment gateway credentials, and dispatch triggers.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Information */}
        <div className="p-6 bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 space-y-4">
          <h3 className="font-serif text-base font-normal pb-3 border-b border-black/10 dark:border-white/10">
            Brand Identity & Positioning
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Label Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Official Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Atelier HQ Address
              </label>
              <input
                type="text"
                value={settings.headquarters}
                onChange={(e) => setSettings({ ...settings, headquarters: e.target.value })}
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white"
              />
            </div>
          </div>
        </div>

        {/* Logistics & Thresholds */}
        <div className="p-6 bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 space-y-4">
          <h3 className="font-serif text-base font-normal pb-3 border-b border-black/10 dark:border-white/10 flex items-center gap-2">
            <Truck className="w-4 h-4 text-stone-500" />
            <span>Shipping & Logistics Rules</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Complimentary Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs font-mono focus:outline-none focus:border-black dark:focus:border-white"
              />
              <p className="text-[10px] text-stone-400 mt-1">Orders above this qualify for free air transit.</p>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Standard Shipping Flat Rate (₹)
              </label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs font-mono focus:outline-none focus:border-black dark:focus:border-white"
              />
              <p className="text-[10px] text-stone-400 mt-1">Applied when cart is below free threshold.</p>
            </div>
          </div>
        </div>

        {/* Client Advisory Coordinates */}
        <div className="p-6 bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 space-y-4">
          <h3 className="font-serif text-base font-normal pb-3 border-b border-black/10 dark:border-white/10">
            Client Advisory Communication
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Concierge Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Concierge Direct Telephone
              </label>
              <input
                type="tel"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleResetCatalog}
            className="inline-flex items-center gap-2 px-4 py-2 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Catalog</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-85 transition-opacity"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
