import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/Config';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, DollarSign, Activity, Search, Edit2, Ban, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<any>(null);
  const [newBal, setNewBal] = useState('');
  const [usersLoaded, setUsersLoaded] = useState(false);
const [txLoaded, setTxLoaded] = useState(false);
const [saving, setSaving] = useState(false);
const [selectedTx, setSelectedTx] = useState<any>(null);
const [newRole, setNewRole] = useState('user');

 useEffect(() => {
  if (!user) return;

  setLoading(true);

  // USERS
  const usersRef = collection(db, 'nest_users');

  const unsubUsers = onSnapshot(usersRef, (snapshot) => {
    const usersData = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
    setUsers(usersData);
    setUsersLoaded(true);
  });

  // TRANSACTIONS
  const txRef = collection(db, 'nest_transactions');
  const txQuery = query(txRef, orderBy('created_at', 'desc'));

  const unsubTxs = onSnapshot(txQuery, (snapshot) => {
    const txData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTxs(txData);
    setTxLoaded(true);
  });

  return () => {
    unsubUsers();
    unsubTxs();
  };
}, [user?.uid]);

useEffect(() => {
  if (usersLoaded && txLoaded) {
    setLoading(false);
  }
}, [usersLoaded, txLoaded]);


  if (!user) return null;
  if (user.role !== 'admin') {
    return <DashboardLayout><div className="text-center py-20"><h2 className="text-2xl font-bold">Forbidden</h2><p className="text-slate-500">Admin access required.</p></div></DashboardLayout>;
  }

  const filtered = users.filter((u) =>
  !q ||
  u.name?.toLowerCase().includes(q.toLowerCase()) ||
  u.email?.toLowerCase().includes(q.toLowerCase()) ||
  u.account_number?.includes(q)
);
  const totalBalance = users.reduce((s, u) => s + Number(u.balance), 0);
  const totalVolume = txs.reduce((s, t) => s + Number(t.amount), 0);

  const saveBalance = async () => {
  if (!editing) return;

  const bal = Number(newBal);
  if (isNaN(bal)) {
    toast.error('Invalid amount');
    return;
  }

  setSaving(true);

  try {
    const userRef = doc(db, 'nest_users', editing.uid);

    await updateDoc(userRef, {
      balance: bal,
      role: newRole // 👈 add this
    });

    toast.success('User updated successfully');
    setEditing(null);
  } catch {
    toast.error('Failed to update user');
  }

  setSaving(false);
};

const toggleBlock = async (u: any) => {
  try {
    const userRef = doc(db, 'nest_users', u.uid);

    const newStatus = !(u.blocked ?? false);

    await updateDoc(userRef, {
      blocked: newStatus
    });

    toast.success(newStatus ? 'User blocked' : 'User unblocked');
  } catch (err: any) {
    console.error("BLOCK ERROR:", err); // 👈 ADD THIS
    toast.error(err.message || 'Action failed');
  }
};

const formatDate = (d: any) => {
  if (!d) return '—';
  return d?.toDate
    ? d.toDate().toLocaleString()
    : new Date(d).toLocaleString();
};


  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Admin Panel</h1>
        <p className="text-slate-500 mb-8">Manage users, transactions, and system settings</p>

        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          <StatCard icon={Users} label="Total Users" value={users.length.toString()} color="from-blue-500 to-blue-600" />
          <StatCard icon={DollarSign} label="Total Balance" value={`$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} color="from-[tomato] to-orange-500" />
          <StatCard icon={Activity} label="Transactions" value={`${txs.length} / $${totalVolume.toLocaleString('en-US')}`} color="from-green-500 to-green-600" />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Users</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users..." className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-[tomato]" />
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-14 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 px-2">Name</th>
                    <th className="py-3 px-2">Account</th>
                    <th className="py-3 px-2">Balance</th>
                    <th className="py-3 px-2">Role</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((u) => (
                    <tr key={u.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-2">
                        <div className="font-semibold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs">{u.account_number}</td>
                      <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">${Number(u.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-2"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${u.role === 'admin' ? 'bg-[tomato]/10 text-[tomato]' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{u.role}</span></td>
                      <td className="py-3 px-2">{u.blocked ? <span className="text-red-600 text-xs font-semibold">Blocked</span> : <span className="text-green-600 text-xs font-semibold">Active</span>}</td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditing(u); setNewBal(String(u.balance)); setNewRole(u.role || 'user'); }} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700" title="Edit balance"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => toggleBlock(u)} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700" title={u.blocked ? 'Unblock' : 'Block'}>{u.blocked ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Ban className="w-4 h-4 text-red-600" />}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Transactions</h2>
          {loading ? <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" /> : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {txs.slice(0, 50).map((t) => (
                <div key={t.id} onClick={() => setSelectedTx(t)} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition">
                  <div>
                    <p className="font-semibold text-sm">{t.sender_name} → {t.receiver_name}</p>
                    <p className="text-xs text-slate-500">{formatDate(t.created_at)}</p>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">${Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">Manage User — {editing.name}</h3>
              <input type="number" value={newBal} onChange={(e) => setNewBal(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-[tomato]" />
              {/* ROLE SELECT */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                  User Role
                </label>

                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-[tomato] font-semibold"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold">Cancel</button>
<button
  onClick={saveBalance}
  className="flex-1 py-2.5 rounded-xl bg-[tomato] text-white font-semibold"
>
  {saving ? 'Saving...' : 'Save'}
</button>              </div>
            </div>
          </div>
        )}
      </div>
      {selectedTx && (
  <div
    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    onClick={() => setSelectedTx(null)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[tomato] to-orange-500 p-5 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80">
              Transaction
            </p>
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

        {/* DETAILS */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 space-y-3 text-sm">

          <div className="flex justify-between">
            <span className="text-slate-500">Sender</span>
            <span className="font-semibold">{selectedTx.sender_name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Sender Account</span>
            <span className="font-mono">{selectedTx.sender_account}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Receiver</span>
            <span className="font-semibold">{selectedTx.receiver_name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Receiver Account</span>
            <span className="font-mono">{selectedTx.receiver_account}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Date</span>
            <span>
              {selectedTx.created_at?.toDate
                ? selectedTx.created_at.toDate().toLocaleString()
                : new Date(selectedTx.created_at).toLocaleString()}
            </span>
          </div>

          {selectedTx.note && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 text-xs">Note</span>
              <p className="mt-1">{selectedTx.note}</p>
            </div>
          )}
        </div>

        {/* TX ID */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-400">
            Transaction ID
          </p>
          <p className="text-xs font-mono break-all">
            {selectedTx.id}
          </p>
        </div>
      </div>
    </div>
  </div>
)}
    </DashboardLayout>
  );
};

const StatCard: React.FC<{ icon: any; label: string; value: string; color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</p>
    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{value}</p>
  </div>
);

export default Admin;
