import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { Button } from './Button';
import { X, Plus } from 'lucide-react';

interface TransactionFormProps {
  initialType: TransactionType;
  initialData?: Transaction;
  categories: Category[];
  onSave: (data: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
  onAddCategory: (name: string) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialType,
  initialData,
  categories,
  onSave,
  onClose,
  onAddCategory
}) => {
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date.slice(0, 16) || new Date().toISOString().slice(0, 16));
  
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Filter categories suitable for this transaction type or 'BOTH'
  const relevantCategories = categories.filter(
    c => c.type === initialType || c.type === 'BOTH'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSave({
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date).toISOString(),
      type: initialType,
    });
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setCategory(newCategoryName.trim()); // Auto select
      setIsAddingCategory(false);
      setNewCategoryName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl slide-up-animation">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${initialType === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
            {initialData ? 'Edit Entry' : initialType === 'IN' ? 'Cash In' : 'Cash Out'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* New Category Modal Overlay */}
        {isAddingCategory ? (
           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4 animate-scale-in">
             <h3 className="font-semibold mb-2">Add New Category</h3>
             <input
               type="text"
               placeholder="Category Name (e.g., Groceries)"
               className="w-full p-3 border rounded-xl mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
               value={newCategoryName}
               onChange={(e) => setNewCategoryName(e.target.value)}
               autoFocus
             />
             <div className="flex gap-2">
               <Button size="sm" variant="secondary" onClick={() => setIsAddingCategory(false)} className="flex-1 py-2">Cancel</Button>
               <Button size="sm" onClick={handleAddNewCategory} className="flex-1 py-2">Add</Button>
             </div>
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-bold">₹</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className={`w-full pl-8 pr-4 py-3 text-2xl font-bold border rounded-xl focus:ring-2 outline-none transition-colors ${
                    initialType === 'IN' ? 'text-green-600 border-green-200 focus:ring-green-500' : 'text-red-600 border-red-200 focus:ring-red-500'
                  }`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                required
                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                value={category}
                onChange={(e) => {
                  if (e.target.value === '__NEW__') {
                    setIsAddingCategory(true);
                  } else {
                    setCategory(e.target.value);
                  }
                }}
              >
                <option value="" disabled>Select a category</option>
                {relevantCategories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
                <option value="__NEW__" className="font-bold text-blue-600">+ Add New Category</option>
              </select>
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
              <input
                type="datetime-local"
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remark (Optional)</label>
              <input
                type="text"
                placeholder="Details about this transaction"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button type="submit" fullWidth variant={initialType === 'IN' ? 'success' : 'danger'} className="mt-4">
              {initialData ? 'Update Entry' : 'Save Entry'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
