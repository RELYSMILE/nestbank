import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const { signIn, user } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);


// 👇 ADD IT HERE
useEffect(() => {
  if (user?.blocked) {
    toast.error('Your account has been blocked');
    nav('/login');
  }
}, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      nav('/dashboard');
    } catch (err: any) {
  const getFirebaseError = (code: string) => {
    switch (code) {
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later';
      default:
        return 'Login failed. Please try again';
    }
  };

const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    await signIn(email, password);

    // Wait a bit for user state to update
    setTimeout(() => {
      if (user?.blocked) {
        toast.error('Your account has been blocked');
        return;
      }

      toast.success('Welcome back!');
      nav('/dashboard');
    }, 500);

  } catch (err: any) {
    toast.error(err.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 relative overflow-hidden p-12 items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[tomato] opacity-30 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-md text-white">
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[tomato] to-orange-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black">NEST<span className="text-[tomato]">BANK</span></span>
          </Link>
          <h1 className="text-5xl font-black leading-tight">Welcome back to the future of banking.</h1>
          <p className="mt-6 text-slate-300 text-lg">Access your account securely with bank-grade encryption and biometric protection.</p>
          <div className="mt-12 space-y-4">
            {['Instant transfers in 0.2 seconds', '256-bit end-to-end encryption', 'Available in 120+ countries'].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[tomato]/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[tomato] rounded-full" />
                </div>
                <span className="text-slate-200">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[tomato] mb-8"><ArrowLeft className="w-4 h-4" /> Back to home</Link>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Sign in to your account</h2>
          <p className="mt-2 text-slate-500">Enter your credentials to continue.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[tomato] focus:ring-2 focus:ring-[tomato]/20 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[tomato] focus:ring-2 focus:ring-[tomato]/20 outline-none transition" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-[tomato] hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-[1.02] transition disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign in
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-slate-500">
            Don't have an account? <Link to="/signup" className="text-[tomato] font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
