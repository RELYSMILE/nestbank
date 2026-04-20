import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-white via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-[[#0b24f3]] blur-3xl opacity-30 animate-pulse" />
          <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0b24f3] to-[#0b24f3] flex items-center justify-center shadow-2xl shadow-red-500/30">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            NEST<span className="text-[#0b24f3]">BANK</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Secure Digital Banking</p>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-[#0b24f3] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#0b24f3] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#0b24f3] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
