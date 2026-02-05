import React, { useState, useMemo } from 'react';
import { Book, Transaction, TransactionType, Category, FilterTime, FilterType } from '../types';
import { Button } from '../components/Button';
import { TransactionForm } from '../components/TransactionForm';
import { exportBookToCSV } from '../services/storageService';
import { ArrowLeft, Download, Plus, Minus, Search, Calendar, Filter, Trash2, Edit2, TrendingUp, TrendingDown, Wallet, ChevronDown } from 'lucide-react';
import { format, isSameDay, isSameMonth, parseISO } from 'date-fns';

interface BookDetailsProps {
  book: Book;
  categories: Category[];
  onBack: () => void;
  onUpdateBook: (updatedBook: Book) => void;
  onAddCategory: (name: string) => void;
}

export const BookDetails: React.FC<BookDetailsProps> = ({
  book,
  categories,
  onBack,
  onUpdateBook,
  onAddCategory
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<TransactionType>('OUT');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  
  // Filters
  const [filterTime, setFilterTime] = useState<FilterTime>('ALL');
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Derived State
  const sortedTransactions = useMemo(() => {
    return [...book.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [book.transactions]);

  const filteredTransactions = useMemo(() => {
    return sortedTransactions.filter(t => {
      const date = parseISO(t.date);
      const now = new Date();
      
      const matchesTime = 
        filterTime === 'ALL' ? true :
        filterTime === 'TODAY' ? isSameDay(date, now) :
        filterTime === 'THIS_MONTH' ? isSameMonth(date, now) : true;

      const matchesType = 
        filterType === 'ALL' ? true : t.type === filterType;

      const matchesCategory = 
        filterCategory === 'ALL' ? true : t.category === filterCategory;

      const matchesSearch = 
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTime && matchesType && matchesCategory && matchesSearch;
    });
  }, [sortedTransactions, filterTime, filterType, filterCategory, searchQuery]);

  const stats = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;
    filteredTransactions.forEach(t => {
      if (t.type === 'IN') totalIn += t.amount;
      else totalOut += t.amount;
    });
    return { totalIn, totalOut, balance: totalIn - totalOut };
  }, [filteredTransactions]);

  // Actions
  const handleSaveTransaction = (data: Omit<Transaction, 'id'>) => {
    let newTransactions;
    if (editingTransaction) {
      newTransactions = book.transactions.map(t => 
        t.id === editingTransaction.id ? { ...data, id: t.id } : t
      );
    } else {
      newTransactions = [
        ...book.transactions,
        { ...data, id: Date.now().toString() } // Simple ID
      ];
    }
    onUpdateBook({ ...book, transactions: newTransactions });
    setShowForm(false);
    setEditingTransaction(undefined);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm("Delete this entry?")) {
      const newTransactions = book.transactions.filter(t => t.id !== id);
      onUpdateBook({ ...book, transactions: newTransactions });
    }
  };

  const handleEditClick = (t: Transaction) => {
    setFormType(t.type);
    setEditingTransaction(t);
    setShowForm(true);
  };

  const openAddForm = (type: TransactionType) => {
    setEditingTransaction(undefined);
    setFormType(type);
    setShowForm(true);
  };

  // Group by Date for display
  const groupedTransactions: { [key: string]: Transaction[] } = {};
  filteredTransactions.forEach(t => {
    const dateKey = format(parseISO(t.date), 'EEE, dd MMM yyyy');
    if (!groupedTransactions[dateKey]) groupedTransactions[dateKey] = [];
    groupedTransactions[dateKey].push(t);
  });

  // Check if any filter is active
  const isFilterActive = filterTime !== 'ALL' || filterType !== 'ALL' || filterCategory !== 'ALL';

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between p-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-800 truncate max-w-[200px]">{book.name}</h1>
          </div>
          <button 
            onClick={() => exportBookToCSV(book)}
            className="flex items-center gap-2 text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1.5 rounded-lg"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          
          {/* Dashboard Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Net Balance</p>
              <h2 className={`text-4xl font-bold mt-1 ${stats.balance >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
                ₹{stats.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="bg-green-50 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <TrendingUp size={16} />
                  <span className="text-xs font-bold uppercase">Total In</span>
                </div>
                <p className="text-lg font-bold text-green-800">
                  + ₹{stats.totalIn.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-red-700 mb-1">
                  <TrendingDown size={16} />
                  <span className="text-xs font-bold uppercase">Total Out</span>
                </div>
                <p className="text-lg font-bold text-red-800">
                  - ₹{stats.totalOut.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search entries..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-xl border flex items-center gap-2 ${showFilters || isFilterActive ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                <Filter size={20} />
                {isFilterActive && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
              </button>
            </div>

            {showFilters && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-lg animate-fade-in space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                   <h3 className="font-bold text-gray-800">Filters</h3>
                   {isFilterActive && (
                     <button 
                        onClick={() => {
                          setFilterTime('ALL');
                          setFilterType('ALL');
                          setFilterCategory('ALL');
                        }}
                        className="text-xs text-red-500 font-semibold hover:text-red-700"
                     >
                       Clear All
                     </button>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Time Period */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Time Period</label>
                    <div className="relative">
                      <select
                        value={filterTime}
                        onChange={(e) => setFilterTime(e.target.value as FilterTime)}
                        className="w-full p-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                      >
                        <option value="ALL">All Time</option>
                        <option value="TODAY">Today</option>
                        <option value="THIS_MONTH">This Month</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Type</label>
                    <div className="relative">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as FilterType)}
                        className="w-full p-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                      >
                        <option value="ALL">All Types</option>
                        <option value="IN">Cash In</option>
                        <option value="OUT">Cash Out</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>
                
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</label>
                  <div className="relative">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full p-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    >
                      <option value="ALL">All Categories</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transactions List */}
          <div className="space-y-6">
            {Object.keys(groupedTransactions).length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <Wallet size={48} className="mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500">No transactions found</p>
                {(isFilterActive || searchQuery) && (
                   <p className="text-xs mt-1 text-blue-500 cursor-pointer" onClick={() => {
                     setFilterTime('ALL');
                     setFilterType('ALL');
                     setFilterCategory('ALL');
                     setSearchQuery('');
                   }}>Clear Filters</p>
                )}
              </div>
            ) : (
              Object.keys(groupedTransactions).map(dateKey => (
                <div key={dateKey}>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{dateKey}</span>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                    {groupedTransactions[dateKey].map(t => (
                      <div key={t.id} className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                             <span className="font-semibold text-gray-800 truncate">{t.category}</span>
                             <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{format(parseISO(t.date), 'HH:mm')}</span>
                          </div>
                          {t.description && <p className="text-sm text-gray-500 truncate">{t.description}</p>}
                        </div>
                        
                        <div className="flex items-center gap-3">
                           <div className={`text-right font-bold ${t.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === 'IN' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN')}
                          </div>
                          {/* Actions (visible on hover/active or simple click) */}
                          <div className="flex gap-1 ml-1">
                            <button onClick={() => handleEditClick(t)} className="p-1.5 text-gray-400 hover:text-blue-500 bg-gray-50 rounded-lg">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteTransaction(t.id)} className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe-area z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <Button 
            variant="success" 
            fullWidth 
            onClick={() => openAddForm('IN')}
            className="flex-1 py-3 text-lg"
          >
            <Plus size={20} /> Cash In
          </Button>
          <Button 
            variant="danger" 
            fullWidth 
            onClick={() => openAddForm('OUT')}
            className="flex-1 py-3 text-lg"
          >
            <Minus size={20} /> Cash Out
          </Button>
        </div>
      </footer>

      {showForm && (
        <TransactionForm
          initialType={formType}
          initialData={editingTransaction}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSave={handleSaveTransaction}
          onAddCategory={onAddCategory}
        />
      )}
    </div>
  );
};