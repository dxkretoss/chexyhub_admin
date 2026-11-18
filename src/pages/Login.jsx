import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAdminThemeStore } from '../store/useAdminThemeStore';
import { toast } from 'sonner';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAdminAuthStore();
  const { theme, toggleTheme } = useAdminThemeStore();
  const navigate = useNavigate();

  // If already authenticated, redirect straight to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter administrator credentials.');
      return;
    }
    setIsLoading(true);
    const result = await login({ email: email.trim(), password });
    setIsLoading(false);

    if (result.success) {
      toast.success('Welcome to CHEXY HUB Atelier Control');
      navigate('/', { replace: true });
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-[#0E0E0E] text-black dark:text-white transition-colors duration-300 lg:overflow-hidden select-none">
      {/* ============================================================== */}
      {/* LEFT SIDE: Fashion Check Shirt Campaign Imagery (Sticky Screensize) */}
      {/* ============================================================== */}
      <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-screen lg:sticky lg:top-0 overflow-hidden bg-stone-900 select-none flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1623162905251-e98a25a45a67?auto=format&fit=crop&w=1600&q=85"
          alt="CHEXY HUB Atelier Control"
          className="w-full h-full object-cover object-center animate-fade-in"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40 lg:bg-gradient-to-r lg:from-black/40 lg:via-black/20 lg:to-black/60" />



        {/* Bottom editorial caption on left */}
        <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 z-10 text-white">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-300 block mb-1">
            ATELIER CONTROL ARCHITECTURE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight">
            PRECISION CRAFT. <br />
            <span className="italic font-normal">CENTRAL CONTROL.</span>
          </h2>
          <p className="text-xs text-stone-300 font-light mt-1.5 max-w-md hidden sm:block leading-relaxed">
            Real-time inventory allocations, bespoke check pattern cataloguing, and fulfillment logistics tracking.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT SIDE: Dedicated Admin Sign In Form (Scrollable)          */}
      {/* ============================================================== */}
      <div className="w-full lg:w-1/2 min-h-screen lg:h-screen flex flex-col justify-start px-6 sm:px-10 lg:px-14 py-4 sm:py-6 overflow-y-auto">
        {/* Top bar on right: Logo & Theme switch */}
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/logo.png"
              alt="CHEXY HUB"
              className="dark:hidden h-8 sm:h-9 w-auto object-contain"
            />
            <img
              src="/assets/logo_dark.png"
              alt="CHEXY HUB"
              className="hidden dark:block h-8 sm:h-9 w-auto object-contain"
            />
            <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 bg-black text-white dark:bg-white dark:text-black font-semibold">
              ATELIER HQ
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 border border-black/15 dark:border-white/15 text-stone-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Center form (Vertically centered) */}
        <div className="w-full max-w-[460px] mx-auto my-auto py-4">
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 block mb-1">
              Restricted Control Console
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-black dark:text-white">
              ADMIN SIGN IN
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-light mt-1.5 leading-relaxed">
              Manage checkered shirt collections, inventory allocations, and client fulfillment dispatches.
            </p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Administrator Email *
              </label>
              <input
                type="email"
                name="admin_email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@chexyhub.com"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                className="w-full bg-transparent border-b border-black/30 dark:border-white/30 py-2.5 text-xs text-black dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                Security Key / Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="admin_password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security key"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  className="w-full bg-transparent border-b border-black/30 dark:border-white/30 py-2.5 pr-10 text-xs text-black dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-[0.22em] transition-opacity hover:opacity-85 flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Enter Admin Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] text-stone-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>256-bit TLS Encrypted Session</span>
            </div>
            <span className="text-[10px] font-mono">v1.0.0</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-3 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500 font-light mt-auto">
          <span>© {new Date().getFullYear()} CHEXY HUB ATELIER. ALL RIGHTS RESERVED.</span>
          <span className="uppercase tracking-widest text-[10px]">INTERNAL USE ONLY</span>
        </div>
      </div>
    </div>
  );
}
