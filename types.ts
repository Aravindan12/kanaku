export type TransactionType = 'IN' | 'OUT';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO String
  type: TransactionType;
}

export interface Book {
  id: string;
  name: string;
  createdAt: string;
  transactions: Transaction[];
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType | 'BOTH';
}

export type FilterTime = 'ALL' | 'TODAY' | 'THIS_MONTH';
export type FilterType = 'ALL' | 'IN' | 'OUT';
