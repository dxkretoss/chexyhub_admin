import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName = 'this product' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="bg-white dark:bg-[#121212] w-full max-w-md border border-black/10 dark:border-white/10 shadow-2xl p-6 animate-fade-in text-black dark:text-white">
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-serif text-lg font-normal">Confirm Deletion</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-black dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-light mb-6">
          Are you certain you wish to permanently remove <strong>{itemName}</strong> from the CHEXY HUB atelier system? This action cannot be reversed.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-black/20 dark:border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
