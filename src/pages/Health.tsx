
import { useState } from "react";
import Header from "@/components/Header";
import NewsList from "@/components/NewsList";
import { useNews } from "@/hooks/useNews";
import { Heart, Activity, Shield } from "lucide-react";

const Health = () => {
  const { changeLanguage, currentLanguage, handleApiKeyChange, news } = useNews();
  const [selectedCategory, setSelectedCategory] = useState("健康");

  // Extract unique categories from news data
  const categories = ["全部", ...new Set(news.map(item => item.category))];

  // Filter health news
  const healthNews = news.filter(article => 
    article.category === "健康" || 
    article.category === "Health" || 
    article.category === "健康日" || 
    article.category === "건강한"
  );

  const getPageTitle = () => {
    if (currentLanguage === 'en') return "Health News";
    if (currentLanguage === 'ja') return "健康ニュース";
    if (currentLanguage === 'ko') return "건강 뉴스";
    return "健康新闻";
  };

  const getPageSubtitle = () => {
    if (currentLanguage === 'en') return "Medical breakthroughs, wellness tips, and health industry updates";
    if (currentLanguage === 'ja') return "医学的突破、ウェルネスのヒント、健康業界の最新情報";
    if (currentLanguage === 'ko') return "의학적 돌파구, 웰니스 팁, 건강 산업 업데이트";
    return "医学突破、健康贴士和医疗行业最新动态";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-green-900/20 dark:to-teal-900/20">
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
            <Heart className="h-12 w-12 text-green-500" />
            <Activity className="h-10 w-10 text-teal-500" />
            <Shield className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {getPageSubtitle()}
          </p>
        </div>

        <NewsList 
          selectedCategory="健康" 
          customNews={healthNews}
        />
      </main>
    </div>
  );
};

export default Health;
