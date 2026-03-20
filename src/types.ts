export type AvatarClass = 'Warrior' | 'Mage' | 'Rogue';

export interface UserProfile {
  uid: string;
  displayName: string;
  avatar: {
    class: AvatarClass;
    level: number;
    xp: number;
    nextLevelXp: number;
    streak: number;
    lastLoggedDate: string;
  };
  stats: {
    totalSaved: number;
    budgetAccuracy: number;
    badges: string[];
  };
  settings: {
    budgetPlan: '50/30/20' | 'Zero-Based' | 'Custom';
    monthlyBudget: number;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}
