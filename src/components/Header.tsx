
import React from "react";
import CategoryNav from "@/components/CategoryNav";
import LanguageSelector from "@/components/LanguageSelector";
import ApiSettings from "@/components/ApiSettings";
import { Brain } from "lucide-react";

interface HeaderProps {
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
  onLanguageChange: (language: string) => void;
  selectedLanguage: string;
  onApiKeyChange: (apiKeys: any) => void;
  categories: string[];
}

const Header = ({ 
  onCategoryChange, 
  selectedCategory, 
  onLanguageChange, 
  selectedLanguage, 
  onApiKeyChange,
  categories 
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto px-4">
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
      </div>
    </header>
  );
};

export default Header;
