import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Target, Check } from 'lucide-react';
import { AvatarClass } from '../types';
import { AVATAR_CLASSES } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AvatarCreatorProps {
  onComplete: (avatar: { class: AvatarClass; name: string; goal: number }) => void;
}

export const AvatarCreator: React.FC<AvatarCreatorProps> = ({ onComplete }) => {
  const [selectedClass, setSelectedClass] = useState<AvatarClass | null>(null);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('5000');

  const classes: { id: AvatarClass; icon: React.ReactNode; color: string }[] = [
    { id: 'Warrior', icon: <Shield className="w-8 h-8" />, color: 'bg-emerald-500' },
    { id: 'Mage', icon: <Zap className="w-8 h-8" />, color: 'bg-indigo-500' },
    { id: 'Rogue', icon: <Target className="w-8 h-8" />, color: 'bg-amber-500' },
  ];

  const handleComplete = () => {
    if (selectedClass && name.trim() && goal) {
      onComplete({ class: selectedClass, name, goal: parseFloat(goal) });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900">Create Your Hero</h2>
          <p className="text-gray-500">Choose your path to financial freedom.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">Hero Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your hero name..."
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-lg font-medium"
            />
          </div>
          <div className="space-y-4">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">Savings Goal (₹)</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="5000"
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-lg font-medium"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">Choose Class</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <motion.button
                key={cls.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedClass(cls.id)}
                className={cn(
                  "relative p-6 rounded-2xl border-2 transition-all text-left space-y-4",
                  selectedClass === cls.id
                    ? "border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-100"
                    : "border-gray-100 bg-white hover:border-gray-200"
                )}
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white", cls.color)}>
                  {cls.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{cls.id}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {AVATAR_CLASSES[cls.id].description}
                  </p>
                </div>
                {selectedClass === cls.id && (
                  <div className="absolute top-4 right-4 text-indigo-500">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          disabled={!selectedClass || !name.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleComplete}
          className={cn(
            "w-full py-5 rounded-2xl font-bold text-lg shadow-lg transition-all",
            selectedClass && name.trim()
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Begin Your Adventure
        </motion.button>
      </div>
    </div>
  );
};
