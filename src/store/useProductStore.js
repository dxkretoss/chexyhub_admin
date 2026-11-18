import { create } from 'zustand';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const PRODUCTS_STORAGE_KEY = 'chexyhub_admin_products';

export const useProductStore = create((set, get) => ({
  products: (() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  })(),

  addProduct: (productData) => {
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      sku: productData.sku || `CH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      stockStatus: productData.stock > 15 ? 'In Stock' : productData.stock > 0 ? 'Low Stock' : 'Out of Stock'
    };

    const updated = [newProduct, ...get().products];
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    set({ products: updated });
    return newProduct;
  },

  updateProduct: (id, updates) => {
    const updated = get().products.map((p) => {
      if (p.id === id) {
        const next = { ...p, ...updates };
        if (typeof updates.stock === 'number') {
          next.stockStatus = updates.stock > 15 ? 'In Stock' : updates.stock > 0 ? 'Low Stock' : 'Out of Stock';
        }
        return next;
      }
      return p;
    });

    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    set({ products: updated });
  },

  deleteProduct: (id) => {
    const updated = get().products.filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    set({ products: updated });
  },

  toggleFeatured: (id) => {
    const updated = get().products.map((p) =>
      p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
    );
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    set({ products: updated });
  },

  toggleBestSeller: (id) => {
    const updated = get().products.map((p) =>
      p.id === id ? { ...p, isBestSeller: !p.isBestSeller } : p
    );
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    set({ products: updated });
  },

  resetToDefault: () => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    set({ products: INITIAL_PRODUCTS });
  }
}));
