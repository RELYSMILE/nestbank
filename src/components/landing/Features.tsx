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
          <span className="inline-block px-3 py-1 rounded-full bg-[#0b24f3]/10 text-[#0b24f3] text-xs font-semibold uppercase tracking-wider mb-4">Features</span>
          <h2 data-aos="fade-up" className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Everything you need to <span className="text-[#0b24f3]">bank smarter</span>
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b24f3] to-[#0b24f3] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
{/* Image Gallery Section */}
<div data-aos="fade-up" className="mt-16 hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
  
  {/* Image 1 */}
  <div className="overflow-hidden rounded-2xl shadow-lg group">
    <img
      src="/about-img-6.jpg"
      alt="Banking user"
      className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition duration-500"
    />
  </div>

  {/* Image 2 (slightly elevated center card feel) */}
  <div className="overflow-hidden rounded-2xl shadow-xl sm:-mt-6 group">
    <img
      src="/about-img-5.jpg"
      alt="Online payment"
      className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition duration-500"
    />
  </div>

  {/* Image 3 */}
  <div className="overflow-hidden rounded-2xl shadow-lg group">
    <img
      src="/wh-img-4.jpg"
      alt="Online payment"
      className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition duration-500"
    />
  </div>
</div>

{/* MOBILE ONLY IMAGE GALLERY */}
<div data-aos="fade-left" className="mt-16 lg:hidden grid grid-cols-2 gap-3">

  {/* LEFT STACK (2 images stacked) */}
  <div className="grid grid-rows-2 gap-3 h-[320px]">

    <div className="overflow-hidden rounded-2xl shadow-lg">
      <img
        src="/about-img-6.jpg"
        alt="Banking user"
        className="w-full h-full object-cover"
      />
    </div>

    <div className="overflow-hidden rounded-2xl shadow-lg">
      <img
        src="/wh-img-4.jpg"
        alt="Online payment"
        className="w-full h-full object-cover"
      />
    </div>

  </div>

  {/* RIGHT TALL IMAGE */}
  <div className="overflow-hidden rounded-2xl shadow-xl h-[320px]">
    <img
      src="/wh-img-6.jpg"
      alt="Online payment"
      className="w-full h-full object-cover"
    />
  </div>

</div>
{/* mobile version of the image gallery */}
      </div>
    </section>
  );
};

export default Features;
