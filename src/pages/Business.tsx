
import { useState } from "react";
import Header from "@/components/Header";
import NewsList from "@/components/NewsList";
import { useNews } from "@/hooks/useNews";
import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";

const Business = () => {
  const { changeLanguage, currentLanguage, handleApiKeyChange, news } = useNews();
  const [selectedCategory, setSelectedCategory] = useState("财经");

  // Extract unique categories from news data
  const categories = ["全部", ...new Set(news.map(item => item.category))];

  // Filter business news
  const businessNews = news.filter(article => 
    article.category === "财经" || 
    article.category === "Business" || 
    article.category === "ビジネス" || 
    article.category === "비즈니스"
  );

  const getPageTitle = () => {
    if (currentLanguage === 'en') return "Business News";
    if (currentLanguage === 'ja') return "ビジネスニュース";
    if (currentLanguage === 'ko') return "비즈니스 뉴스";
    return "财经新闻";
  };

  const getPageSubtitle = () => {
    if (currentLanguage === 'en') return "Markets, finance, economy, and business developments worldwide";
    if (currentLanguage === 'ja') return "世界の市場、金融、経済、ビジネスの発展";
    if (currentLanguage === 'ko') return "전 세계 시장, 금융, 경제 및 비즈니스 발전";
    return "全球市场、金融、经济和商业发展动态";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <Header 
        onCategoryChange={setSelectedCategory}
        selectedCategory={selectedCategory}
        onLanguageChange={changeLanguage}
        selectedLanguage={currentLanguage}
        onApiKeyChange={handleApiKeyChange}
        categories={categories}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <TrendingUp className="h-12 w-12 text-green-500" />
            <DollarSign className="h-10 w-10 text-emerald-500" />
            <BarChart3 className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {getPageSubtitle()}
          </p>
        </div>

        <NewsList 
          selectedCategory="财经" 
          customNews={businessNews}
        />
      </main>
    </div>
  );
};

export default Business;
