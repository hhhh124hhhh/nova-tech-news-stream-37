
import { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
      <input
        type="text"
        placeholder="搜索AI新闻..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
      />
    </div>
  );
};

export default SearchBar;
