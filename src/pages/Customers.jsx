import React, { useState } from 'react';
import { Search, Mail, Phone, MapPin, ShoppingBag, Award } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';

export function Customers() {
  const { orders } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique customers from orders
  const customers = [
    {
      id: 'CUST-001',
      name: 'Aarav Mehta',
      email: 'aarav.mehta@example.com',
      phone: '+91 98200 12345',
      city: 'Mumbai, Maharashtra',
      tier: 'VIP Patron',
      ordersCount: 4,
      totalSpent: 18450,
      joined: 'September 2025'
    },
    {
      id: 'CUST-002',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@example.com',
      phone: '+91 98111 88442',
      city: 'Bengaluru, Karnataka',
      tier: 'Gold Atelier',
      ordersCount: 2,
      totalSpent: 7996,
      joined: 'October 2025'
    },
    {
      id: 'CUST-003',
      name: 'Kabir Singhania',
      email: 'kabir.s@example.com',
      phone: '+91 99887 66554',
      city: 'Gurugram, Haryana',
      tier: 'Platinum Family',
      ordersCount: 5,
      totalSpent: 26800,
      joined: 'July 2025'
    },
    {
      id: 'CUST-004',
      name: 'Devika Patel',
      email: 'devika.patel@example.com',
      phone: '+91 97245 11223',
      city: 'Vadodara, Gujarat',
      tier: 'Standard Client',
      ordersCount: 1,
      totalSpent: 1649,
      joined: 'November 2026'
    },
    {
      id: 'CUST-005',
      name: 'Rohan Deshmukh',
      email: 'rohan.d@example.com',
      phone: '+91 98670 54321',
      city: 'Pune, Maharashtra',
      tier: 'Standard Client',
      ordersCount: 1,
      totalSpent: 2610,
      joined: 'November 2026'
    }
  ];

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.phone.includes(q)
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
            Directory of registered clientele, purchase histories, and tier allocations.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-[#121212]">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="SEARCH PATRONS BY NAME, EMAIL, PHONE, OR CITY..."
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
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Membership Tier</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 font-light">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-black dark:text-white uppercase tracking-wider">
                      {c.name}
                    </p>
                    <p className="text-[10px] font-mono text-stone-400">{c.id}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="text-black dark:text-white">{c.email}</p>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5">{c.phone}</p>
                  </td>

                  <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300">
                    {c.city}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-black/15 dark:border-white/15">
                      <Award className="w-3 h-3 text-amber-500" />
                      <span>{c.tier}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-black dark:text-white">
                    {c.ordersCount} orders
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-black dark:text-white">
                    ₹{c.totalSpent.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                    {c.joined}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
