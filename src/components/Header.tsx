
import { useState } from "react";
import { Menu, X, Newspaper } from "lucide-react";
import SearchBar from "./SearchBar";
import ApiSettings from "./ApiSettings";
import CategoryNav from "./CategoryNav";
import LanguageSelector from "./LanguageSelector";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
  onLanguageChange: (language: string) => void;
  selectedLanguage: string;
  onApiKeyChange: (apiKeys: any) => void;
}

const Header = ({ onCategoryChange, selectedCategory, onLanguageChange, selectedLanguage, onApiKeyChange }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 优化的AI分类 - 专注于用户关心的5个核心领域
  const getCategories = () => {
    if (selectedLanguage === 'en') {
      return [
        "All", 
        "Large Language Models", 
        "AI Art Generation",
        "AI Video",
        "AI Programming",
        "AI Agents", 
        "Multimodal AI", 
        "AI Training Technology", 
        "AI Applications & Products", 
        "AI Industry News"
      ];
    } else if (selectedLanguage === 'ja') {
      return [
        "すべて", 
        "大規模言語モデル", 
        "AI画像生成",
        "AI動画",
        "AIプログラミング",
        "AIエージェント", 
        "マルチモーダルAI", 
        "AI訓練技術", 
        "AIアプリケーション・製品", 
        "AI業界ニュース"
      ];
    } else if (selectedLanguage === 'ko') {
      return [
        "전체", 
        "대규모 언어 모델", 
        "AI 그림 생성",
        "AI 비디오",
        "AI 프로그래밍",
        "AI 에이전트", 
        "멀티모달 AI", 
        "AI 훈련 기술", 
        "AI 애플리케이션 및 제품", 
        "AI 업계 뉴스"
      ];
    } else {
      return [
        "全部", 
        "大语言模型", 
        "AI绘画",
        "AI视频",
        "AI编程",
        "AI智能体", 
        "多模态AI", 
        "AI训练技术", 
        "AI应用产品", 
        "AI行业动态"
      ];
    }
  };

  const categories = getCategories();

  const getHeaderTitle = () => {
    if (selectedLanguage === 'en') return "AI News Hub";
    if (selectedLanguage === 'ja') return "AIニュースハブ";
    if (selectedLanguage === 'ko') return "AI 뉴스 허브";
    return "AI资讯中心";
  };

  const getHeaderSubtitle = () => {
    if (selectedLanguage === 'en') return "Latest AI & LLM Industry Updates";
    if (selectedLanguage === 'ja') return "最新AI・LLM業界アップデート";
    if (selectedLanguage === 'ko') return "최신 AI 및 LLM 업계 업데이트";
    return "最新AI大模型行业动态";
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
            <CategoryNav 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
              currentLanguage={selectedLanguage}
            />

            {/* API Settings */}
            <ApiSettings 
              onApiKeyChange={onApiKeyChange}
              currentLanguage={selectedLanguage}
            />

            {/* Language Selector */}
            <LanguageSelector 
              currentLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
            />
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
            
            {/* Mobile API Settings */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm font-medium">API配置</span>
              <ApiSettings 
                onApiKeyChange={onApiKeyChange}
                currentLanguage={selectedLanguage}
              />
            </div>

            {/* Mobile Language Selector */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm font-medium">语言选择</span>
              <LanguageSelector 
                currentLanguage={selectedLanguage}
                onLanguageChange={onLanguageChange}
              />
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
