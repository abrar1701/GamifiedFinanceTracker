import React from 'react';
import { motion } from 'motion/react';
import { Coins, Lock, Unlock } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SavingsVaultProps {
  totalSaved: number;
  goal: number;
  className?: string;
}

export const SavingsVault: React.FC<SavingsVaultProps> = ({ totalSaved, goal, className }) => {
  const progress = Math.min(100, (totalSaved / goal) * 100);
  const isUnlocked = progress >= 100;

  return (
    <div className={cn("p-8 bg-gradient-to-br from-indigo-900 to-violet-950 rounded-3xl shadow-2xl border border-indigo-800/50 relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Coins className="w-32 h-32 text-white" />
      </div>
      
      <div className="relative z-10 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-300">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Savings Vault</span>
            </div>
            <h3 className="text-4xl font-black text-white tracking-tight">₹{totalSaved.toLocaleString()}</h3>
            <p className="text-indigo-300/70 text-sm">Goal: ₹{goal.toLocaleString()}</p>
          </div>
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
            isUnlocked ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]" : "bg-indigo-800/50 text-indigo-400"
          )}>
            {isUnlocked ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-4 bg-indigo-950 rounded-full overflow-hidden border border-indigo-800/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={cn(
                "h-full transition-all duration-500",
                isUnlocked ? "bg-emerald-400" : "bg-indigo-400"
              )}
            />
          </div>
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-indigo-300/50">
            <span>0%</span>
            <span>{progress.toFixed(0)}% Complete</span>
            <span>100%</span>
          </div>
        </div>

        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-center text-sm font-bold"
          >
            🎉 Goal Achieved! You've unlocked the Master Saver badge.
          </motion.div>
        )}
      </div>
    </div>
  );
};
