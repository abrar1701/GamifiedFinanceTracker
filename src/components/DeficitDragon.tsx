import React from 'react';
import { motion } from 'motion/react';
import { Flame, Sword, Shield, Heart } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DeficitDragonProps {
  overspent: number;
  budget: number;
  className?: string;
}

export const DeficitDragon: React.FC<DeficitDragonProps> = ({ overspent, budget, className }) => {
  const isOverspent = overspent > 0;
  const healthPercentage = Math.max(0, 100 - (overspent / budget) * 100);
  const dragonHealth = isOverspent ? healthPercentage : 0;
  const heroHealth = isOverspent ? 100 - (overspent / budget) * 100 : 100;

  return (
    <div className={cn("p-8 bg-slate-950 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-t from-rose-950/30 to-transparent pointer-events-none" />
      
      <div className="relative z-10 space-y-12">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-rose-500">
            <Flame className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Monthly Boss Fight</span>
          </div>
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">The Deficit Dragon</h3>
        </div>

        <div className="flex justify-between items-center gap-8">
          {/* Hero Side */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/50">
                <Sword className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Your Hero</div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <div className="text-sm font-black text-white">{heroHealth.toFixed(0)}% HP</div>
                </div>
              </div>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${heroHealth}%` }}
                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              />
            </div>
          </div>

          {/* VS Divider */}
          <div className="text-slate-700 font-black text-4xl italic tracking-tighter">VS</div>

          {/* Dragon Side */}
          <div className="flex-1 space-y-4 text-right">
            <div className="flex items-center justify-end gap-3">
              <div className="space-y-1 text-right">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-widest">Deficit Dragon</div>
                <div className="flex items-center justify-end gap-1">
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <div className="text-sm font-black text-white">{dragonHealth.toFixed(0)}% HP</div>
                </div>
              </div>
              <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-900/50">
                <Flame className="w-6 h-6" />
              </div>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dragonHealth}%` }}
                className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl text-center space-y-4">
          {isOverspent ? (
            <div className="space-y-2">
              <p className="text-rose-400 text-sm font-bold uppercase tracking-widest">The Dragon is Attacking!</p>
              <p className="text-slate-400 text-xs leading-relaxed">
                You've overspent by <span className="text-white font-bold">₹{overspent.toLocaleString()}</span>. 
                The Dragon deals damage to your health. Cut spending next month to heal!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Critical Hit!</p>
              <p className="text-slate-400 text-xs leading-relaxed">
                You've stayed under budget! Your hero deals a massive blow to the Deficit Dragon. 
                Keep it up to earn the <span className="text-white font-bold">Dragon Slayer</span> badge.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
