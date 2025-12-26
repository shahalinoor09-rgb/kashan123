
import React, { useMemo } from 'react';
import { Wallet, Calendar, Clock } from 'lucide-react';
import { Expense } from '../types';

interface DashboardProps {
  expenses: Expense[];
}

const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    return expenses.reduce((acc, curr) => {
      acc.total += curr.amount;
      if (curr.date === todayStr) {
        acc.daily += curr.amount;
      }
      if (curr.date.startsWith(thisMonthStr)) {
        acc.monthly += curr.amount;
      }
      return acc;
    }, { total: 0, daily: 0, monthly: 0 });
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="p-2 bg-white/20 w-fit rounded-lg mb-4">
            <Wallet size={20} />
          </div>
          <p className="text-blue-100 font-medium">Total Balance Spent</p>
          <h2 className="text-3xl font-bold mt-1">${stats.total.toLocaleString()}</h2>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Calendar size={20} />
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">This Month</span>
        </div>
        <p className="text-slate-500 font-medium">Monthly Spending</p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">${stats.monthly.toLocaleString()}</h2>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Clock size={20} />
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Today</span>
        </div>
        <p className="text-slate-500 font-medium">Daily Outflow</p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">${stats.daily.toLocaleString()}</h2>
      </div>
    </div>
  );
};

export default Dashboard;
