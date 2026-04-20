import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from "@/components/theme-provider";
import { Shield, LayoutDashboard, Send, History, User, LogOut, Moon, Sun, Settings, Users, Menu, X, CreditCard } from 'lucide-react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/Config';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

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

  const items = user?.role === 'admin'
    ? [
        { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
        { to: '/admin/users', icon: Users, label: 'Users' },
        { to: '/admin/transactions', icon: History, label: 'Transactions' },
        { to: '/admin/settings', icon: Settings, label: 'Settings' },
      ]
    : [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/transfer', icon: Send, label: 'Transfer' },
        { to: '/cards', icon: CreditCard, label: 'Cards' },
        { to: '/transactions', icon: History, label: 'Transactions' },
        { to: '/profile', icon: User, label: 'Profile' },
      ];


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-0 left-0 z-50 w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0b24f3] to-[#0b24f3] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            {first}
            <span className="text-[#0b24f3]">
              {second}
            </span>
          </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {items.map((it) => {
            const active = loc.pathname === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${active ? 'bg-[#0b24f3] text-white shadow-lg shadow-[#0b24f3]/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <it.icon className="w-4 h-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button onClick={() => { signOut(); nav('/'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 h-16 flex items-center justify-between">
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1 lg:flex-none" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role === 'admin' ? 'Administrator' : user?.account_number}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0b24f3] to-[#0b24f3] flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8 animate-in fade-in duration-300">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
