import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { auth, db } from '../lib/Config';
import {
  doc,
  getDoc,
  runTransaction,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import DashboardLayout from '@/components/DashboardLayout';
import { Search, ArrowRight, Loader2, Check, AlertCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'account' | 'charges' | 'amount' | 'confirm' | 'pin' | 'success';

const Transfer: React.FC = () => {
  const { user, refresh } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState<Step>('account');
  const [accountNum, setAccountNum] = useState('');
  const [recipient, setRecipient] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState<any>(null);
  const [cot, setCot] = useState('');
  const [tax, setTax] = useState('');
  const [imf, setImf] = useState('');

useEffect(() => {
  const delay = setTimeout(() => {
    if (accountNum.length === 10) {
      handleAccountChange(accountNum);
    }
  }, 500);

  return () => clearTimeout(delay);
}, [accountNum]);
const handleAccountChange = async (value: string) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 10);
  setAccountNum(cleaned);

  setRecipient(null);
  setFound(null);

  if (cleaned.length !== 10) return;

  if (cleaned === user?.account_number) {
    toast.error("You cannot send to yourself");
    return;
  }

  setSearching(true);

  try {
    const q = query(
      collection(db, "nest_users"),
      where("account_number", "==", cleaned)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      setFound(null);
      setRecipient(null);
      return;
    }

    const data = snap.docs[0].data();
    setFound(data);
    setRecipient(data);

  } catch (e) {
    setFound(null);
  } finally {
    setSearching(false);
  }
};

  const proceedAmount = () => {
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) { toast.error('Enter a valid amount'); return; }
    if (amt > Number(user?.balance)) { toast.error('Insufficient balance'); return; }
    setStep('confirm');
  };

const submit = async () => {
  if (user.frozen) {
  toast.error('Your account is frozen. Contact support.');
  return;
}
  if (pin.length !== 4) {
    toast.error('Enter your 4-digit PIN');
    return;
  }

  setLoading(true);

  try {
    const amountNum = Number(amount);

    const senderRef = doc(db, "nest_users", user.uid);

    const receiverSnap = (await getDocs(collection(db, "nest_users")))
      .docs
      .find(d => d.data().account_number === accountNum);

    if (!receiverSnap) throw new Error("Recipient not found");

    const receiverRef = doc(db, "nest_users", receiverSnap.id);

    await runTransaction(db, async (transaction) => {
      const senderDoc = await transaction.get(senderRef);
      const receiverDoc = await transaction.get(receiverRef);

      if (!senderDoc.exists() || !receiverDoc.exists()) {
        throw new Error("User not found");
      }

      const senderData = senderDoc.data();
      const receiverData = receiverDoc.data();

      if (senderData.balance < amountNum) {
        throw new Error("Insufficient balance");
      }

      // PIN CHECK (IMPORTANT)
      if (senderData.pin !== pin) {
        throw new Error("Invalid PIN");
      }

      const newSenderBalance = senderData.balance - amountNum;
      const newReceiverBalance = receiverData.balance + amountNum;

      // Update balances
      transaction.update(senderRef, { balance: newSenderBalance });
      transaction.update(receiverRef, { balance: newReceiverBalance });

      // Create transaction record
      const txRef = doc(collection(db, "nest_transactions"));

      transaction.set(txRef, {
          sender_id: user.uid,
          receiver_id: receiverSnap.id,
          sender_name: senderData.name,
          receiver_name: receiverData.name,
          sender_account: senderData.account_number,
          receiver_account: receiverData.account_number,
          amount: amountNum,
          note: note || "",
          status: "success",
          participants: [user.uid, receiverSnap.id],
          created_at: serverTimestamp()
      });
    });

    await refresh();
    setStep('success');
    setResult({ newBalance: user.balance - amountNum });

  } catch (e: any) {
    toast.error(e.message || 'Transfer failed');
  } finally {
    setLoading(false);
  }
};

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto">
        {user.frozen && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            
            <div>
              <p className="font-semibold text-red-700 dark:text-red-400">
                Account Restricted
              </p>
              <p className="text-sm text-red-600 dark:text-red-300">
                Your account is currently restricted. You cannot perform transfers at this time.
                Please contact customer support.
              </p>
            </div>
          </div>
        )}
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Send Money</h1>
        <p className="text-slate-500 mb-8">Transfer funds instantly to any NestBank account</p>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {['account', 'charges', 'amount', 'confirm', 'success'].map((s, i) => {
            const idx = ['account', 'charges', 'amount', 'confirm', 'success'].indexOf(step);
            const mine = ['account', 'charges', 'amount', 'confirm', 'success'].indexOf(s);
            return <div key={s} className={`flex-1 h-1.5 rounded-full ${mine <= idx ? 'bg-[#0b24f3]' : 'bg-slate-200 dark:bg-slate-800'}`} />;
          })}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className={user.frozen? 'opacity-50 pointer-events-none' : ''}>
          {step === 'account' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">Recipient Account</h2>
              <p className="text-sm text-slate-500 mb-6">Enter the 10-digit NestBank account number</p>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={accountNum}
                  onChange={(e) => handleAccountChange(e.target.value)}
                  placeholder="0123456789"
                  inputMode="numeric"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#0b24f3] focus:ring-2 focus:ring-[#0b24f3]/20 outline-none font-mono text-lg tracking-widest"
                />
              </div>
              {searching && (
  <p className="text-sm text-slate-500 mt-3">Searching account...</p>
)}

{found && (
  <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0b24f3] to-[#0b24f3] flex items-center justify-center text-white font-bold">
      {found.name?.charAt(0)}
    </div>

    <div className="flex-1">
      <p className="font-bold text-slate-900 dark:text-white">{found.name}</p>
      <p className="text-xs text-slate-500">
        {found.bank_name} • {found.account_number}
      </p>
    </div>

    <Check className="w-5 h-5 text-green-600" />
  </div>
)}

{accountNum.length === 10 && !found && !searching && (
  <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
    <AlertCircle className="w-4 h-4" />
    Account not found
  </div>
)}
        <button
            onClick={() => setStep('charges')}
              disabled={!found || searching || user.frozen}
              className="w-full mt-6 py-3.5 rounded-xl bg-[#0b24f3] hover:bg-[#0b24f3]/80 text-white font-semibold shadow-lg shadow-[#0b24f3]/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
            </div>
          )}

          {step === 'charges' && recipient && (
  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
    
    <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">
      Security Verification
    </h2>
    <p className="text-sm text-slate-500 mb-6">
      Enter required transfer codes to proceed
    </p>

    <div className="space-y-4">
      
      <input
        value={cot}
        onChange={(e) => setCot(e.target.value.replace(/\D/g, '').slice(0, 4))}
        placeholder="Enter COT code"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#0b24f3] outline-none"
      />

      <input
        value={tax}
        onChange={(e) => setTax(e.target.value.replace(/\D/g, '').slice(0, 4))}
        placeholder="Enter TAX code"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#0b24f3] outline-none"
      />

      <input
        value={imf}
        onChange={(e) => setImf(e.target.value.replace(/\D/g, '').slice(0, 4))}
        placeholder="Enter IMF code"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#0b24f3] outline-none"
      />

    </div>

    <div className="flex gap-3 mt-6">
      <button
        onClick={() => setStep('account')}
        className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
      >
        Back
      </button>

      <button
        onClick={() => {
          if (cot !== '3411') return toast.error('Invalid COT code');
          if (tax !== '4533') return toast.error('Invalid TAX code');
          if (imf !== '4087') return toast.error('Invalid IMF code');

          setStep('amount');
        }}
        className="flex-1 py-3 rounded-xl bg-[#0b24f3] hover:bg-[#0b24f3]/80 text-white font-semibold shadow-lg shadow-[#0b24f3]/30"
      >
        Continue
      </button>
    </div>

  </div>
)}

          {step === 'amount' && recipient && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0b24f3] to-[#0b24f3] flex items-center justify-center text-white font-bold">
                  {recipient.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white">{recipient.name}</p>
                  <p className="text-xs text-slate-500">{recipient.bank_name} • {recipient.account_number}</p>
                </div>
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">Amount</h2>
              <p className="text-sm text-slate-500 mb-6">Available: ${Number(user.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                  placeholder="0.00"
                  inputMode="decimal"
                  className="w-full pl-10 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#0b24f3] focus:ring-2 focus:ring-[#0b24f3]/20 outline-none text-3xl font-bold"
                />
              </div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note (optional)"
                className="w-full mt-4 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#0b24f3] focus:ring-2 focus:ring-[#0b24f3]/20 outline-none"
              />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('account')} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold">Back</button>
                <button onClick={proceedAmount} className="flex-1 py-3 rounded-xl bg-[#0b24f3] hover:bg-[#0b24f3]/80 text-white font-semibold shadow-lg shadow-[#0b24f3]/30">Continue</button>
              </div>
            </div>
          )}

          {step === 'confirm' && recipient && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Confirm Transfer</h2>
              <div className="text-center mb-6">
                <p className="text-sm text-slate-500">You are sending</p>
                <p className="text-5xl font-black text-[#0b24f3] mt-2">${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <Row label="To" value={recipient.name} />
                <Row label="Account" value={recipient.account_number} />
                <Row label="Bank" value={recipient.bank_name} />
                <Row label="COT" value={cot} />
                <Row label="TAX" value={tax} />
                <Row label="IMF" value={imf} />
                {note && <Row label="Note" value={note} />}
                <Row label="Fee" value="$0.00" />
              </div>
              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Enter 4-digit PIN to confirm</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  inputMode="numeric"
                  className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#0b24f3] focus:ring-2 focus:ring-[#0b24f3]/20 outline-none text-center text-3xl tracking-[0.5em] font-bold"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('amount')} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold">Back</button>
                <button onClick={submit} disabled={loading || pin.length !== 4 || user.frozen} className="flex-1 py-3 rounded-xl bg-[#0b24f3] hover:bg-[#0b24f3]/80 text-white font-semibold shadow-lg shadow-[#0b24f3]/30 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Now
                </button>
              </div>
            </div>
          )}

          {step === 'success' && result && (
            <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-green-500 blur-2xl opacity-30 animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center animate-in zoom-in duration-700">
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Transfer Successful!</h2>
              <p className="text-slate-500 mt-2">${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} sent to {recipient?.name}</p>
              <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-left text-sm space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">Reference</span><span className="font-mono">{result.transaction?.id?.slice(0, 12)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">New balance</span><span className="font-bold">${Number(result.newBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => nav('/dashboard')} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold">Dashboard</button>
                <button onClick={() => { setStep('account'); setAccountNum(''); setRecipient(null); setAmount(''); setNote(''); setPin(''); setResult(null); }} className="flex-1 py-3 rounded-xl bg-[#0b24f3] hover:bg-[#0b24f3]/80 text-white font-semibold">Send Another</button>
              </div>
            </div>
          )}
        
        </div>
          </div>
        </div>
    </DashboardLayout>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}</span>
  </div>
);

export default Transfer;
