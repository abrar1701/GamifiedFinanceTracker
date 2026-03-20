import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

interface FinanceAnalyticsProps {
  data: { category: string; spent: number; budget: number }[];
  totalBudget: number;
  totalSpent: number;
}

export const FinanceAnalytics: React.FC<FinanceAnalyticsProps> = ({ data, totalBudget, totalSpent }) => {
  const accuracy = totalSpent <= totalBudget ? 100 : Math.max(0, 100 - ((totalSpent - totalBudget) / totalBudget) * 100);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Monthly Budget</span>
          </div>
          <div className="text-3xl font-black text-emerald-900">₹{totalBudget.toLocaleString()}</div>
        </div>
        <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 space-y-2">
          <div className="flex items-center gap-2 text-rose-600">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Total Spent</span>
          </div>
          <div className="text-3xl font-black text-rose-900">₹{totalSpent.toLocaleString()}</div>
        </div>
        <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-2">
          <div className="flex items-center gap-2 text-indigo-600">
            <Target className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Accuracy Score</span>
          </div>
          <div className="text-3xl font-black text-indigo-900">{accuracy.toFixed(1)}%</div>
        </div>
      </div>

      <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Spending Breakdown</h3>
            <p className="text-sm text-gray-500">Compare your actual spending vs. your budget by category.</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar dataKey="spent" radius={[4, 4, 0, 0]} barSize={24}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.spent > entry.budget ? '#f43f5e' : '#6366f1'} />
                ))}
              </Bar>
              <Bar dataKey="budget" fill="#e5e7eb" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
