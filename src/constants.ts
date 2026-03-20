import { Badge } from './types';

export const LEVEL_UP_FORMULA = (level: number) => Math.floor(100 * Math.pow(1.2, level - 1));

export const BADGES: Badge[] = [
  {
    id: 'first_100_saved',
    name: 'First $100 Saved',
    description: 'You saved your first $100. The journey begins!',
    icon: '💰',
  },
  {
    id: '7_day_streak',
    name: '7-Day No Spend Streak',
    description: 'You went 7 days without unnecessary spending.',
    icon: '🔥',
  },
  {
    id: 'budget_master',
    name: 'Budget Master',
    description: 'You stayed within your budget for a full month.',
    icon: '🏆',
  },
];

export const AVATAR_CLASSES = {
  Warrior: {
    description: 'Focuses on aggressive saving and cutting costs.',
    bonus: '1.2x XP for saving more than planned.',
  },
  Mage: {
    description: 'Focuses on strategic investing and long-term goals.',
    bonus: '1.2x XP for consistent tracking.',
  },
  Rogue: {
    description: 'Focuses on precise budgeting and zero-based tracking.',
    bonus: '1.2x XP for staying exactly on budget.',
  },
};
