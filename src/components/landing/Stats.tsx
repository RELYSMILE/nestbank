import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 52400, suffix: '+', label: 'Active Users', prefix: '' },
  { value: 180, suffix: 'M+', label: 'Transactions', prefix: '$' },
  { value: 99, suffix: '%', label: 'Satisfaction', prefix: '' },
  { value: 120, suffix: '+', label: 'Countries', prefix: '' },
];

const CountUp: React.FC<{ end: number; duration?: number; prefix?: string; suffix?: string }> = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(end * eased));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const Stats: React.FC = () => {
  return (
    <section id="stats" className="py-20 sm:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0b24f3] opacity-20 blur-[150px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 data-aos="zoom-in" className="text-4xl sm:text-5xl font-black text-white tracking-tight">Trusted worldwide by <span className="text-[#0b24f3]">millions</span></h2>
          <p className="mt-4 text-slate-300 text-lg">Join the fastest-growing digital bank on the planet.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-[tomato]/40 transition">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-2">
                <CountUp end={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p className="text-sm font-medium text-slate-300 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
