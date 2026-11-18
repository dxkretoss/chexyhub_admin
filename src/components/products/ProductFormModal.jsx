import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus, Check } from 'lucide-react';
import { storageService } from '../../services/supabaseClient';

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

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || 'men',
        collection: product.collection || 'Highland Heritage',
        price: product.price ?? '',
        originalPrice: product.originalPrice ?? product.price ?? '',
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
    setUploadError(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a valid image format (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const publicUrl = await storageService.uploadProductImage(file);
      setFormData((prev) => ({ ...prev, thumbnail: publicUrl }));
    } catch (err) {
      setUploadError(err.message || 'Image upload failed. You can paste a direct URL below.');
    } finally {
      setIsUploading(false);
    }
  };

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

  const toggleSize = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      const updated = exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: updated };
    });
  };

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="bg-white dark:bg-[#121212] w-full max-w-2xl border border-black/10 dark:border-white/10 shadow-2xl max-h-[90vh] flex flex-col animate-fade-in text-black dark:text-white">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 block">
              CATALOG ARCHITECTURE
            </span>
            <h3 className="font-serif text-lg font-normal">
              {product ? 'Edit Checkered Shirt Allocation' : 'Create Checkered Shirt Piece'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Shirt Title / Silhouette Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Royal Tartan Flannel Overshirt"
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                SKU Reference Code *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="CH-094-NAV"
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs font-mono uppercase focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Atelier Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              >
                <option value="men" className="dark:bg-[#181818]">Men's Atelier</option>
                <option value="women" className="dark:bg-[#181818]">Women's Atelier</option>
                <option value="kids" className="dark:bg-[#181818]">Junior / Kids</option>
                <option value="family" className="dark:bg-[#181818]">Family Coordinate</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Curated Collection *
              </label>
              <input
                type="text"
                required
                value={formData.collection}
                onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                placeholder="Highland Heritage"
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Fabric & Composition
              </label>
              <input
                type="text"
                value={formData.fabric}
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                placeholder="100% Long-Staple Egyptian Cotton"
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Boutique Price (INR) *
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
                Original MRP / Crossout (INR)
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="3299"
                className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-1.5 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Allocated Stock Inventory *
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

            {/* Supabase Storage Bucket File Upload Section */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block">
                Product Image (Checkered Shirt Photo) *
              </label>

              {/* Hidden native file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="border border-dashed border-black/20 dark:border-white/20 p-4 transition-colors hover:border-black dark:hover:border-white bg-stone-50/50 dark:bg-stone-900/30">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Thumbnail Preview */}
                  {formData.thumbnail ? (
                    <div className="relative group shrink-0">
                      <img
                        src={formData.thumbnail}
                        alt="Preview"
                        className="w-20 h-24 object-cover border border-black/15 dark:border-white/15 bg-white dark:bg-black"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] uppercase tracking-wider font-bold transition-opacity"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-24 border border-black/10 dark:border-white/10 flex flex-col items-center justify-center text-stone-400 shrink-0 bg-white dark:bg-[#181818]">
                      <Upload className="w-6 h-6 stroke-[1.5]" />
                      <span className="text-[9px] mt-1 font-mono">NO PHOTO</span>
                    </div>
                  )}

                  <div className="flex-1 text-center sm:text-left space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black text-[11px] font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? 'Uploading to Bucket...' : 'Upload Image to Supabase'}</span>
                      </button>
                      <span className="text-[9.5px] text-stone-400 uppercase tracking-wider block">
                        Stores into <span className="font-mono text-neutral-800 dark:text-neutral-200">atelier-products</span> bucket
                      </span>
                    </div>

                    {uploadError && (
                      <p className="text-[11px] text-rose-500 font-light">{uploadError}</p>
                    )}

                    {/* Direct Image URL input fallback */}
                    <div className="pt-1">
                      <input
                        type="url"
                        required
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        placeholder="Or paste direct image URL (https://...)"
                        className="w-full bg-transparent border-b border-black/15 dark:border-white/15 py-1 text-[11px] font-mono focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
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

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block">
                Available Size Architectures
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableSizes.map((size) => {
                  const active = formData.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                        active
                          ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                          : 'border-black/15 dark:border-white/15 text-stone-500 hover:border-black dark:hover:border-white'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
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
                <span>Mark Bestseller</span>
              </label>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-black dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;
