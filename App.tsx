import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { BookDetails } from './pages/BookDetails';
import { Book, Category } from './types';
import { getBooks, saveBooks, getCategories, saveCategories, generateId } from './services/storageService';
import { HashRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';

const AppContent: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load initial data
  useEffect(() => {
    setBooks(getBooks());
    setCategories(getCategories());
  }, []);

  // Save on change
  useEffect(() => {
    saveBooks(books);
  }, [books]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  const handleAddBook = (book: Book) => {
    setBooks(prev => [book, ...prev]);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
  };

  const handleDeleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const handleSelectBook = (id: string) => {
    setSelectedBookId(id);
    navigate(`/book/${id}`);
  };

  const handleBack = () => {
    setSelectedBookId(null);
    navigate('/');
  };

  const handleAddCategory = (name: string) => {
    // Check if exists
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
    
    const newCat: Category = {
      id: generateId(),
      name,
      type: 'BOTH' // User defined categories usually apply to both or expenses mostly, safer to allow both
    };
    setCategories(prev => [...prev, newCat]);
  };

  return (
    <div className="h-[100dvh] w-full bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              books={books} 
              onAddBook={handleAddBook} 
              onSelectBook={handleSelectBook} 
              onDeleteBook={handleDeleteBook}
            />
          } 
        />
        <Route 
          path="/book/:id" 
          element={
            <BookRouteWrapper 
              books={books}
              categories={categories}
              onBack={handleBack}
              onUpdateBook={handleUpdateBook}
              onAddCategory={handleAddCategory}
            />
          } 
        />
      </Routes>
    </div>
  );
};

// Helper component to extract ID from params
const BookRouteWrapper: React.FC<{
  books: Book[];
  categories: Category[];
  onBack: () => void;
  onUpdateBook: (b: Book) => void;
  onAddCategory: (n: string) => void;
}> = ({ books, categories, onBack, onUpdateBook, onAddCategory }) => {
  const { id } = useParams();
  const book = books.find(b => b.id === id);

  if (!book) {
    return <div className="p-10 text-center">Book not found. <button onClick={onBack} className="text-blue-500 underline">Go Back</button></div>;
  }

  return (
    <BookDetails 
      book={book} 
      categories={categories} 
      onBack={onBack} 
      onUpdateBook={onUpdateBook}
      onAddCategory={onAddCategory}
    />
  );
};

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;