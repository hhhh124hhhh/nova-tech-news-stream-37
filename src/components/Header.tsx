
import React, { useState } from "react";
import CategoryNav from "@/components/CategoryNav";
import LanguageSelector from "@/components/LanguageSelector";
import ApiSettings from "@/components/ApiSettings";
import SearchBar from "@/components/SearchBar";
import AdvancedSearch, { SearchFilters } from "@/components/AdvancedSearch";
import { Newspaper, TrendingUp, Globe } from "lucide-react";

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

  const getAppTitle = () => {
    if (selectedLanguage === 'en') return "Global News Hub";
    if (selectedLanguage === 'ja') return "グローバルニュースハブ";
    if (selectedLanguage === 'ko') return "글로벌 뉴스 허브";
    return "全球资讯中心";
  };

  const getNavigationItems = () => {
    if (selectedLanguage === 'en') return [
      { label: "Home", path: "/" },
      { label: "Trending", path: "/trending" },
      { label: "Technology", path: "/tech" },
      { label: "Business", path: "/business" },
      { label: "Blog", path: "/blog" }
    ];
    if (selectedLanguage === 'ja') return [
      { label: "ホーム", path: "/" },
      { label: "トレンド", path: "/trending" },
      { label: "テクノロジー", path: "/tech" },
      { label: "ビジネス", path: "/business" },
      { label: "ブログ", path: "/blog" }
    ];
    if (selectedLanguage === 'ko') return [
      { label: "홈", path: "/" },
      { label: "트렌딩", path: "/trending" },
      { label: "기술", path: "/tech" },
      { label: "비즈니스", path: "/business" },
      { label: "블로그", path: "/blog" }
    ];
    return [
      { label: "首页", path: "/" },
      { label: "热点", path: "/trending" },
      { label: "科技", path: "/tech" },
      { label: "商业", path: "/business" },
      { label: "博客", path: "/blog" }
    ];
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-700 dark:bg-slate-900/95">
      <header className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Globe className="h-8 w-8 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {getAppTitle()}
              </span>
            </div>
            
            {/* 导航链接 */}
            <nav className="hidden md:flex items-center space-x-6">
              {getNavigationItems().map((item) => (
                <a 
                  key={item.path}
                  href={item.path} 
                  className="text-slate-600 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1 group"
                >
                  {item.path === "/trending" && <TrendingUp className="h-4 w-4 group-hover:text-red-500 transition-colors" />}
                  {item.path === "/" && <Newspaper className="h-4 w-4" />}
                  <span>{item.label}</span>
                </a>
              ))}
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
