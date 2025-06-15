
import { useState } from "react";
import Header from "@/components/Header";
import NewsList from "@/components/NewsList";
import { useNews } from "@/hooks/useNews";
import { Music, Film, Star } from "lucide-react";

const Entertainment = () => {
  const { changeLanguage, currentLanguage, handleApiKeyChange, news } = useNews();
  const [selectedCategory, setSelectedCategory] = useState("娱乐");

  // Extract unique categories from news data
  const categories = ["全部", ...new Set(news.map(item => item.category))];

  // Filter entertainment news
  const entertainmentNews = news.filter(article => 
    article.category === "娱乐" || 
    article.category === "Entertainment" || 
    article.category === "エンターテイメント" || 
    article.category === "엔터테인먼트"
  );

  const getPageTitle = () => {
    if (currentLanguage === 'en') return "Entertainment News";
    if (currentLanguage === 'ja') return "エンターテイメントニュース";
    if (currentLanguage === 'ko') return "엔터테인먼트 뉴스";
    return "娱乐新闻";
  };

  const getPageSubtitle = () => {
    if (currentLanguage === 'en') return "Movies, music, celebrities, and entertainment industry updates";
    if (currentLanguage === 'ja') return "映画、音楽、有名人、エンターテイメント業界の最新情報";
    if (currentLanguage === 'ko') return "영화, 음악, 연예인, 엔터테인먼트 업계 업데이트";
    return "电影、音乐、明星和娱乐产业最新动态";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-900/20">
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
            <Film className="h-12 w-12 text-purple-500" />
            <Music className="h-10 w-10 text-pink-500" />
            <Star className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {getPageSubtitle()}
          </p>
        </div>

        <NewsList 
          selectedCategory="娱乐" 
          customNews={entertainmentNews}
        />
      </main>
    </div>
  );
};

export default Entertainment;
