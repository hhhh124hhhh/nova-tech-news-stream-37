
import { useState } from "react";
import Header from "@/components/Header";
import NewsList from "@/components/NewsList";
import { useNews } from "@/hooks/useNews";
import { Cpu, Smartphone, Globe } from "lucide-react";

const Tech = () => {
  const { changeLanguage, currentLanguage, handleApiKeyChange, news } = useNews();
  const [selectedCategory, setSelectedCategory] = useState("科技");

  // Extract unique categories from news data
  const categories = ["全部", ...new Set(news.map(item => item.category))];

  // Filter tech news
  const techNews = news.filter(article => 
    article.category === "科技" || 
    article.category === "Technology" || 
    article.category === "テクノロジー" || 
    article.category === "기술"
  );

  const getPageTitle = () => {
    if (currentLanguage === 'en') return "Technology News";
    if (currentLanguage === 'ja') return "テクノロジーニュース";
    if (currentLanguage === 'ko') return "기술 뉴스";
    return "科技新闻";
  };

  const getPageSubtitle = () => {
    if (currentLanguage === 'en') return "Latest innovations, gadgets, and technological breakthroughs";
    if (currentLanguage === 'ja') return "最新のイノベーション、ガジェット、技術的ブレークスルー";
    if (currentLanguage === 'ko') return "최신 혁신, 가젯, 기술적 돌파구";
    return "最新创新、设备和技术突破";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-cyan-900/20">
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
            <Cpu className="h-12 w-12 text-blue-500" />
            <Smartphone className="h-10 w-10 text-cyan-500" />
            <Globe className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {getPageSubtitle()}
          </p>
        </div>

        <NewsList 
          selectedCategory="科技" 
          customNews={techNews}
        />
      </main>
    </div>
  );
};

export default Tech;
