import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Sarah Johnson', role: 'Entrepreneur, USA', quote: 'NestBank transformed how I manage my business finances. The instant transfers save me hours every week.', rating: 5 },
  { name: 'Ahmed Hassan', role: 'Freelancer, UAE', quote: 'The best banking app I have ever used. Clean interface, fast transactions, and excellent customer support.', rating: 5 },
  { name: 'Priya Sharma', role: 'Developer, India', quote: 'Sending money internationally used to be a nightmare. With NestBank, it takes seconds and costs nothing.', rating: 5 },
];

const flags = ['🇺🇸','🇬🇧','🇨🇦','🇦🇺','🇩🇪','🇫🇷','🇳🇬','🇿🇦','🇮🇳','🇯🇵','🇧🇷','🇦🇪','🇪🇸','🇳🇱','🇸🇬','🇰🇷','🇨🇭','🇸🇪'];

const Trust: React.FC = () => {
  return (
    <section id="trust" className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-[#0b24f3]/10 text-[#0b24f3] text-xs font-semibold uppercase tracking-wider mb-4">Testimonials</span>
          <h2 data-aos="zoom-in" className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Loved by customers <span className="text-[#0b24f3]">worldwide</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t) => (
            <div data-aos="fade-right" data-aos-offset="300" data-aos-easing="ease-in-sine" key={t.name} className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1">
              <Quote className="w-8 h-8 text-[tomato]/30 mb-4" />
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[[#0b24f3]] text-[#0b24f3]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
          <div style={{marginTop: '-2rem', marginBottom: '2rem'}} className="flex gap-4 items-center">
            
            <div className="w-1/2 overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/about-img-5.jpg"
                alt="Banking user"
                className="w-full h-40 object-cover"
              />
            </div>

            <div className="w-1/2 overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/wh-img-5.jpg"
                alt="Banking user"
                className="w-full h-40 object-cover"
              />
            </div>

          </div>

        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider font-semibold">Available in 120+ countries</p>
          <div className="flex flex-wrap justify-center gap-3 text-3xl">
            {flags.map((f, i) => (
              <span key={i} className="hover:scale-125 transition-transform cursor-default">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
