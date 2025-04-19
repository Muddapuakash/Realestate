import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center border rounded-full px-4 py-2"
    >
      <input
        type="text"
        placeholder="Search properties..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="outline-none w-full mr-2"
      />
      <button type="submit" className="text-gray-500">
        <Search size={20} />
      </button>
    </form>
  );
}