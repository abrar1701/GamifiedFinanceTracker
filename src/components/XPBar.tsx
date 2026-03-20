import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  className?: string;
}

export const XPBar: React.FC<XPBarProps> = ({ currentXP, nextLevelXP, level, className }) => {
  const progress = Math.min(100, (currentXP / nextLevelXP) * 100);

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between items-end">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-indigo-600">Lvl {level}</span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Experience</span>
        </div>
        <div className="text-xs font-mono text-gray-500">
          {currentXP} / {nextLevelXP} XP
        </div>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
        />
      </div>
    </div>
  );
};
