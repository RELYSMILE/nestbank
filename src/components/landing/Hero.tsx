import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Globe, Users } from 'lucide-react';

const Hero: React.FC<{ title?: string; subtitle?: string }> = ({ title, subtitle }) => {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
      {/* Decorative gradient blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#0b24f3] opacity-20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400 opacity-20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,99,71,0.08),transparent_60%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-[#0b24f3] text-xs font-semibold mb-6">
          <span className="w-2 h-2 bg-[#0b24f3] rounded-full animate-pulse" />
          Trusted by 1,252,000+ customers worldwide
        </div>
          <h1  className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            {title || 'Secure Digital'}
            <br />
            <span className="bg-gradient-to-r from-[#0b24f3] to-[#0b24f3] bg-clip-text text-transparent">Smart Banking</span>
          </h1>
          <p  className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            {subtitle || 'Bank smarter with the most trusted fintech platform. Instant transfers, zero fees, world-class security — all in one app.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/signup" className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[#0b24f3] hover:bg-red-600 text-white font-semibold shadow-xl shadow-#0b24f3-500/30 hover:shadow-2xl hover:scale-[1.03] transition-all">
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold hover:border-[#0b24f3] hover:text-[#0b24f3] transition-all">
              Login to Account
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-500" /> Bank-grade security</div>
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /> Instant transfers</div>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /> 120+ countries</div>
          </div>
        </div>

    <div className="relative grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 animate-in fade-in slide-in-from-right-8 duration-700">

  {/* LEFT IMAGE */}
  <div data-aos="fade-right" className="relative">
    <img
      src="/hero-img-2.jpg"
      alt="Banking user"
      className="w-full h-[320px] sm:h-[420px] lg:h-[500px] object-cover rounded-tl-[4rem] rounded-br-3xl shadow-2xl shadow-black/10 hover:scale-[1.02] transition duration-500"
    />

    {/* soft glow */}
    <div className="absolute inset-0 rounded-tl-[4rem] rounded-br-3xl bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
  </div>

  {/* RIGHT IMAGE (OFFSET STYLE) */}
  <div data-aos="fade-left" className="flex flex-col justify-end">
    <img
      src="/hero-img-3.jpg"
      alt="Online payment"
      className="w-full h-[350px] sm:h-[320px] lg:h-[380px] object-cover rounded-bl-[3rem] rounded-tr-3xl shadow-2xl shadow-black/10 hover:scale-[1.02] transition duration-500 mt-10 sm:mt-16"
    />

    {/* optional subtle card feel */}
    <div className="absolute hidden lg:block w-40 h-40 bg-[tomato]/20 blur-3xl rounded-full -z-10 right-0 bottom-10" />
  </div>

  {/* Floating Active Users Card */}
<div className="absolute top-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-20 animate-floatY">
  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl border border-slate-100 hover:scale-105 transition">
    
    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
      <Users className="w-5 h-5 text-blue-600" />
    </div>

    <div className="leading-tight">
      <p className="text-sm font-bold text-slate-900">18.5M+</p>
      <p className="text-xs text-slate-500">Active Users</p>
    </div>
  </div>
</div>
{/* Floating Transactions Card */}
<div className="absolute bottom-6 left-4 sm:left-auto sm:right-10 z-20 animate-floatY [animation-delay:1.5s]">
  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl border border-slate-100 hover:scale-105 transition">
    
    <div className="w-10 h-10 rounded-full bg-[#0b24f3]/10 flex items-center justify-center">
      <Zap className="w-5 h-5 text-[#0b24f3]" />
    </div>

    <div className="leading-tight">
      <p className="text-sm font-bold text-slate-900">1.2B+</p>
      <p className="text-xs text-slate-500">Transactions Secured</p>
    </div>
  </div>
</div>
</div>

        {/* Floating card preview */}
        <div data-aos="fade-up" className="relative animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="relative mx-auto max-w-md">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#0b24f3] to-[#0b24f3] rounded-3xl opacity-20 blur-2xl" />
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-7 shadow-2xl shadow-red-500/20 border border-slate-700/50 transform hover:-translate-y-2 transition-transform duration-500">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">NestBank</p>
                  <p className="text-white font-bold mt-1">Platinum Card</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0b24f3] to-[#0b24f3] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl text-white font-mono tracking-widest">•••• •••• •••• 4829</p>
              <div className="mt-6 flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Card Holder</p>
                  <p className="text-sm text-white font-semibold">JANE DOE</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Balance</p>
                  <p className="text-sm text-white font-semibold">$24,580.00</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 p-4 w-56 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-green-600 rotate-[-45deg]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Received</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">+ $1,250.00</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -left-10 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 p-4 w-56 animate-in fade-in slide-in-from-top-4 duration-1000 delay-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0b24f3]/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#0b24f3]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Instant transfer</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">0.2 seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Shield = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default Hero;
