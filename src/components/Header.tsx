
import { useState } from "react";
import { Menu, X, Newspaper, Globe, ChevronDown } from "lucide-react";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
  onLanguageChange: (language: string) => void;
  selectedLanguage: string;
}

const Header = ({ onCategoryChange, selectedCategory, onLanguageChange, selectedLanguage }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 专注于AI大模型的分类
  const categories = [
    "全部", 
    "大语言模型", 
    "AI智能体", 
    "多模态AI", 
    "AI训练技术", 
    "AI应用产品", 
    "AI行业动态"
  ];

  const languages = [
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" }
  ];

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg shadow-lg">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">AI大模型资讯</span>
              <span className="text-xs text-slate-400 hidden sm:block">专业AI大语言模型新闻平台</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <SearchBar />
            
            {/* Categories */}
            <nav className="flex space-x-1">
              {categories.slice(0, 3).map((category) => (
                <Button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  className={`transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {category}
                </Button>
              ))}
              
              {/* More Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                    更多分类 <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700">
                  {categories.slice(3).map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => onCategoryChange(category)}
                      className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="mr-1">{currentLanguage.flag}</span>
                  <span className="hidden sm:inline">{currentLanguage.name}</span>
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => onLanguageChange(language.code)}
                    className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                  >
                    <span className="mr-2">{language.flag}</span>
                    {language.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-700/50 space-y-4">
            <SearchBar />
            
            {/* Mobile Language Selector */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm font-medium">语言选择</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-slate-800 border-slate-600 text-slate-300">
                    <span className="mr-2">{currentLanguage.flag}</span>
                    {currentLanguage.name}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => onLanguageChange(language.code)}
                      className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    >
                      <span className="mr-2">{language.flag}</span>
                      {language.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Categories */}
            <nav className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => {
                    onCategoryChange(category);
                    setIsMenuOpen(false);
                  }}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  className={`justify-start text-xs ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

