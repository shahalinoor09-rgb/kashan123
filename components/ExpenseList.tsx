
import React from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import { Expense } from '../types';
import { CATEGORIES } from '../constants';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  compact?: boolean;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, onEdit, compact = false }) => {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
        <Calendar size={48} className="mb-3 opacity-20" />
        <p className="font-medium">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const categoryConfig = CATEGORIES.find(c => c.label === expense.category);
        
        return (
          <div 
            key={expense.id} 
            className={`group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all ${compact ? 'py-3' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div 
                className="p-2.5 rounded-xl flex items-center justify-center" 
                style={{ backgroundColor: `${categoryConfig?.color}15`, color: categoryConfig?.color }}
              >
                {categoryConfig?.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 leading-tight">{expense.title}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-tight">{expense.category}</span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-400">{new Date(expense.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-slate-900">
                ${expense.amount.toFixed(2)}
              </span>
              
              {!compact && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(expense)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(expense.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;
