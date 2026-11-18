import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAdminThemeStore } from '../store/useAdminThemeStore';
import { toast } from 'sonner';

export function AdminLayout() {
  const { isAuthenticated, adminUser, logout } = useAdminAuthStore();
  const { theme, toggleTheme } = useAdminThemeStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out of atelier control');
    navigate('/login', { replace: true });
  };

  const navLinks = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Products', path: '/products', icon: Shirt },
    { label: 'Orders', path: '/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] dark:bg-[#0C0C0C] text-black dark:text-white transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#121212] border-r border-black/10 dark:border-white/10 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-black/10 dark:border-white/10">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/assets/logo.png"
                alt="CHEXY HUB"
                className="dark:hidden h-7 w-auto object-contain"
              />
              <img
                src="/assets/logo_dark.png"
                alt="CHEXY HUB"
                className="hidden dark:block h-7 w-auto object-contain"
              />
              <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-black text-white dark:bg-white dark:text-black font-semibold">
                ADMIN
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-stone-500 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition-all rounded-sm ${
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <img
                src={adminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt="Admin"
                className="w-8 h-8 rounded-full object-cover border border-black/15 dark:border-white/15"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{adminUser?.name || 'Administrator'}</p>
                <p className="text-[10px] text-stone-400 font-mono">Verified</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 px-6 bg-white dark:bg-[#121212] border-b border-black/10 dark:border-white/10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 text-black dark:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <img
                src="/assets/mob_logo.png"
                alt="CHEXY HUB"
                className="dark:hidden h-7 w-7 object-contain rounded"
              />
              <img
                src="/assets/mob_logo_dark.png"
                alt="CHEXY HUB"
                className="hidden dark:block h-7 w-7 object-contain rounded"
              />
              <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-black text-white dark:bg-white dark:text-black font-semibold">
                ADMIN
              </span>
            </Link>
            <div className="hidden sm:block">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400">
                CHEXY HUB • CENTRAL ATELIER HQ
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-black/10 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick Sign Out Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest border border-black/20 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
