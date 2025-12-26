
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Category, Expense } from '../types';
import { CATEGORIES } from '../constants';

interface ExpenseFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Expense | null;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'Other');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || parseFloat(amount) <= 0) return;

    const expenseData = {
      title,
      amount: parseFloat(amount),
      category,
      date,
      ...(initialData?.id ? { id: initialData.id, createdAt: initialData.createdAt } : {}),
    };

    onSubmit(expenseData);
  };

  return (
    <div className="flex flex-col">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">{initialData ? 'Edit Expense' : 'Add New Expense'}</h2>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">What did you buy?</label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekly Groceries"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Amount ($)</label>
            <input 
              type="number" 
              step="0.01"
              required
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => setCategory(cat.label)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  category === cat.label 
                  ? 'border-blue-600 bg-blue-50 text-blue-700 scale-[1.02]' 
                  : 'border-slate-100 hover:border-slate-300 text-slate-500'
                }`}
              >
                <span className={category === cat.label ? 'text-blue-600' : 'text-slate-400'}>
                  {cat.icon}
                </span>
                <span className="text-[10px] mt-1 font-bold uppercase tracking-wider">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Save size={20} />
          {initialData ? 'Save Changes' : 'Record Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
