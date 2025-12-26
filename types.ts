
export type Category = 'Food' | 'Transport' | 'Rent' | 'Entertainment' | 'Utilities' | 'Other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
  createdAt: number;
}

export interface ExpenseSummary {
  total: number;
  monthly: number;
  daily: number;
}

export interface CategoryInsight {
  name: string;
  value: number;
  color: string;
}
