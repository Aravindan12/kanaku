import { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', type: 'OUT' },
  { id: '2', name: 'Transport', type: 'OUT' },
  { id: '3', name: 'Salary', type: 'IN' },
  { id: '4', name: 'Shopping', type: 'OUT' },
  { id: '5', name: 'Entertainment', type: 'OUT' },
  { id: '6', name: 'Health', type: 'OUT' },
  { id: '7', name: 'Business', type: 'IN' },
  { id: '8', name: 'Loan', type: 'BOTH' },
  { id: '9', name: 'Rent', type: 'OUT' },
  { id: '10', name: 'Other', type: 'BOTH' },
];

export const APP_STORAGE_KEY = 'kanakubook_data_v1';
export const CATEGORY_STORAGE_KEY = 'kanakubook_categories_v1';
