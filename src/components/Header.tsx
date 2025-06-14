
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

  // 扩展AI大模型分类，增加AI绘画、AI视频、AI编程
  const getCategories = () => {
    if (selectedLanguage === 'en') {
      return [
        "All", 
        "Large Language Models", 
        "AI Agents", 
        "Multimodal AI", 
        "AI Training Technology", 
        "AI Applications & Products", 
        "AI Industry News",
        "AI Art Generation",
        "AI Video",
        "AI Programming"
      ];
    } else if (selectedLanguage === 'ja') {
      return [
        "すべて", 
        "大規模言語モデル", 
        "AIエージェント", 
        "マルチモーダルAI", 
        "AI訓練技術", 
        "AIアプリケーション・製品", 
        "AI業界ニュース",
        "AI画像生成",
        "AI動画",
        "AIプログラミング"
      ];
    } else if (selectedLanguage === 'ko') {
      return [
        "전체", 
        "대규모 언어 모델", 
        "AI 에이전트", 
        "멀티모달 AI", 
        "AI 훈련 기술", 
        "AI 애플리케이션 및 제품", 
        "AI 업계 뉴스",
        "AI 그림 생성",
        "AI 비디오",
        "AI 프로그래밍"
      ];
    } else {
      return [
        "全部", 
        "大语言模型", 
        "AI智能体", 
        "多模态AI", 
        "AI训练技术", 
        "AI应用产品", 
        "AI行业动态",
        "AI绘画",
        "AI视频",
        "AI编程"
      ];
    }
  };

  const categories = getCategories();

  const languages = [
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" }
  ];

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  const getHeaderTitle = () => {
    if (selectedLanguage === 'en') return "AI LLM News";
    if (selectedLanguage === 'ja') return "AI大規模言語モデルニュース";
    if (selectedLanguage === 'ko') return "AI 대규모 언어 모델 뉴스";
    return "AI大模型资讯";
  };

  const getHeaderSubtitle = () => {
    if (selectedLanguage === 'en') return "Professional AI Large Language Model News Platform";
    if (selectedLanguage === 'ja') return "専門AI大規模言語モデルニュースプラットフォーム";
    if (selectedLanguage === 'ko') return "전문 AI 대규모 언어 모델 뉴스 플랫폼";
    return "专业AI大语言模型新闻平台";
  };

  const getMoreCategoriesText = () => {
    if (selectedLanguage === 'en') return "More Categories";
    if (selectedLanguage === 'ja') return "その他のカテゴリ";
    if (selectedLanguage === 'ko') return "더 많은 카테고리";
    return "更多分类";
  };

  const getLanguageSelectorText = () => {
    if (selectedLanguage === 'en') return "Language";
    if (selectedLanguage === 'ja') return "言語選択";
    if (selectedLanguage === 'ko') return "언어 선택";
    return "语言选择";
  };

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
              <span className="text-xl font-bold text-white">{getHeaderTitle()}</span>
              <span className="text-xs text-slate-400 hidden sm:block">{getHeaderSubtitle()}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <SearchBar />
            
            {/* Categories */}
            <nav className="flex space-x-1">
              {categories.slice(0, 4).map((category) => (
                <Button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  className={`transition-all duration-200 text-xs ${
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
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs">
                    {getMoreCategoriesText()} <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700">
                  {categories.slice(4).map((category) => (
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
              <span className="text-slate-300 text-sm font-medium">{getLanguageSelectorText()}</span>
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
