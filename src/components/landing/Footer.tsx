import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0b24f3] to-[#0b24f3] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-black text-white">NEST<span className="text-[#0b24f3]">BANK</span></span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">The future of digital banking. Secure, fast, and built for the modern world. Join millions who trust NestBank.</p>
            <div className="flex gap-3 mt-6">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#0b24f3] flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Product', links: ['Personal', 'Business', 'Cards', 'Transfers', 'Savings'] },
            { title: 'Company', links: ['About', 'Careers', 'Press', 'Blog', 'Contact'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies', 'Compliance'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="text-sm text-slate-400 hover:text-[#0b24f3] transition">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">© 2026 NestBank. All rights reserved. FDIC insured.</p>
          <div className="flex gap-6 text-xs text-slate-500">
            <span>🔒 256-bit SSL</span>
            <span>✓ SOC 2 Certified</span>
            <span>ISO 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
