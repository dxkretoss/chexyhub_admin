import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, ShoppingBag, Award, User } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setCustomers(data);
        }
      } catch (err) {
        console.warn('Failed to load customers from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  });

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 block mb-1">
            Client Relations
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-normal">
            ATELIER PATRONS ({customers.length})
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Live directory of registered storefront clientele and verified account profiles.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-[#121212]">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="SEARCH PATRONS BY NAME, EMAIL, OR PHONE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 pl-9 pr-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-black dark:focus:border-white"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10 text-stone-400 font-bold uppercase tracking-wider text-[10px] bg-stone-50/50 dark:bg-[#161616]">
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-4">Contact Coordinates</th>
                <th className="py-3 px-4">Account Type</th>
                <th className="py-3 px-4">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 font-light">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-stone-400">
                    {loading ? (
                      <span className="font-mono text-xs uppercase tracking-widest animate-pulse">
                        Synchronizing patron directory with Supabase...
                      </span>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wider text-black dark:text-white font-medium">
                          No registered patrons found in database.
                        </p>
                        <p className="text-[11px] text-stone-400">
                          When storefront customers register an account, their verified profiles will appear here.
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={c.name}
                          className="w-8 h-8 rounded-full object-cover border border-black/10 dark:border-white/10"
                        />
                        <div>
                          <p className="font-medium text-black dark:text-white">{c.name}</p>
                          <p className="text-[10px] text-stone-400 font-mono">ID: {c.id?.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-mono">{c.email}</p>
                      <p className="text-[10px] text-stone-400">{c.phone || 'No phone provided'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span>{c.role === 'customer' ? 'Boutique Client' : c.role}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-400 text-[10px]">
                      {c.created_at
                        ? new Date(c.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Recent'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Customers;
