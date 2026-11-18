import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';

function toDbRow(product) {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: product.category,
    pattern: product.pattern || 'Scottish Tartan',
    collection: product.collection || 'Highland Heritage',
    price: Number(product.price),
    original_price: Number(product.originalPrice || product.price),
    stock: Number(product.stock ?? 20),
    stock_status:
      product.stock > 15 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock',
    thumbnail: product.thumbnail,
    gallery: product.gallery || [],
    description: product.description || '',
    fabric: product.fabric || '100% Long-Staple Egyptian Cotton',
    sizes: product.sizes || ['S', 'M', 'L', 'XL'],
    colors: product.colors || [],
    is_featured: Boolean(product.isFeatured),
    is_best_seller: Boolean(product.isBestSeller),
  };
}

function fromDbRow(row) {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    slug: row.slug,
    category: row.category,
    pattern: row.pattern,
    collection: row.collection,
    price: Number(row.price),
    originalPrice: Number(row.original_price || row.price),
    stock: Number(row.stock),
    stockStatus: row.stock_status,
    thumbnail: row.thumbnail,
    gallery: row.gallery || [],
    description: row.description || '',
    fabric: row.fabric,
    sizes: row.sizes || ['S', 'M', 'L', 'XL'],
    colors: row.colors || [],
    isFeatured: Boolean(row.is_featured),
    isBestSeller: Boolean(row.is_best_seller),
    rating: Number(row.rating || 4.9),
    reviewsCount: row.reviews_count || 0,
    createdAt: row.created_at,
  };
}

export const useProductStore = create((set, get) => ({
  products: [],
  loading: true,

  // Fetch live products from Supabase
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const liveProducts = data.map(fromDbRow);
        set({ products: liveProducts, loading: false });
        return liveProducts;
      }
    } catch (err) {
      console.warn('Failed to fetch from Supabase:', err.message);
    }
    set({ products: [], loading: false });
    return [];
  },

  addProduct: async (productData) => {
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      sku:
        productData.sku ||
        `CH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      stockStatus:
        productData.stock > 15 ? 'In Stock' : productData.stock > 0 ? 'Low Stock' : 'Out of Stock',
    };

    // Optimistic update
    set({ products: [newProduct, ...get().products] });

    // Sync to Supabase
    try {
      await supabase.from('products').insert(toDbRow(newProduct));
    } catch (err) {
      console.warn('Supabase product insert error:', err);
    }

    return newProduct;
  },

  updateProduct: async (id, updates) => {
    const updated = get().products.map((p) => {
      if (p.id === id) {
        const next = { ...p, ...updates };
        if (typeof updates.stock === 'number') {
          next.stockStatus =
            updates.stock > 15 ? 'In Stock' : updates.stock > 0 ? 'Low Stock' : 'Out of Stock';
        }
        return next;
      }
      return p;
    });

    set({ products: updated });

    // Sync to Supabase
    try {
      const target = updated.find((p) => p.id === id);
      if (target) {
        await supabase.from('products').update(toDbRow(target)).eq('id', id);
      }
    } catch (err) {
      console.warn('Supabase product update error:', err);
    }
  },

  deleteProduct: async (id) => {
    set({ products: get().products.filter((p) => p.id !== id) });

    // Sync to Supabase
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase product delete error:', err);
    }
  },

  toggleFeatured: async (id) => {
    const target = get().products.find((p) => p.id === id);
    if (!target) return;
    const nextVal = !target.isFeatured;

    const updated = get().products.map((p) =>
      p.id === id ? { ...p, isFeatured: nextVal } : p
    );
    set({ products: updated });

    try {
      await supabase.from('products').update({ is_featured: nextVal }).eq('id', id);
    } catch (err) {
      console.warn('Supabase toggleFeatured error:', err);
    }
  },

  toggleBestSeller: async (id) => {
    const target = get().products.find((p) => p.id === id);
    if (!target) return;
    const nextVal = !target.isBestSeller;

    const updated = get().products.map((p) =>
      p.id === id ? { ...p, isBestSeller: nextVal } : p
    );
    set({ products: updated });

    try {
      await supabase.from('products').update({ is_best_seller: nextVal }).eq('id', id);
    } catch (err) {
      console.warn('Supabase toggleBestSeller error:', err);
    }
  },

  resetToDefault: async () => {
    // Refresh live products from Supabase
    await get().fetchProducts();
  },
}));
