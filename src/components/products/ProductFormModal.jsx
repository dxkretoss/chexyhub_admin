import React, { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';

export function ProductFormModal({ isOpen, onClose, onSave, product = null }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'men',
    collection: 'Highland Heritage',
    price: '',
    originalPrice: '',
    stock: '',
    thumbnail: '',
    description: '',
    fabric: '100% Long-Staple Egyptian Cotton',
    isFeatured: false,
    isBestSeller: false,
    sizes: ['S', 'M', 'L', 'XL']
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || 'men',
        collection: product.collection || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        stock: product.stock ?? 20,
        thumbnail: product.thumbnail || '',
        description: product.description || '',
        fabric: product.fabric || '100% Long-Staple Egyptian Cotton',
        isFeatured: Boolean(product.isFeatured),
        isBestSeller: Boolean(product.isBestSeller),
        sizes: product.sizes || ['S', 'M', 'L', 'XL']
      });
    } else {
      setFormData({
        name: '',
        sku: `CH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        category: 'men',
        collection: 'Highland Heritage',
        price: '',
        originalPrice: '',
        stock: 25,
        thumbnail: 'https://images.unsplash.com/photo-1623162905251-e98a25a45a67?auto=format&fit=crop&w=600&q=80',
        description: '',
        fabric: '100% Long-Staple Egyptian Cotton',
        isFeatured: false,
        isBestSeller: false,
        sizes: ['S', 'M', 'L', 'XL']
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      stock: Number(formData.stock)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="bg-white dark:bg-[#121212] w-full max-w-2xl border border-black/10 dark:border-white/10 shadow-2xl max-h-[90vh] flex flex-col animate-fade-in text-black dark:text-white">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 block">
              Catalog Management
            </span>
            <h2 className="font-serif text-xl font-normal">
              {product ? 'Edit Checkered Shirt' : 'Add New Checkered Shirt'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Shirt Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Royal Highland Tartan Oxford Shirt"
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                SKU Identifier *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="CH-MN-001"
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs font-mono uppercase focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs uppercase focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              >
                <option value="men" className="dark:bg-[#121212]">Men</option>
                <option value="women" className="dark:bg-[#121212]">Women</option>
                <option value="kids" className="dark:bg-[#121212]">Kids</option>
                <option value="family" className="dark:bg-[#121212]">Family Collection</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Collection *
              </label>
              <input
                type="text"
                required
                value={formData.collection}
                onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                placeholder="e.g. Highland Heritage"
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Fabric Weave & Material
              </label>
              <input
                type="text"
                value={formData.fabric}
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                placeholder="100% Egyptian Cotton Twill"
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2499"
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="3999"
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="45"
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Image URL (Checkered Shirt Photo) *
              </label>
              <input
                type="url"
                required
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Editorial Description
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe tailoring details, yarn dye, collar silhouette, and styling notes..."
                className="w-full bg-transparent border border-black/20 dark:border-white/20 p-2 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider font-medium">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-stone-300 text-black focus:ring-black"
                />
                <span>Featured On Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider font-medium">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  className="rounded border-stone-300 text-black focus:ring-black"
                />
                <span>Bestseller Tag</span>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-black/20 dark:border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-85 transition-opacity"
            >
              {product ? 'Update Shirt' : 'Add to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
