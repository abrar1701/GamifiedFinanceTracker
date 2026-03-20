import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Wallet, 
  Trophy, 
  Settings as SettingsIcon, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Shield,
  Zap,
  Target,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { UserProfile, Transaction, AvatarClass } from './types';
import { XPBar } from './components/XPBar';
import { AvatarCreator } from './components/AvatarCreator';
import { FinanceAnalytics } from './components/FinanceAnalytics';
import { SavingsVault } from './components/SavingsVault';
import { DeficitDragon } from './components/DeficitDragon';
import { TransactionForm } from './components/TransactionForm';
import { calculateBudgetXP, shouldLevelUp } from './utils';
import { LEVEL_UP_FORMULA } from './constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Initial User State
const INITIAL_USER_TEMPLATE = (name: string, avatarClass: AvatarClass, goal: number): UserProfile => ({
  uid: Math.random().toString(36).substr(2, 9),
  displayName: name,
  avatar: {
    class: avatarClass,
    level: 1,
    xp: 0,
    nextLevelXp: LEVEL_UP_FORMULA(1),
    streak: 1,
    lastLoggedDate: new Date().toISOString().split('T')[0],
  },
  stats: {
    totalSaved: 0,
    budgetAccuracy: 1,
    badges: [],
  },
  settings: {
    budgetPlan: '50/30/20',
    monthlyBudget: goal,
  },
});

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'rewards' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingTransaction, setIsLoggingTransaction] = useState(false);

  // Load data from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('finhero_user');
    const savedTransactions = localStorage.getItem('finhero_transactions');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  // Save data to local storage
  useEffect(() => {
    if (user) localStorage.setItem('finhero_user', JSON.stringify(user));
    if (transactions.length > 0) localStorage.setItem('finhero_transactions', JSON.stringify(transactions));
  }, [user, transactions]);

  const handleAvatarComplete = (avatarData: { class: AvatarClass; name: string; goal: number }) => {
    const newUser = INITIAL_USER_TEMPLATE(avatarData.name, avatarData.class, avatarData.goal);
    setUser(newUser);
  };

  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) return;

    const newTransaction: Transaction = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid,
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);

    // Calculate XP
    const earnedXP = calculateBudgetXP(user.settings.monthlyBudget / 30, data.amount, user.avatar.class);
    
    let newXP = user.avatar.xp + earnedXP;
    let newLevel = user.avatar.level;
    let nextXP = user.avatar.nextLevelXp;

    if (shouldLevelUp(newXP, nextXP)) {
      newLevel += 1;
      newXP -= nextXP;
      nextXP = LEVEL_UP_FORMULA(newLevel);
    }

    // Update total saved if it's income
    const savingsChange = data.type === 'income' ? data.amount : -data.amount;

    setUser({
      ...user,
      avatar: {
        ...user.avatar,
        xp: newXP,
        level: newLevel,
        nextLevelXp: nextXP,
      },
      stats: {
        ...user.stats,
        totalSaved: Math.max(0, user.stats.totalSaved + savingsChange),
      }
    });
  };

  const handleLogout = () => {
    setUser(null);
    setTransactions([]);
    localStorage.removeItem('finhero_user');
    localStorage.removeItem('finhero_transactions');
  };

  const analyticsData = useMemo(() => {
    const categories = ['Rent', 'Groceries', 'Dining', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];
    const monthlyBudget = user?.settings.monthlyBudget || 0;
    
    // Simple allocation for prototype
    const budgetPerCategory = monthlyBudget / categories.length;

    return categories.map(cat => {
      const spent = transactions
        .filter(t => t.category === cat && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return { category: cat, spent, budget: budgetPerCategory };
    });
  }, [transactions, user]);

  const totalSpent = useMemo(() => 
    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
  [transactions]);

  const totalIncome = useMemo(() => 
    transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
  [transactions]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <AvatarCreator onComplete={handleAvatarComplete} />
      </div>
    );
  }

  const overspent = Math.max(0, totalSpent - user.settings.monthlyBudget);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transition-transform duration-300 transform lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter text-gray-900 uppercase italic">FinHero</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all",
                  activeTab === item.id
                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-gray-100">
            <div className="p-4 bg-gray-50 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  {user.avatar.class === 'Warrior' && <Shield className="w-5 h-5" />}
                  {user.avatar.class === 'Mage' && <Zap className="w-5 h-5" />}
                  {user.avatar.class === 'Rogue' && <Target className="w-5 h-5" />}
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-gray-900">{user.displayName}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{user.avatar.class}</div>
                </div>
              </div>
              <XPBar currentXP={user.avatar.xp} nextLevelXP={user.avatar.nextLevelXp} level={user.avatar.level} />
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-4 mt-4 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#F8F9FC]/80 backdrop-blur-md border-b border-gray-100 lg:hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tighter text-gray-900 uppercase italic">FinHero</span>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Welcome back, {user.displayName}!</h1>
                    <p className="text-gray-500 font-medium">Your financial adventure continues. You're on a <span className="text-indigo-600 font-bold">{user.avatar.streak} day streak!</span></p>
                  </div>
                  <button 
                    onClick={() => setIsLoggingTransaction(true)}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Log Transaction
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <DeficitDragon overspent={overspent} budget={user.settings.monthlyBudget} />
                  <SavingsVault totalSaved={user.stats.totalSaved} goal={user.settings.monthlyBudget} />
                </div>

                <FinanceAnalytics 
                  data={analyticsData} 
                  totalBudget={user.settings.monthlyBudget} 
                  totalSpent={totalSpent} 
                />
              </motion.div>
            )}

            {activeTab === 'transactions' && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Transaction History</h2>
                    <p className="text-gray-500 font-medium">Keep track of every gold coin spent.</p>
                  </div>
                  <button 
                    onClick={() => setIsLoggingTransaction(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-50">
                          <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Date</th>
                          <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Description</th>
                          <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Category</th>
                          <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {transactions.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-medium">
                              No transactions logged yet. Start your journey!
                            </td>
                          </tr>
                        ) : (
                          transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-6 text-sm font-medium text-gray-500">{t.date}</td>
                              <td className="px-8 py-6 text-sm font-bold text-gray-900">{t.description}</td>
                              <td className="px-8 py-6">
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                  {t.category}
                                </span>
                              </td>
                              <td className={cn(
                                "px-8 py-6 text-sm font-black text-right",
                                t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                              )}>
                                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'rewards' && (
              <motion.div
                key="rewards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Hall of Heroes</h2>
                  <p className="text-gray-500 font-medium">Your achievements and badges earned on this quest.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.stats.badges.length === 0 ? (
                    <div className="col-span-full p-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center space-y-4">
                      <div className="text-4xl">🏅</div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-gray-900">No Badges Yet</h3>
                        <p className="text-sm text-gray-500">Complete financial tasks to earn your first badge!</p>
                      </div>
                    </div>
                  ) : (
                    user.stats.badges.map((badgeId) => (
                      <div key={badgeId} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4 text-center">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
                          {badgeId === 'first_100_saved' ? '💰' : '🔥'}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {badgeId === 'first_100_saved' ? 'First ₹100 Saved' : '7-Day Streak'}
                          </h3>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {badgeId === 'first_100_saved' 
                              ? 'You saved your first ₹100. The journey begins!' 
                              : 'You logged your finances for 7 consecutive days.'}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Transaction Modal */}
      <AnimatePresence>
        {isLoggingTransaction && (
          <TransactionForm 
            onClose={() => setIsLoggingTransaction(false)} 
            onSave={handleAddTransaction} 
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
