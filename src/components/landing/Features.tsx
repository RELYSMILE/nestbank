import React from 'react';
import { Zap, ShieldCheck, Globe, Smartphone, CreditCard, TrendingUp, Lock, Users } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Instant Transfers', desc: 'Send money to anyone in seconds, 24/7 with zero delays.', color: 'yellow' },
  { icon: ShieldCheck, title: 'Bank-Grade Security', desc: '256-bit encryption and biometric authentication protect every account.', color: 'green' },
  { icon: Globe, title: 'Global Reach', desc: 'Transfer money across 120+ countries with competitive exchange rates.', color: 'blue' },
  { icon: Smartphone, title: 'Mobile First', desc: 'Beautifully designed app that works flawlessly on any device.', color: 'purple' },
  { icon: CreditCard, title: 'Virtual Cards', desc: 'Generate unlimited virtual cards for safer online shopping.', color: 'pink' },
  { icon: TrendingUp, title: 'Smart Analytics', desc: 'Track spending patterns and get personalized financial insights.', color: 'orange' },
  { icon: Lock, title: 'Fraud Protection', desc: 'Real-time monitoring and instant alerts keep your money safe.', color: 'red' },
  { icon: Users, title: 'Family Accounts', desc: 'Manage accounts for family members with parental controls.', color: 'teal' },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-[tomato]/10 text-[tomato] text-xs font-semibold uppercase tracking-wider mb-4">Features</span>
          <h2 data-aos="fade-up" className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Everything you need to <span className="text-[tomato]">bank smarter</span>
          </h2>
          <p data-aos="fade-up" className="mt-4 text-lg text-slate-600 dark:text-slate-300">Powerful features built for the modern world. Designed with privacy and security first.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              data-aos="fade-up"
              data-aos-delay={i * 80}
              key={f.title}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-[tomato]/30 hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[tomato] to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
