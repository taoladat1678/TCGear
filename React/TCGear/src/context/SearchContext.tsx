// src/context/SearchContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchResult {
  product_id: string;
  product_name: string;
  product_image: string;
  product_price: number;
  product_rating?: number;
  product_buying?: number;    // THÊM DÒNG NÀY ĐỂ TÍNH BÁN CHẠY NHẤT
  cate_id?: string;
  product_description?: string;
}

interface SearchContextType {
  searchResults: SearchResult[];
  searchQuery: string;
  setSearchData: (results: SearchResult[], query: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const setSearchData = (results: SearchResult[], query: string) => {
    setSearchResults(results);
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <SearchContext.Provider value={{ searchResults, searchQuery, setSearchData, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');
  return context;
};