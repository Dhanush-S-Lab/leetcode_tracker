import React from 'react';
import { Search, Loader2 } from 'lucide-react';

const SearchBox = ({ username, setUsername, onSearch, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-16 relative z-10">
      <div className="relative flex-1 group">
        <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={24} />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="LeetCode Username"
          className="input-field !pl-16 relative z-10"
          required
        />
      </div>
      <button 
        type="submit" 
        className="btn-primary flex items-center justify-center gap-3 relative z-10"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
          <>
            <span>Verify Student</span>
            <Search size={20} />
          </>
        )}
      </button>
    </form>
  );
};

export default SearchBox;
