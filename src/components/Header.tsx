
import React, { useState } from "react";
import CategoryNav from "@/components/CategoryNav";
import LanguageSelector from "@/components/LanguageSelector";
import ApiSettings from "@/components/ApiSettings";
import SearchBar from "@/components/SearchBar";
import AdvancedSearch, { SearchFilters } from "@/components/AdvancedSearch";
import { Brain } from "lucide-react";

interface HeaderProps {
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
  onLanguageChange: (language: string) => void;
  selectedLanguage: string;
  onApiKeyChange: (apiKeys: any) => void;
  categories: string[];
  onSearch?: (query: string) => void;
  onAdvancedSearch?: (filters: SearchFilters) => void;
}

const Header = ({ 
  onCategoryChange, 
  selectedCategory, 
  onLanguageChange, 
  selectedLanguage, 
  onApiKeyChange,
  categories,
  onSearch,
  onAdvancedSearch
}: HeaderProps) => {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleAdvancedSearch = (filters: SearchFilters) => {
    if (onAdvancedSearch) {
      onAdvancedSearch(filters);
    }
    setShowAdvancedSearch(false);
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <header className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">AI资讯中心</span>
            </div>
            
            {/* 导航链接 */}
            <nav className="hidden md:flex items-center space-x-6">
              <a 
                href="/" 
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                首页
              </a>
              <a 
                href="/blog" 
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                博客
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <CategoryNav 
              categories={categories}
              onCategoryChange={onCategoryChange}
              selectedCategory={selectedCategory}
              currentLanguage={selectedLanguage}
            />
            
            <LanguageSelector 
              onLanguageChange={onLanguageChange}
              currentLanguage={selectedLanguage}
            />
            
            <ApiSettings 
              onApiKeyChange={onApiKeyChange}
              currentLanguage={selectedLanguage}
            />
          </div>
        </div>

        {/* 搜索栏区域 */}
        <div className="pb-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <SearchBar 
                  onSearch={handleSearch}
                  currentLanguage={selectedLanguage}
                />
              </div>
              <AdvancedSearch
                onAdvancedSearch={handleAdvancedSearch}
                currentLanguage={selectedLanguage}
                categories={categories}
                isOpen={showAdvancedSearch}
                onToggle={() => setShowAdvancedSearch(!showAdvancedSearch)}
              />
            </div>
            
            {showAdvancedSearch && (
              <div className="w-full">
                <AdvancedSearch
                  onAdvancedSearch={handleAdvancedSearch}
                  currentLanguage={selectedLanguage}
                  categories={categories}
                  isOpen={true}
                  onToggle={() => setShowAdvancedSearch(false)}
                />
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
