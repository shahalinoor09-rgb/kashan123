
import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { Expense } from '../types';
import { CATEGORIES } from '../constants';

interface AnalyticsProps {
  expenses: Expense[];
  view: 'monthly' | 'category';
}

const Analytics: React.FC<AnalyticsProps> = ({ expenses, view }) => {
  const categoryData = useMemo(() => {
    const data = CATEGORIES.map(cat => ({
      name: cat.label,
      value: expenses.filter(e => e.category === cat.label).reduce((sum, e) => sum + e.amount, 0),
      color: cat.color
    })).filter(d => d.value > 0);
    return data;
  }, [expenses]);

  const monthlyTrendData = useMemo(() => {
    // Last 6 months trend
    const months: { [key: string]: number } = {};
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = 0;
    }

    expenses.forEach(e => {
      const monthKey = e.date.substring(0, 7);
      if (months.hasOwnProperty(monthKey)) {
        months[monthKey] += e.amount;
      }
    });

    return Object.entries(months).map(([name, amount]) => ({
      name: new Date(name + '-01').toLocaleDateString(undefined, { month: 'short' }),
      amount
    }));
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
        <p className="text-slate-400">Add some expenses to see visual insights</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-800">
          {view === 'monthly' ? 'Spending Trend' : 'Category Allocation'}
        </h3>
      </div>

      <div className="h-64 w-full">
        {view === 'category' ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
              />
              <Bar 
                dataKey="amount" 
                fill="#3b82f6" 
                radius={[6, 6, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {view === 'category' && (
        <div className="mt-6 space-y-3">
          {categoryData.sort((a,b) => b.value - a.value).slice(0, 3).map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-slate-600">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-slate-800">${item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Analytics;
