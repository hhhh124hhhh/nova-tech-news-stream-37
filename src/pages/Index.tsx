
import { useState } from "react";
import Header from "@/components/Header";
import NewsList from "@/components/NewsList";
import { useNews } from "@/hooks/useNews";
import { useCustomSearch } from "@/hooks/useCustomSearch";
import { SearchFilters } from "@/components/AdvancedSearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";

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
    // 如果有活跃搜索，同时更新搜索结果
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
        {/* 搜索状态显示 */}
        {hasActiveSearch && (
          <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Search className="h-5 w-5 text-blue-400" />
                <span className="text-slate-200">{getSearchStatusText()}</span>
                
                {/* 显示活跃的搜索条件 */}
                <div className="flex flex-wrap gap-2">
                  {currentSearch.query && (
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      关键词: "{currentSearch.query}"
                    </Badge>
                  )}
                  {currentSearch.filters.keywords.map(keyword => (
                    <Badge key={keyword} variant="outline" className="text-green-400 border-green-400">
                      {keyword}
                    </Badge>
                  ))}
                  {currentSearch.filters.categories.map(category => (
                    <Badge key={category} variant="outline" className="text-purple-400 border-purple-400">
                      {category}
                    </Badge>
                  ))}
                  {currentSearch.filters.dateRange !== "all" && (
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                      {currentSearch.filters.dateRange}
                    </Badge>
                  )}
                  {currentSearch.filters.sources.map(source => (
                    <Badge key={source} variant="outline" className="text-orange-400 border-orange-400">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={resetSearch}
                variant="outline"
                size="sm"
                className="text-slate-400 border-slate-600 hover:text-white hover:border-slate-500"
              >
                <X className="h-4 w-4 mr-2" />
                {getClearSearchText()}
              </Button>
            </div>
          </div>
        )}

        {/* 修改NewsList组件调用，传入搜索结果 */}
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
