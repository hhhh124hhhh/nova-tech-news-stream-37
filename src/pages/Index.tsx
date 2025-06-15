
import { useState } from "react";
import Header from "@/components/Header";
import NewsList from "@/components/NewsList";
import { useNews } from "@/hooks/useNews";
import { useCustomSearch } from "@/hooks/useCustomSearch";
import { SearchFilters } from "@/components/AdvancedSearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search, TrendingUp, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const { changeLanguage, currentLanguage, handleApiKeyChange, news } = useNews();
  const { searchResults, performSearch, resetSearch, hasActiveSearch, currentSearch } = useCustomSearch(news);

  // Extract unique categories from news data
  const categories = ["全部", ...new Set(news.map(item => item.category))];

  const handleSearch = (query: string) => {
    performSearch(query, currentSearch.filters);
  };

  const handleAdvancedSearch = (filters: SearchFilters) => {
    performSearch(currentSearch.query, filters);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (hasActiveSearch) {
      const newFilters = { ...currentSearch.filters };
      if (category === "全部" || category === "All" || category === "すべて" || category === "전체") {
        newFilters.categories = [];
      } else {
        newFilters.categories = [category];
      }
      performSearch(currentSearch.query, newFilters);
    }
  };

  const getSearchStatusText = () => {
    const resultCount = searchResults.length;
    if (currentLanguage === 'en') {
      return hasActiveSearch ? `Found ${resultCount} results` : `Showing ${resultCount} articles`;
    }
    if (currentLanguage === 'ja') {
      return hasActiveSearch ? `${resultCount}件の結果` : `${resultCount}件の記事`;
    }
    if (currentLanguage === 'ko') {
      return hasActiveSearch ? `${resultCount}개 결과` : `${resultCount}개 기사`;
    }
    return hasActiveSearch ? `找到 ${resultCount} 条结果` : `显示 ${resultCount} 条新闻`;
  };

  const getClearSearchText = () => {
    if (currentLanguage === 'en') return "Clear Search";
    if (currentLanguage === 'ja') return "検索をクリア";
    if (currentLanguage === 'ko') return "검색 지우기";
    return "清除搜索";
  };

  const getWelcomeText = () => {
    if (currentLanguage === 'en') return {
      title: "Stay Informed with Global News",
      subtitle: "Discover breaking news, trending topics, and in-depth analysis from around the world"
    };
    if (currentLanguage === 'ja') return {
      title: "世界のニュースで最新情報をキャッチ",
      subtitle: "世界中の速報、トレンドトピック、詳細分析をお届けします"
    };
    if (currentLanguage === 'ko') return {
      title: "글로벌 뉴스로 최신 정보 확인",
      subtitle: "전 세계의 속보, 트렌딩 토픽, 심층 분석을 발견하세요"
    };
    return {
      title: "全球资讯，尽在掌握",
      subtitle: "发现突发新闻、热门话题和深度分析，掌握全球动态"
    };
  };

  const getNavigationCardTexts = () => {
    if (currentLanguage === 'en') return {
      trending: { title: 'Trending Now', desc: 'Latest hot topics and viral stories' },
      breaking: { title: 'Breaking News', desc: 'Real-time updates on important events' },
      editor: { title: 'Editor\'s Pick', desc: 'Curated content from our editorial team' }
    };
    if (currentLanguage === 'ja') return {
      trending: { title: '今のトレンド', desc: '最新のホットトピックとバイラルストーリー' },
      breaking: { title: '速報ニュース', desc: '重要な出来事のリアルタイム更新' },
      editor: { title: '編集者のおすすめ', desc: '編集チームが厳選したコンテンツ' }
    };
    if (currentLanguage === 'ko') return {
      trending: { title: '지금 트렌딩', desc: '최신 핫토픽과 바이럴 스토리' },
      breaking: { title: '속보', desc: '중요한 사건의 실시간 업데이트' },
      editor: { title: '에디터 추천', desc: '편집팀이 엄선한 콘텐츠' }
    };
    return {
      trending: { title: '热门趋势', desc: '最新热点话题和病毒式传播的故事' },
      breaking: { title: '突发新闻', desc: '重要事件的实时更新' },
      editor: { title: '编辑推荐', desc: '编辑团队精选内容' }
    };
  };

  const welcomeText = getWelcomeText();
  const navTexts = getNavigationCardTexts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header 
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
        onLanguageChange={changeLanguage}
        selectedLanguage={currentLanguage}
        onApiKeyChange={handleApiKeyChange}
        categories={categories}
        onSearch={handleSearch}
        onAdvancedSearch={handleAdvancedSearch}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* 欢迎区域 */}
        {!hasActiveSearch && (
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
              {welcomeText.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              {welcomeText.subtitle}
            </p>
            
            {/* 快速导航卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <Link to="/trending" className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-200 dark:border-slate-700 group">
                <TrendingUp className="h-8 w-8 text-red-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  {navTexts.trending.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {navTexts.trending.desc}
                </p>
              </Link>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-200 dark:border-slate-700">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  {navTexts.breaking.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {navTexts.breaking.desc}
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-200 dark:border-slate-700">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  {navTexts.editor.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {navTexts.editor.desc}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 搜索状态显示 */}
        {hasActiveSearch && (
          <div className="mb-6 p-4 bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Search className="h-5 w-5 text-blue-500" />
                <span className="text-slate-700 dark:text-slate-200">{getSearchStatusText()}</span>
                
                {/* 显示活跃的搜索条件 */}
                <div className="flex flex-wrap gap-2">
                  {currentSearch.query && (
                    <Badge variant="outline" className="text-blue-600 border-blue-400 bg-blue-50 dark:bg-blue-900/20">
                      关键词: "{currentSearch.query}"
                    </Badge>
                  )}
                  {currentSearch.filters.keywords.map(keyword => (
                    <Badge key={keyword} variant="outline" className="text-green-600 border-green-400 bg-green-50 dark:bg-green-900/20">
                      {keyword}
                    </Badge>
                  ))}
                  {currentSearch.filters.categories.map(category => (
                    <Badge key={category} variant="outline" className="text-purple-600 border-purple-400 bg-purple-50 dark:bg-purple-900/20">
                      {category}
                    </Badge>
                  ))}
                  {currentSearch.filters.dateRange !== "all" && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
                      {currentSearch.filters.dateRange}
                    </Badge>
                  )}
                  {currentSearch.filters.sources.map(source => (
                    <Badge key={source} variant="outline" className="text-orange-600 border-orange-400 bg-orange-50 dark:bg-orange-900/20">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={resetSearch}
                variant="outline"
                size="sm"
                className="text-slate-500 border-slate-300 hover:text-slate-700 hover:border-slate-400 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:border-slate-500"
              >
                <X className="h-4 w-4 mr-2" />
                {getClearSearchText()}
              </Button>
            </div>
          </div>
        )}

        {/* 新闻列表 */}
        <div className="news-list-container">
          {hasActiveSearch ? (
            <NewsList 
              selectedCategory="全部" 
              customNews={searchResults}
            />
          ) : (
            <NewsList selectedCategory={selectedCategory} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
