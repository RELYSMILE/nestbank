import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../lib/Config';
import { useAuth } from '@/contexts/AuthContext';
import { countries } from '@/lib/countries';
import { Shield, Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

const Signup: React.FC = () => {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', country: 'US',
    password: '', confirm: '', pin: '', confirmPin: ''
  });
  const [show, setShow] = useState(false);

  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  const validateStep1 = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email';
    if (form.phone.length < 6) return 'Invalid phone number';
    return null;
  };
  const validateStep2 = () => {
    if (form.password.length < 6) return 'Password must be 6+ characters';
    if (form.password !== form.confirm) return 'Passwords do not match';
    if (!/^\d{4}$/.test(form.pin)) return 'PIN must be exactly 4 digits';
    if (form.pin !== form.confirmPin) return 'PINs do not match';
    return null;
  };

  const next = () => {
    const err = step === 1 ? validateStep1() : step === 2 ? validateStep2() : null;
    if (err) { toast.error(err); return; }
    setStep(step + 1);
  };

const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-digit
};

const submit = async () => {
  setLoading(true);
  try {
    // 1. Create user in Firebase Auth
    const userCred = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    const uid = userCred.user.uid;

    // 2. Generate account number
    const accountNumber = generateAccountNumber();

    // 3. Save user profile in Firestore
    await setDoc(doc(db, "nest_users", uid), {
      uid,
      name: form.name,
      email: form.email,
      phone: form.phone,
      country: form.country,
      account_number: accountNumber,
      bank_name: "NESTBANK",
      balance: 0,
      pin: form.pin,
      role: "user",
      blocked: false,
      created_at: new Date().toISOString()
    });

    toast.success(`Account created! Your number: ${accountNumber}`);

    // 4. Auto login (already logged in by Firebase)
    nav("/dashboard");

  } catch (e: any) {
    toast.error(e.message || "Signup failed");
  } finally {
    setLoading(false);
  }
};

  const selectedCountry = countries.find((c) => c.code === form.country);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[tomato] mb-6"><ArrowLeft className="w-4 h-4" /> Back</Link>

        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[tomato] to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">NEST<span className="text-[tomato]">BANK</span></span>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3].map((n) => (
            <React.Fragment key={n}>
              <div className={`flex-1 h-2 rounded-full transition-all ${step >= n ? 'bg-[tomato]' : 'bg-slate-200 dark:bg-slate-800'}`} />
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-slate-500 mb-8">Step {step} of 3</p>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 p-6 sm:p-10 border border-slate-100 dark:border-slate-800">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Personal Details</h2>
              <p className="text-slate-500 mt-1 mb-6">Tell us a bit about yourself</p>
              <div className="space-y-4">
                <Field label="Full Name" value={form.name} onChange={(v) => update('name', v)} placeholder="Jane Doe" />
                <Field label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} placeholder="you@example.com" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Country</label>
                    <select value={form.country} onChange={(e) => update('country', e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[tomato] outline-none">
                      {countries.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder={`${selectedCountry?.dial} 555 123 4567`}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[tomato] focus:ring-2 focus:ring-[tomato]/20 outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Account Setup</h2>
              <p className="text-slate-500 mt-1 mb-6">Create a secure password and transaction PIN</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Password</label>
                  <div className="relative">
                    <input type={show ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min. 6 characters"
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[tomato] focus:ring-2 focus:ring-[tomato]/20 outline-none" />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Field label="Confirm Password" type="password" value={form.confirm} onChange={(v) => update('confirm', v)} placeholder="Re-enter password" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="4-Digit PIN" value={form.pin} onChange={(v) => update('pin', v.replace(/\D/g, '').slice(0, 4))} placeholder="••••" maxLength={4} />
                  <Field label="Confirm PIN" value={form.confirmPin} onChange={(v) => update('confirmPin', v.replace(/\D/g, '').slice(0, 4))} placeholder="••••" maxLength={4} />
                </div>
                <p className="text-xs text-slate-500 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3">
                  🔒 Your PIN is required for every transaction. Keep it private and never share it.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Review & Submit</h2>
              <p className="text-slate-500 mt-1 mb-6">Please verify your details before creating your account</p>
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5">
                <Row label="Full Name" value={form.name} />
                <Row label="Email" value={form.email} />
                <Row label="Phone" value={`${selectedCountry?.dial} ${form.phone}`} />
                <Row label="Country" value={`${selectedCountry?.flag} ${selectedCountry?.name}`} />
                <Row label="Password" value={'•'.repeat(form.password.length)} />
                <Row label="PIN" value="••••" />
              </div>
              <div className="mt-5 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-800 dark:text-green-200">You'll receive a welcome bonus of <b>$1,000</b> when you complete your first transaction and a unique 10-digit account number upon approval.</p>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Back</button>
            )}
            {step < 3 && (
              <button onClick={next} className="flex-1 px-6 py-3 rounded-xl bg-[tomato] hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/30 hover:scale-[1.02] transition flex items-center justify-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button>
            )}
            {step === 3 && (
              <button onClick={submit} disabled={loading} className="flex-1 px-6 py-3 rounded-xl bg-[tomato] hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/30 hover:scale-[1.02] transition flex items-center justify-center gap-2 disabled:opacity-50">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Account
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-sm text-center text-slate-500">Already have an account? <Link to="/login" className="text-[tomato] font-semibold hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; maxLength?: number }> = ({ label, value, onChange, placeholder, type = 'text', maxLength }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[tomato] focus:ring-2 focus:ring-[tomato]/20 outline-none transition" />
  </div>
);

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700/50 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}</span>
  </div>
);

export default Signup;
