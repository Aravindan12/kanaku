import React, { useState } from 'react';
import { Book } from '../types';
import { generateId } from '../services/storageService';
import { Button } from '../components/Button';
import { Plus, BookOpen, ChevronRight, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface HomeProps {
  books: Book[];
  onAddBook: (book: Book) => void;
  onSelectBook: (bookId: string) => void;
  onDeleteBook: (bookId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ books, onAddBook, onSelectBook, onDeleteBook }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBookName, setNewBookName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{id: string, name: string} | null>(null);

  const openModal = () => {
    // Default name: Current Month Year (e.g., October 2023)
    setNewBookName(format(new Date(), 'MMMM yyyy'));
    setIsModalOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookName.trim()) return;

    const newBook: Book = {
      id: generateId(),
      name: newBookName,
      createdAt: new Date().toISOString(),
      transactions: []
    };

    onAddBook(newBook);
    setIsModalOpen(false);
    // Optionally auto-open
    onSelectBook(newBook.id);
  };

  const handleDeleteClick = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    setDeleteTarget({ id: book.id, name: book.name });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      onDeleteBook(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-md rounded-b-[2rem] mb-6">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">KanakuBook</h1>
            <p className="text-blue-100 text-sm opacity-90">Track your expenses simply</p>
          </div>
          <div className="bg-blue-500 p-2 rounded-full shadow-inner">
             <BookOpen size={24} />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto max-w-3xl w-full mx-auto px-4 pb-24">
        <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">Your Books</h2>
        
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-60">
            <div className="bg-gray-200 p-6 rounded-full mb-4">
              <BookOpen size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No books found.</p>
            <p className="text-sm text-gray-400">Tap + to start tracking.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {books.map(book => {
               const balance = book.transactions.reduce((acc, curr) => 
                 curr.type === 'IN' ? acc + curr.amount : acc - curr.amount, 0
               );
               
               return (
                <div 
                  key={book.id} 
                  onClick={() => onSelectBook(book.id)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex justify-between items-center group relative overflow-hidden"
                >
                  <div className="flex gap-4 items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${balance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {book.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{book.name}</h3>
                      <p className={`text-sm font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {balance >= 0 ? 'Net: +' : 'Net: '}₹{Math.abs(balance).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 pl-2">
                    <button
                      onClick={(e) => handleDeleteClick(e, book)}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors z-10"
                      aria-label="Delete book"
                    >
                      <Trash2 size={20} />
                    </button>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </div>
               );
            })}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <button
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg shadow-blue-300 transition-transform active:scale-90 flex items-center gap-2 pr-6"
        >
          <Plus size={24} />
          <span className="font-bold">Add Book</span>
        </button>
      </div>

      {/* Create Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl scale-in-animation">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">New Book</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreate}>
              <label className="block text-sm font-medium text-gray-600 mb-2">Book Name</label>
              <input
                type="text"
                autoFocus
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-6 font-medium"
                value={newBookName}
                onChange={(e) => setNewBookName(e.target.value)}
              />
              <Button fullWidth type="submit">Create Book</Button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl scale-in-animation">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Book?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-bold text-gray-800">"{deleteTarget.name}"</span>? 
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="danger" fullWidth onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};