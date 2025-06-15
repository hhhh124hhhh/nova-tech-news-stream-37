
import { useState } from "react";
import Header from "@/components/Header";
import NewsList from "@/components/NewsList";
import { useNews } from "@/hooks/useNews";
import { Trophy, Target, Zap } from "lucide-react";

const Sports = () => {
  const { changeLanguage, currentLanguage, handleApiKeyChange, news } = useNews();
  const [selectedCategory, setSelectedCategory] = useState("体育");

  // Extract unique categories from news data
  const categories = ["全部", ...new Set(news.map(item => item.category))];

  // Filter sports news
  const sportsNews = news.filter(article => 
    article.category === "体育" || 
    article.category === "Sports" || 
    article.category === "スポーツ" || 
    article.category === "스포츠"
  );

  const getPageTitle = () => {
    if (currentLanguage === 'en') return "Sports News";
    if (currentLanguage === 'ja') return "スポーツニュース";
    if (currentLanguage === 'ko') return "스포츠 뉴스";
    return "体育新闻";
  };

  const getPageSubtitle = () => {
    if (currentLanguage === 'en') return "Latest sports updates, matches, athletes, and competitions worldwide";
    if (currentLanguage === 'ja') return "世界のスポーツ最新情報、試合、選手、大会";
    if (currentLanguage === 'ko') return "전 세계 스포츠 최신 소식, 경기, 선수, 대회";
    return "全球体育赛事、比赛、运动员和竞技最新动态";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-orange-900/20 dark:to-yellow-900/20">
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
            <Trophy className="h-12 w-12 text-orange-500" />
            <Target className="h-10 w-10 text-yellow-500" />
            <Zap className="h-8 w-8 text-orange-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {getPageSubtitle()}
          </p>
        </div>

        <NewsList 
          selectedCategory="体育" 
          customNews={sportsNews}
        />
      </main>
    </div>
  );
};

export default Sports;
