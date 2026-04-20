import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Shield, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/Config';

const Navbar: React.FC<{ transparent?: boolean }> = ({ transparent }) => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [settings, setSettings] = useState<{ app_name: string; } | null>(null);

  useEffect(() => {
    const ref = doc(db, 'nest_settings', 'app');
  
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as any);
      }
    });
  
    return () => unsub();
  }, []);

  const appName  = settings?.app_name || 'NEST BANK';
  const cleanName = appName.replace(/\s+/g, '');
  const first = cleanName.slice(0, 4);   // NEST
  const second = cleanName.slice(4);     // BANK

  return (
    <nav className={`${transparent ? 'absolute top-0 left-0 right-0 z-40 bg-transparent' : 'sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0b24f3] to-[#0b24f3] flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            {first}
            <span className="text-[#0b24f3]">
              {second}
            </span>
          </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[tomato] transition-colors">Features</a>
            <a href="#stats" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[tomato] transition-colors">Stats</a>
            <a href="#trust" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[tomato] transition-colors">Security</a>
            <a href="#footer" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[tomato] transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-slate-300" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold text-slate-900 dark:text-white transition">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button onClick={() => { signOut(); navigate('/'); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Sign out">
                  <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Login</Link>
                <Link to="/signup" className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[tomato] hover:bg-red-600 shadow-lg shadow-red-500/20 hover:scale-105 transition">Get Started</Link>
              </div>
            )}

            <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <a href="#features" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Features</a>
            <a href="#stats" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Stats</a>
            {user ? (
              <>
                <button onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-slate-100 dark:bg-slate-800">Dashboard</button>
                <button onClick={() => signOut()} className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-600">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-lg text-sm font-semibold">Login</Link>
                <Link to="/signup" className="block px-3 py-2 rounded-lg text-sm font-semibold bg-[tomato] text-white text-center">Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
