import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/Config';
import DashboardLayout from '@/components/DashboardLayout';
import { ArrowUpRight, ArrowDownLeft, Search, Download, Share2 } from 'lucide-react';
import jsPDF from "jspdf";

const Transactions: React.FC = () => {
  const { user } = useAuth();
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  useEffect(() => {
  if (!user?.uid) return;

  setLoading(true);

  const q = query(
    collection(db, 'nest_transactions'),
    where('participants', 'array-contains', user.uid),
    orderBy('created_at', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setTxs(data);
    setLoading(false);
  });

  return () => unsubscribe();
}, [user?.uid]);

  if (!user) return null;

  const filtered = txs.filter((t) => {
    const outgoing = t.sender_id === user.uid;
    if (filter === 'sent' && !outgoing) return false;
    if (filter === 'received' && outgoing) return false;
    if (q) {
      const s = q.toLowerCase();
      return (t.sender_name?.toLowerCase().includes(s) || t.receiver_name?.toLowerCase().includes(s) ||
              t.sender_account?.includes(s) || t.receiver_account?.includes(s));
    }
    return true;
  });

  const exportCSV = () => {
    const rows = [['Date', 'Type', 'Name', 'Account', 'Amount', 'Status']];
    filtered.forEach((t) => {
      const outgoing = t.sender_id === user.uid;
      rows.push([
        new Date(t.created_at).toLocaleString(),
        outgoing ? 'Sent' : 'Received',
        outgoing ? t.receiver_name : t.sender_name,
        outgoing ? t.receiver_account : t.sender_account,
        String(t.amount),
        t.status
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'nestbank-transactions.csv';
    a.click();
  };

  const downloadReceipt = (tx: any) => {
  const doc = new jsPDF();

  const isOutgoing = tx.sender_id === user.uid;

  doc.setFontSize(18);
  doc.text("NestBank Transaction Receipt", 20, 20);

  doc.setFontSize(12);
  doc.text(`Transaction ID: ${tx.id}`, 20, 40);
  doc.text(`Status: ${tx.status}`, 20, 50);
  doc.text(`Amount: $${Number(tx.amount).toLocaleString()}`, 20, 60);

  doc.text(`Sender: ${tx.sender_name}`, 20, 70);
  doc.text(`Sender Account: ${tx.sender_account}`, 20, 80);

  doc.text(`Receiver: ${tx.receiver_name}`, 20, 90);
  doc.text(`Receiver Account: ${tx.receiver_account}`, 20, 100);

  doc.text(
    `Date: ${
      tx.created_at?.toDate
        ? tx.created_at.toDate().toLocaleString()
        : new Date(tx.created_at).toLocaleString()
    }`,
    20,
    110
  );

  doc.text(`Type: ${isOutgoing ? "Sent" : "Received"}`, 20, 120);

  doc.save(`receipt-${tx.id}.pdf`);
};

const shareTransaction = async (tx: any) => {
  const isOutgoing = tx.sender_id === user.uid;

  const text = `
NestBank Transaction

ID: ${tx.id}
Status: ${tx.status}
Amount: $${Number(tx.amount).toLocaleString()}

From: ${tx.sender_name}
To: ${tx.receiver_name}

Type: ${isOutgoing ? "Sent" : "Received"}

Date: ${
    tx.created_at?.toDate
      ? tx.created_at.toDate().toLocaleString()
      : new Date(tx.created_at).toLocaleString()
  }
`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: "NestBank Transaction",
        text,
      });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Transaction copied to clipboard");
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Transactions</h1>
            <p className="text-slate-500">All your transaction history</p>
          </div>
          <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or account..." className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#0b24f3] focus:ring-2 focus:ring-[#0b24f3]/20 outline-none" />
          </div>
          <div className="flex gap-2">
            {(['all', 'sent', 'received'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-xl font-semibold text-sm capitalize transition ${filter === f ? 'bg-[#0b24f3] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500">No transactions match your filters.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((tx) => {
                const outgoing = tx.sender_id === user.uid;
                return (
                  <div key={tx.id} onClick={() => setSelectedTx(tx)} className="flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition cursor-pointer active:scale-[0.99] rounded-xl">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${outgoing ? 'bg-red-100 dark:bg-red-950/30 text-red-600' : 'bg-green-100 dark:bg-green-950/30 text-green-600'}`}>
                        {outgoing ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{outgoing ? tx.receiver_name : tx.sender_name}</p>
                        <p className="text-xs text-slate-500 truncate">{outgoing ? tx.receiver_account : tx.sender_account} • {tx.created_at?.toDate
                          ? tx.created_at.toDate().toLocaleString()
                          : tx.created_at
                          ? new Date(tx.created_at).toLocaleString()
                          : 'Pending...'}</p>
                        {tx.note && <p className="text-xs text-slate-400 mt-1 italic">"{tx.note}"</p>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className={`font-bold ${outgoing ? 'text-red-600' : 'text-green-600'}`}>{outgoing ? '-' : '+'}${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 text-[10px] font-semibold uppercase">{tx.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {selectedTx && (
  <div
    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    onClick={() => setSelectedTx(null)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95"
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#0b24f3] to-[#0b24f3] p-5 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80">Transaction</p>
            <h2 className="text-lg font-bold">Receipt Details</h2>
          </div>

          <button
            onClick={() => setSelectedTx(null)}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="p-5 space-y-4">
        
        {/* STATUS + AMOUNT */}
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              selectedTx.status === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30"
            }`}
          >
            {selectedTx.status}
          </span>

          <p className="text-xl font-black text-slate-900 dark:text-white">
            ${Number(selectedTx.amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* DETAILS CARD */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 space-y-3 text-sm">

          <div className="flex justify-between">
            <span className="text-slate-500">Sender</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {selectedTx.sender_name}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Sender Account</span>
            <span className="font-mono text-slate-900 dark:text-white">
              {selectedTx.sender_account}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Receiver</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {selectedTx.receiver_name}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Receiver Account</span>
            <span className="font-mono text-slate-900 dark:text-white">
              {selectedTx.receiver_account}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Date</span>
            <span className="text-slate-900 dark:text-white">
              {selectedTx.created_at?.toDate
                ? selectedTx.created_at.toDate().toLocaleString()
                : new Date(selectedTx.created_at).toLocaleString()}
            </span>
          </div>

          {selectedTx.note && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 text-xs">Note</span>
              <p className="text-slate-800 dark:text-slate-200 mt-1">
                {selectedTx.note}
              </p>
            </div>
          )}
        </div>

        {/* TRANSACTION ID */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-400">
            Transaction ID
          </p>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-300 break-all">
            {selectedTx.id}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => downloadReceipt(selectedTx)}
            className="flex items-center justify-center gap-2 bg-[#0b24f3] hover:bg-[#0b24f3]/80 text-white font-semibold py-3 rounded-xl transition"
          >
            <Download className="w-5 h-5" />
            <span className="sr-only">Download</span>
          </button>

          <button
            onClick={() => shareTransaction(selectedTx)}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold py-3 rounded-xl transition"
          >
            <Share2 className="w-5 h-5" />
            <span className="sr-only">Share</span>
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </DashboardLayout>
  );
};

export default Transactions;
