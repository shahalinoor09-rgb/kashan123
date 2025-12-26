
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Download, LayoutDashboard, ListFilter, PieChart as PieChartIcon, TrendingUp, Search } from 'lucide-react';
import { Expense, Category } from './types';
import { STORAGE_KEY } from './constants';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Analytics from './components/Analytics';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'analytics'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setExpenses(prev => [newExpense, ...prev]);
    setIsFormOpen(false);
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(e => (e.id === updatedExpense.id ? updatedExpense : e)));
    setEditingExpense(null);
    setIsFormOpen(false);
  };

  const deleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const exportToCSV = () => {
    const headers = ['Title,Amount,Category,Date'];
    const rows = expenses.map(e => `"${e.title}",${e.amount},"${e.category}",${e.date}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || e.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchTerm, filterCategory]);

  return (
    <div className="min-h-screen pb-24 md:pb-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-5xl px-4 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-2 rounded-xl"><TrendingUp size={24} /></span>
            FinanceFlow
          </h1>
          <p className="text-slate-500 mt-1">Manage your wealth with precision.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={() => { setEditingExpense(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={18} />
            Add Expense
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl px-4 flex-grow">
        <Dashboard expenses={expenses} />

        <div className="mt-8">
          <div className="flex items-center gap-6 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`pb-3 flex items-center gap-2 font-medium transition-all ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
            >
              <LayoutDashboard size={18} />
              Insights
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`pb-3 flex items-center gap-2 font-medium transition-all ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
            >
              <ListFilter size={18} />
              Transactions
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`pb-3 flex items-center gap-2 font-medium transition-all ${activeTab === 'analytics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
            >
              <PieChartIcon size={18} />
              Analysis
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Analytics expenses={expenses} view="monthly" />
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Quick History</h3>
                <ExpenseList 
                  expenses={expenses.slice(0, 5)} 
                  onDelete={deleteExpense} 
                  onEdit={(e) => { setEditingExpense(e); setIsFormOpen(true); }} 
                  compact
                />
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="w-full md:w-auto px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Rent">Rent</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <ExpenseList 
                expenses={filteredExpenses} 
                onDelete={deleteExpense} 
                onEdit={(e) => { setEditingExpense(e); setIsFormOpen(true); }} 
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <Analytics expenses={expenses} view="category" />
          )}
        </div>
      </main>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <ExpenseForm 
              onClose={() => setIsFormOpen(false)} 
              onSubmit={editingExpense ? updateExpense : addExpense}
              initialData={editingExpense}
            />
          </div>
        </div>
      )}

      {/* Mobile Sticky Add Button */}
      <button 
        onClick={() => { setEditingExpense(null); setIsFormOpen(true); }}
        className="fixed bottom-8 right-8 md:hidden p-4 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-400 active:scale-90 transition-transform z-40"
      >
        <Plus size={28} strokeWidth={3} />
      </button>
    </div>
  );
};

export default App;
