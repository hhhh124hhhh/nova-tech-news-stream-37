
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  currentLanguage: string;
  placeholder?: string;
}

const SearchBar = ({ onSearch, currentLanguage, placeholder }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (currentLanguage === 'en') return "Search AI news...";
    if (currentLanguage === 'ja') return "AIニュースを検索...";
    if (currentLanguage === 'ko') return "AI 뉴스 검색...";
    return "搜索AI新闻...";
  };

  const handleSearch = () => {
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <input
          type="text"
          placeholder={getPlaceholder()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-10 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full min-w-64"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button
        onClick={handleSearch}
        variant="outline"
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
      >
        {currentLanguage === 'en' ? 'Search' : 
         currentLanguage === 'ja' ? '検索' :
         currentLanguage === 'ko' ? '검색' : '搜索'}
      </Button>
    </div>
  );
};

export default SearchBar;
