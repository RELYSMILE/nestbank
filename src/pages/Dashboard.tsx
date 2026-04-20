import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { auth, db } from '../lib/Config';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import DashboardLayout from '@/components/DashboardLayout';
import { Send, History, User, CreditCard, Copy, Check, TrendingUp, Eye, EyeOff, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showBal, setShowBal] = useState(true);

  const sentReady = useRef(false);
  const receivedReady = useRef(false);

useEffect(() => {
  if (!user) return;

  const txRef = collection(db, "nest_transactions");

  // Query for sent transactions
  const q1 = query(
    txRef,
    where("sender_id", "==", user.uid),
    orderBy("created_at", "desc"),
    limit(5)
  );

  // Query for received transactions
  const q2 = query(
    txRef,
    where("receiver_id", "==", user.uid),
    orderBy("created_at", "desc"),
    limit(5)
  );

  let sentTxs: any[] = [];
  let receivedTxs: any[] = [];

  const unsub1 = onSnapshot(q1, (snapshot) => {
  sentTxs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  sentReady.current = true;
  mergeTxs();
});

const unsub2 = onSnapshot(q2, (snapshot) => {
  receivedTxs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  receivedReady.current = true;
  mergeTxs();
});

  const mergeTxs = () => {
  const combined = [...sentTxs, ...receivedTxs]
    .sort((a, b) => {
      const aTime = a.created_at?.toDate?.() || new Date(a.created_at);
      const bTime = b.created_at?.toDate?.() || new Date(b.created_at);
      return bTime - aTime;
    })
    .slice(0, 5);

  setTxs(combined);

  if (sentReady && receivedReady) {
    setLoading(false);
  }
};

  return () => {
    unsub1();
    unsub2();
  };
}, [user?.uid]);

  const copy = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.account_number);
    setCopied(true);
    toast.success('Account number copied');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your account today.</p>
        </div>

        {user.frozen && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                ⚠️
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-700 dark:text-red-400">
                  Account Frozen
                </h3>
                <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                  Your account has been temporarily restricted. You cannot perform transactions at the moment.
                  Please contact customer support for assistance.
                </p>
              </div>
            </div>
          )}

        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 p-8 text-white shadow-2xl shadow-red-500/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[tomato] opacity-20 rounded-full blur-[120px]" />
          <div className="relative">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-300">Total Balance</p>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-4xl sm:text-5xl font-black tracking-tight">
                    {showBal ? `$${Number(user.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
                  </p>
                  <button onClick={() => setShowBal(!showBal)} className="p-2 rounded-lg hover:bg-white/10">
                    {showBal ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-green-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +2.5% this month</p>
              </div>
              <CreditCard className="w-8 h-8 text-white/60" />
            </div>
            <div className="mt-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400">Account Number</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-lg font-mono font-semibold">{user.account_number}</p>
                  <button onClick={copy} className="p-1.5 rounded-lg hover:bg-white/10">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">Bank</p>
                <p className="text-lg font-bold mt-1">{user.bank_name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { to: '/transfer', icon: Send, label: 'Send Money', color: 'from-[tomato] to-orange-500' },
            { to: '/transactions', icon: History, label: 'History', color: 'from-blue-500 to-blue-600' },
            { to: '/profile', icon: User, label: 'Profile', color: 'from-purple-500 to-purple-600' },
            { to: '/cards', icon: CreditCard, label: 'Cards', color: 'from-green-500 to-green-600' },

          ].map((a) => (
            <Link
              key={a.label}
              to={user.frozen ? "#" : a.to}
              onClick={(e) => {
                if (user.frozen) {
                  e.preventDefault();
                  toast.error('Account is frozen');
                }
              }}
              className={`group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all
                ${user.frozen ? 'opacity-50 cursor-not-allowed' : 'hover:border-[tomato]/30 hover:-translate-y-1 hover:shadow-xl'}
              `}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
                <a.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">{a.label}</p>
            </Link>
          ))}
        </div>

        {/* Recent transactions */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <Link to="/transactions" className="text-sm text-[tomato] font-semibold hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : txs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <History className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No transactions yet. Send your first transfer to get started!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {txs.map((tx) => {
                const outgoing = tx.sender_id === user.uid;
                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${outgoing ? 'bg-red-100 dark:bg-red-950/30 text-red-600' : 'bg-green-100 dark:bg-green-950/30 text-green-600'}`}>
                        {outgoing ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{outgoing ? tx.receiver_name : tx.sender_name}</p>
                        <p className="text-xs text-slate-500">{tx.created_at
                          ? new Date(
                              tx.created_at.toDate
                                ? tx.created_at.toDate()
                                : tx.created_at
                            ).toLocaleString()
                          : 'Loading...'}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${outgoing ? 'text-red-600' : 'text-green-600'}`}>
                      {outgoing ? '-' : '+'}${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
