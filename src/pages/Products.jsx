import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Star,
  Flame,
  Check,
  AlertCircle
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { DeleteConfirmModal } from '../components/products/DeleteConfirmModal';
import { toast } from 'sonner';

export function Products() {
  const {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    toggleBestSeller,
    resetToDefault
  } = useProductStore();

  React.useEffect(() => {
    if (fetchProducts) {
      fetchProducts();
    }
  }, [fetchProducts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState('all');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        p.collection.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchesCat =
        selectedCategory === 'all' || p.category === selectedCategory;

      const matchesStock =
        selectedStockStatus === 'all' || p.stockStatus === selectedStockStatus;

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, selectedStockStatus]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setIsFormModalOpen(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success(`"${productData.name}" updated successfully`);
    } else {
      addProduct(productData);
      toast.success(`"${productData.name}" added to catalog`);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
      toast.success(`"${deletingProduct.name}" removed from catalog`);
      setDeletingProduct(null);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 block mb-1">
            Inventory & Design Lab
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-normal">
            CHECK SHIRT CATALOG ({products.length})
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Add, update specifications, adjust pricing, and control checkered apparel stock.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-85 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add Check Shirt</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-[#121212] flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="SEARCH BY TITLE, SKU, COLLECTION..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 pl-9 pr-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-black dark:focus:border-white transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-stone-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none"
          >
            <option value="all">All Collections</option>
            <option value="men">Men's Checks</option>
            <option value="women">Women's Checks</option>
            <option value="kids">Kids' Checks</option>
            <option value="family">Family Sets</option>
          </select>

          {/* Stock Filter */}
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="bg-stone-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none"
          >
            <option value="all">All Stock Levels</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10 text-stone-400 font-bold uppercase tracking-wider text-[10px] bg-stone-50/50 dark:bg-[#161616]">
                <th className="py-3 px-4">Shirt Preview</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-stone-400">
                    {loading ? (
                      <span className="font-mono text-xs uppercase tracking-widest animate-pulse">
                        Synchronizing live catalog with Supabase...
                      </span>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wider text-black dark:text-white font-medium">No products in Supabase catalog.</p>
                        <p className="text-[11px] text-stone-400">Click &quot;New Allocation&quot; above to create a piece with image upload.</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <img
                        src={p.thumbnail}
                        alt={p.name}
                        className="w-12 h-14 object-cover bg-stone-100 dark:bg-stone-800 border border-black/10 dark:border-white/10"
                      />
                    </td>

                    {/* Title & SKU */}
                    <td className="py-3 px-4">
                      <p className="font-medium text-black dark:text-white">{p.name}</p>
                      <p className="text-[10px] text-stone-400 font-mono tracking-wider mt-0.5">
                        {p.sku} • {p.collection}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 border border-black/10 dark:border-white/10">
                        {p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-black dark:text-white">
                        ₹{p.price.toLocaleString()}
                      </p>
                      {p.originalPrice > p.price && (
                        <p className="font-mono text-[10px] text-stone-400 line-through">
                          ₹{p.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <StatusBadge status={p.stockStatus} />
                        <p className="text-[10px] text-stone-400 font-mono">{p.stock} units</p>
                      </div>
                    </td>

                    {/* Tags (Featured / Bestseller Toggles) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            toggleFeatured(p.id);
                            toast.info(`Featured tag updated for ${p.name}`);
                          }}
                          title="Toggle Featured on Home"
                          className={`p-1.5 border transition-colors ${
                            p.isFeatured
                              ? 'border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300'
                              : 'border-black/10 dark:border-white/10 text-stone-300 hover:text-stone-500'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            toggleBestSeller(p.id);
                            toast.info(`Bestseller tag updated for ${p.name}`);
                          }}
                          title="Toggle Bestseller Badge"
                          className={`p-1.5 border transition-colors ${
                            p.isBestSeller
                              ? 'border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300'
                              : 'border-black/10 dark:border-white/10 text-stone-300 hover:text-stone-500'
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors"
                          title="Edit Shirt Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title="Remove Shirt from Catalog"
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

      {/* Add / Edit Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        itemName={deletingProduct?.name}
      />
    </div>
  );
}
