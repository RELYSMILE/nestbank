import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/Config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import DashboardLayout from '@/components/DashboardLayout';
import VirtualCard, { CardData } from '@/components/VirtualCard';
import { Plus, Snowflake, Flame, Trash2, CreditCard, Edit2, X, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const colorOptions = [
  { value: 'tomato', label: 'Tomato', cls: 'from-[tomato] to-orange-700' },
  { value: 'midnight', label: 'Midnight', cls: 'from-slate-900 to-red-950' },
  { value: 'sunset', label: 'Sunset', cls: 'from-orange-500 to-pink-600' },
  { value: 'ocean', label: 'Ocean', cls: 'from-blue-600 to-slate-900' },
  { value: 'forest', label: 'Forest', cls: 'from-emerald-600 to-slate-900' },
];

const genCardNumber = () => {
  // Start with 4828 (NestBank BIN)
  let n = '4828';
  for (let i = 0; i < 12; i++) n += Math.floor(Math.random() * 10);
  return n;
};
const genCVV = () => String(Math.floor(100 + Math.random() * 900));
const genExpiry = () => {
  const d = new Date();
  return { month: Math.floor(Math.random() * 12) + 1, year: d.getFullYear() + 4 };
};

const Cards: React.FC = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<CardData | null>(null);
  const [txs, setTxs] = useState<any[]>([]);

  const [form, setForm] = useState({ card_name: 'Virtual Card', color: 'tomato', spending_limit: '1000' });
  const [editLimit, setEditLimit] = useState<{ id: string; value: string } | null>(null);

 const load = async () => {
  if (!user?.uid) return;
  setLoading(true);

  const q = query(
    collection(db, 'nest_cards'),
    where('user_id', '==', user.uid)
  );

  const snap = await getDocs(q);

  const data = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as CardData[];

  setCards(data);
  setLoading(false);
};

  useEffect(() => { load(); }, [user?.uid]);

  // Load card-specific transactions (derived from user's transactions as proxy)
useEffect(() => {
  const loadTx = async () => {
    if (!user?.uid || !selected) {
      setTxs([]);
      return;
    }

    const q = query(
      collection(db, 'nest_transactions'),
      where('sender_id', '==', user.uid)
    );

    const snap = await getDocs(q);

    const data = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    setTxs(data);
  };

  loadTx();
}, [selected?.id, user?.uid]);

  if (!user?.uid) return null;

  const createCard = async () => {
    if (user.frozen) {
        toast.error('Your account is restricted');
        return;
      }
    setCreating(true);
    try {
      const exp = genExpiry();
      await addDoc(collection(db, 'nest_cards'), ({
        user_id: user.uid,
        card_number: genCardNumber(),
        cvv: genCVV(),
        expiry_month: exp.month,
        expiry_year: exp.year,
        card_holder: user.name || 'User',
        card_name: form.card_name || 'Virtual Card',
        color: form.color,
        spent: 0,
        spending_limit: Number(form.spending_limit) || 0,
        created_at: serverTimestamp(),
      }));
      toast.success('Virtual card created!');
      setShowCreate(false);
      setForm({ card_name: 'Virtual Card', color: 'tomato', spending_limit: '1000' });
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setCreating(false);
    }
  };

 const toggleFreeze = async (card: CardData) => {
  if (user.frozen) {
      toast.error('Action not allowed. Account restricted');
      return;
    }
  try {
    await updateDoc(doc(db, 'nest_cards', card.id), {
      frozen: !card.frozen
    });

    toast.success(card.frozen ? 'Card unfrozen' : 'Card frozen');

    load();

    if (selected?.id === card.id) {
      setSelected({ ...card, frozen: !card.frozen });
    }
  } catch (error: any) {
    toast.error(error.message);
  }
};

  const deleteCard = async (card: CardData) => {
    if (user.frozen) {
      toast.error('Action not allowed. Account restricted');
      return;
    }
    if (!confirm('Delete this card permanently?')) return;

  try {
    await deleteDoc(doc(db, 'nest_cards', card.id));

    toast.success('Card deleted');
    setSelected(null);
    load();
  } catch (error: any) {
    toast.error(error.message);
  }
};

  const saveLimit = async () => {
    if (user.frozen) {
  toast.error('Action not allowed. Account restricted');
  return;
}
  if (!editLimit) return;

  const v = Number(editLimit.value);

  if (isNaN(v) || v < 0) {
    toast.error('Invalid limit');
    return;
  }

  try {
    await updateDoc(doc(db, 'nest_cards', editLimit.id), {
      spending_limit: v
    });

    toast.success('Limit updated');

    setEditLimit(null);
    load();
  } catch (error: any) {
    toast.error(error.message);
  }
};

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {user.frozen && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-start gap-3">
            <Flame className="w-5 h-5 text-red-600 mt-0.5" />

            <div>
              <p className="font-semibold text-red-700 dark:text-red-400">
                Account Restricted
              </p>
              <p className="text-sm text-red-600 dark:text-red-300">
                Your account is currently restricted. You cannot manage or create cards.
                Please contact customer support.
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Virtual Cards</h1>
              <p className="text-slate-500 mt-1">Generate unlimited virtual cards for safer online shopping</p>
            </div>
            <button
              onClick={() => {
                if (user.frozen) {
                  toast.error('Your account is restricted. You cannot create cards. Contact support.');
                  return;
                }
                setShowCreate(true);
              }}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold shadow-lg transition
                ${user.frozen
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#0b24f3] hover:bg-[#0b24f3]/80 hover:scale-[1.02] shadow-[#0b24f3]/30'}
              `}
            >
              <Plus className="w-4 h-4" />
              New Card
            </button>
          </div>

          <div className={user.frozen ? 'opacity-50 pointer-events-none' : ''}>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <div key={i} className="aspect-[1.586/1] rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-[tomato]/10 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-[tomato]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No cards yet</h3>
              <p className="text-slate-500 mt-2 mb-6">Create your first virtual card to start shopping safely online.</p>
              <button onClick={() => setShowCreate(true)} disabled={user.frozen} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0b24f3] text-white font-semibold shadow-lg shadow-[#0b24f3]/30 disabled:opacity-50">
                <Plus className="w-4 h-4" /> Create your first card
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((c) => (
                <div key={c.id} className="group">
                  <VirtualCard card={c} onClick={() => setSelected(c)} />
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Spent this month</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        $${Number(c.spent).toFixed(2)}
                        {c.spending_limit > 0 && <span className="text-slate-400 font-normal"> / ${Number(c.spending_limit).toFixed(2)}</span>}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => toggleFreeze(c)} disabled={user.frozen} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50" title={c.frozen ? 'Unfreeze' : 'Freeze'}>
                        {c.frozen ? <Flame className="w-4 h-4 text-orange-500" /> : <Snowflake className="w-4 h-4 text-cyan-600" />}
                      </button>
                      <button onClick={() => deleteCard(c)} disabled={user.frozen} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-950/30 hover:text-red-600 transition disabled:opacity-50" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {c.spending_limit > 0 && (
                    <div className="mt-2 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[tomato] to-orange-500 transition-all" style={{ width: `${Math.min(100, (Number(c.spent) / Number(c.spending_limit)) * 100)}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowCreate(false)}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Create Virtual Card</h2>
                <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
              </div>

              {/* Preview */}
              <div className="flex justify-center mb-6">
                <VirtualCard
                  card={{
                    id: 'preview', card_number: '4828' + '••••••••••••'.slice(4),
                    cvv: '•••', expiry_month: 12, expiry_year: new Date().getFullYear() + 4,
                    card_holder: user.name, card_name: form.card_name || 'Virtual Card',
                    color: form.color, frozen: false, spending_limit: 0, spent: 0,
                  }}
                  interactive={false}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Card Name</label>
                  <input value={form.card_name} onChange={(e) => setForm({ ...form, card_name: e.target.value })} placeholder="Shopping Card" maxLength={24}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[tomato] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Card Color</label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((c) => (
                      <button key={c.value} type="button" onClick={() => setForm({ ...form, color: c.value })}
                        className={`aspect-square rounded-xl bg-gradient-to-br ${c.cls} border-2 transition ${form.color === c.value ? 'border-slate-900 dark:border-white scale-105 shadow-lg' : 'border-transparent'}`}
                        title={c.label} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Monthly Spending Limit ($)</label>
                  <input type="number" value={form.spending_limit} onChange={(e) => setForm({ ...form, spending_limit: e.target.value })} placeholder="1000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[tomato] outline-none" />
                  <p className="text-xs text-slate-500 mt-1">Set to 0 for no limit</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold">Cancel</button>
                <button onClick={createCard} disabled={creating || user.frozen} className="flex-1 py-3 rounded-xl bg-[#0b24f3] hover:bg-[#0b24f3]/80 text-white font-semibold shadow-lg shadow-[#0b24f3]/30 disabled:opacity-50 flex items-center justify-center gap-2">
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Card
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelected(null)}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Card Details</h2>
                <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex justify-center mb-6">
                <VirtualCard card={selected} />
              </div>
              <p className="text-xs text-center text-slate-500 -mt-2 mb-6">Click the card to flip and reveal the CVV</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => toggleFreeze(selected)} className={`p-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${selected.frozen ? 'bg-orange-100 dark:bg-orange-950/30 text-orange-600 hover:bg-orange-200 dark:hover:bg-orange-950/50' : 'bg-cyan-100 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-200'}`}>
                  {selected.frozen ? <><Flame className="w-4 h-4" /> Unfreeze</> : <><Snowflake className="w-4 h-4" /> Freeze</>}
                </button>
                <button onClick={() => deleteCard(selected)} className="p-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-red-100 dark:bg-red-950/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-950/50 transition">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Spending Limit</p>
                  {editLimit?.id === selected.id ? (
                    <div className="flex gap-2">
                      <input type="number" value={editLimit.value} onChange={(e) => setEditLimit({ ...editLimit, value: e.target.value })} className="w-28 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm" />
                      <button onClick={saveLimit} className="px-3 py-1 rounded bg-[tomato] text-white text-xs font-semibold">Save</button>
                      <button onClick={() => setEditLimit(null)} className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 text-xs font-semibold">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditLimit({ id: selected.id, value: String(selected.spending_limit) })} className="flex items-center gap-1 text-xs text-[tomato] font-semibold">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  )}
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">${Number(selected.spent || 0).toFixed(2)}</span>
                  <span className="text-sm text-slate-500">
                    {selected.spending_limit > 0 ? `of $${Number(selected.spending_limit).toFixed(2)}` : 'No limit'}
                  </span>
                </div>
                {selected.spending_limit > 0 && (
                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[tomato] to-orange-500" style={{ width: `${Math.min(100, (Number(selected.spent) / Number(selected.spending_limit)) * 100)}%` }} />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Recent Activity</h3>
                {txs.length === 0 ? (
                  <p className="text-sm text-slate-500 py-6 text-center">No card transactions yet.</p>
                ) : (
                  <div className="space-y-2">
                    {txs.slice(0, 5).map((tx) => {
                      const outgoing = tx.sender_id === user.uid;
                      return (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${outgoing ? 'bg-red-100 dark:bg-red-950/30 text-red-600' : 'bg-green-100 dark:bg-green-950/30 text-green-600'}`}>
                              {outgoing ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{outgoing ? tx.receiver_name : tx.sender_name}</p>
                              <p className="text-xs text-slate-500">
                                  {tx.created_at?.toDate
                                    ? tx.created_at.toDate().toLocaleDateString()
                                    : new Date(tx.created_at).toLocaleDateString()}
                                </p>
                            </div>
                          </div>
                          <p className={`text-sm font-bold ${outgoing ? 'text-red-600' : 'text-green-600'}`}>{outgoing ? '-' : '+'}${Number(tx.amount).toFixed(2)}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Cards;
