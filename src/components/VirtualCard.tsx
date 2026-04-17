import React, { useState } from 'react';
import { Shield, Wifi, Snowflake, Eye, EyeOff } from 'lucide-react';

export interface CardData {
  id: string;
  card_number: string;
  cvv: string;
  expiry_month: number;
  expiry_year: number;
  card_holder: string;
  card_name: string;
  color: string;
  frozen: boolean;
  spending_limit: number;
  spent: number;
}

const colorMap: Record<string, string> = {
  tomato: 'from-[tomato] via-red-600 to-orange-700',
  midnight: 'from-slate-900 via-red-950 to-slate-900',
  sunset: 'from-orange-500 via-[tomato] to-pink-600',
  ocean: 'from-blue-600 via-indigo-700 to-slate-900',
  forest: 'from-emerald-600 via-teal-700 to-slate-900',
};

const VirtualCard: React.FC<{ card: CardData; onClick?: () => void; interactive?: boolean }> = ({ card, onClick, interactive = true }) => {
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const gradient = colorMap[card.color] || colorMap.tomato;
  const formatNum = (n: string) => (n.match(/.{1,4}/g) || []).join(' ');
  const masked = '•••• •••• •••• ' + card.card_number.slice(-4);

  return (
    <div
      className={`relative w-full aspect-[1.586/1] max-w-sm ${interactive ? 'cursor-pointer' : ''}`}
      style={{ perspective: '1200px' }}
      onClick={() => {
        if (!interactive) return;
        if (onClick) onClick();
        else setFlipped(!flipped);
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* FRONT */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} p-6 shadow-2xl shadow-red-500/30 overflow-hidden ${card.frozen ? 'opacity-70' : ''}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* decorative patterns */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-black/20 rounded-full blur-3xl" />
          {card.frozen && (
            <div className="absolute inset-0 bg-cyan-500/20 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-2 text-white">
                <Snowflake className="w-10 h-10" />
                <span className="text-xs font-bold uppercase tracking-widest">Frozen</span>
              </div>
            </div>
          )}

          <div className="relative h-full flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-70">NestBank</p>
                <p className="font-bold mt-0.5">{card.card_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 opacity-80 rotate-90" />
                <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                  <Shield className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Chip */}
            <div className="flex items-center gap-3 -mt-2">
              <div className="w-11 h-8 rounded-md bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 relative overflow-hidden shadow-inner">
                <div className="absolute inset-1 grid grid-cols-3 gap-0.5">
                  {[...Array(6)].map((_, i) => <div key={i} className="bg-yellow-700/30 rounded-[1px]" />)}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xl sm:text-2xl font-mono tracking-[0.15em] font-semibold">
                {revealed ? formatNum(card.card_number) : masked}
              </p>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="text-[9px] uppercase tracking-widest opacity-70">Holder</p>
                  <p className="text-sm font-bold truncate max-w-[150px]">{card.card_holder.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest opacity-70">Expires</p>
                  <p className="text-sm font-bold">{String(card.expiry_month).padStart(2, '0')}/{String(card.expiry_year).slice(-2)}</p>
                </div>
                <div className="w-12 h-8 relative">
                  <div className="absolute inset-y-0 right-0 w-8 h-8 rounded-full bg-red-500 opacity-80" />
                  <div className="absolute inset-y-0 right-3 w-8 h-8 rounded-full bg-yellow-400 opacity-80 mix-blend-screen" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} shadow-2xl shadow-red-500/30 overflow-hidden`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="h-12 bg-black mt-6" />
          <div className="p-6 text-white">
            <div className="bg-white/90 text-slate-900 rounded p-3 flex items-center justify-between">
              <div className="flex-1 h-6 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,#e5e7eb_3px,#e5e7eb_6px)]" />
              <div className="ml-4">
                <p className="text-[9px] uppercase tracking-widest opacity-60">CVV</p>
                <p className="font-mono font-bold text-lg">{card.cvv}</p>
              </div>
            </div>
            <div className="mt-4 font-mono text-lg tracking-[0.15em] text-center">
              {formatNum(card.card_number)}
            </div>
            <p className="mt-4 text-[10px] opacity-70 text-center">For customer service, call +1 (800) NESTBANK. This card remains the property of NestBank.</p>
          </div>
        </div>
      </div>

      {interactive && !flipped && (
        <button
          onClick={(e) => { e.stopPropagation(); setRevealed(!revealed); }}
          className="absolute bottom-4 right-4 z-20 w-8 h-8 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/50 transition"
          title={revealed ? 'Hide number' : 'Reveal number'}
        >
          {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
};

export default VirtualCard;
