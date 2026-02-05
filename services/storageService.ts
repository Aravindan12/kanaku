import { Book, Category, Transaction } from '../types';
import { APP_STORAGE_KEY, CATEGORY_STORAGE_KEY, DEFAULT_CATEGORIES } from '../constants';

export const getBooks = (): Book[] => {
  try {
    const data = localStorage.getItem(APP_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading books from storage', error);
    return [];
  }
};

export const saveBooks = (books: Book[]): void => {
  try {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(books));
  } catch (error) {
    console.error('Error saving books to storage', error);
  }
};

export const getCategories = (): Category[] => {
  try {
    const data = localStorage.getItem(CATEGORY_STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  } catch (error) {
    console.error('Error reading categories from storage', error);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories to storage', error);
  }
};

// Helper to generate IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const exportBookToCSV = (book: Book) => {
  const headers = ['Date', 'Time', 'Type', 'Category', 'Description', 'Amount'];
  const rows = book.transactions.map(t => {
    const d = new Date(t.date);
    return [
      d.toLocaleDateString(),
      d.toLocaleTimeString(),
      t.type,
      `"${t.category}"`, // Quote to handle commas
      `"${t.description}"`,
      t.amount.toFixed(2)
    ].join(',');
  });

  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(',') + "\n" 
    + rows.join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${book.name.replace(/\s+/g, '_')}_Report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
