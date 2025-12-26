
import React from 'react';
import { ShoppingCart, Car, Home, Film, Zap, Package } from 'lucide-react';
import { Category } from './types';

export const CATEGORIES: { label: Category; color: string; icon: React.ReactNode }[] = [
  { label: 'Food', color: '#f87171', icon: <ShoppingCart size={18} /> },
  { label: 'Transport', color: '#60a5fa', icon: <Car size={18} /> },
  { label: 'Rent', color: '#fbbf24', icon: <Home size={18} /> },
  { label: 'Entertainment', color: '#a78bfa', icon: <Film size={18} /> },
  { label: 'Utilities', color: '#34d399', icon: <Zap size={18} /> },
  { label: 'Other', color: '#94a3b8', icon: <Package size={18} /> },
];

export const STORAGE_KEY = 'financeflow_expenses_v1';
