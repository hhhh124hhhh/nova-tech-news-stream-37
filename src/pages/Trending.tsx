
import { useState } from "react";
import Header from "@/components/Header";
import NewsList from "@/components/NewsList";
import { useNews } from "@/hooks/useNews";
import { TrendingUp, Fire, Clock } from "lucide-react";

const Trending = () => {
  const { changeLanguage, currentLanguage, handleApiKeyChange, news } = useNews();
  const [selectedCategory, setSelectedCategory] = useState("全部");

  // Extract unique categories from news data
  const categories = ["全部", ...new Set(news.map(item => item.category))];

  // Get trending news (simulate by sorting by recent and high engagement)
  const trendingNews = news
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 20);

  const getPageTitle = () => {
    if (currentLanguage === 'en') return "Trending News";
    if (currentLanguage === 'ja') return "トレンドニュース";
    if (currentLanguage === 'ko') return "트렌딩 뉴스";
    return "热门新闻";
  };

  const getPageSubtitle = () => {
    if (currentLanguage === 'en') return "Stay updated with the most popular and viral stories worldwide";
    if (currentLanguage === 'ja') return "世界で最も人気でバイラルなストーリーで最新情報をキャッチ";
    if (currentLanguage === 'ko') return "전 세계에서 가장 인기 있고 바이럴한 스토리로 최신 정보 확인";
    return "关注全球最热门和病毒式传播的新闻故事";
  };

  const getStatsText = () => {
    if (currentLanguage === 'en') return {
      trending: "Trending Articles",
      updated: "Updated every hour"
    };
    if (currentLanguage === 'ja') return {
      trending: "トレンド記事",
      updated: "毎時更新"
    };
    if (currentLanguage === 'ko') return {
      trending: "트렌딩 기사",
      updated: "매시간 업데이트"
    };
    return {
      trending: "热门文章",
      updated: "每小时更新"
    };
  };

  const statsText = getStatsText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 dark:from-slate-900 dark:via-red-900/20 dark:to-orange-900/20">
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
            <TrendingUp className="h-12 w-12 text-red-500" />
            <Fire className="h-10 w-10 text-orange-500 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            {getPageSubtitle()}
          </p>
          
          {/* 统计信息 */}
          <div className="flex items-center justify-center space-x-8 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span>{trendingNews.length} {statsText.trending}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>{statsText.updated}</span>
            </div>
          </div>
        </div>

        <NewsList 
          selectedCategory={selectedCategory} 
          customNews={trendingNews}
        />
      </main>
    </div>
  );
};

export default Trending;
