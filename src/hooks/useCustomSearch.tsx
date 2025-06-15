
import { useState, useEffect } from "react";
import { NewsItem } from "@/services/newsApi";
import { SearchFilters } from "@/components/AdvancedSearch";

export const useCustomSearch = (allNews: NewsItem[]) => {
  const [searchResults, setSearchResults] = useState<NewsItem[]>(allNews);
  const [currentSearch, setCurrentSearch] = useState<{
    query: string;
    filters: SearchFilters;
  }>({
    query: "",
    filters: {
      keywords: [],
      categories: [],
      dateRange: "all",
      sources: [],
      sortBy: "date"
    }
  });

  // 基础文本搜索
  const performTextSearch = (news: NewsItem[], query: string): NewsItem[] => {
    if (!query.trim()) return news;
    
    const lowerQuery = query.toLowerCase();
    return news.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.summary.toLowerCase().includes(lowerQuery) ||
      item.content.toLowerCase().includes(lowerQuery) ||
      item.author.toLowerCase().includes(lowerQuery)
    );
  };

  // 关键词搜索
  const performKeywordSearch = (news: NewsItem[], keywords: string[]): NewsItem[] => {
    if (keywords.length === 0) return news;
    
    return news.filter(item => {
      const text = (item.title + ' ' + item.summary + ' ' + item.content).toLowerCase();
      return keywords.some(keyword => 
        text.includes(keyword.toLowerCase())
      );
    });
  };

  // 分类筛选
  const filterByCategories = (news: NewsItem[], categories: string[]): NewsItem[] => {
    if (categories.length === 0) return news;
    return news.filter(item => categories.includes(item.category));
  };

  // 日期筛选
  const filterByDateRange = (news: NewsItem[], dateRange: string): NewsItem[] => {
    if (dateRange === "all") return news;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return news.filter(item => {
      const itemDate = new Date(item.publishDate);
      
      switch (dateRange) {
        case "today":
          return itemDate >= today;
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        case "month":
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          return itemDate >= monthAgo;
        case "year":
          const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
          return itemDate >= yearAgo;
        default:
          return true;
      }
    });
  };

  // 来源筛选
  const filterBySources = (news: NewsItem[], sources: string[]): NewsItem[] => {
    if (sources.length === 0) return news;
    
    return news.filter(item => {
      const itemSource = item.source.toLowerCase();
      return sources.some(source => {
        switch (source) {
          case "newsapi":
            return itemSource.includes("newsapi") || itemSource.includes("news api");
          case "hackernews": 
            return itemSource.includes("hackernews") || itemSource.includes("hacker news");
          case "reddit":
            return itemSource.includes("reddit");
          case "github":
            return itemSource.includes("github");
          default:
            return itemSource.includes(source.toLowerCase());
        }
      });
    });
  };

  // 排序
  const sortNews = (news: NewsItem[], sortBy: string): NewsItem[] => {
    const sorted = [...news];
    
    switch (sortBy) {
      case "date":
        return sorted.sort((a, b) => 
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
      case "relevance":
        // 基于标题和摘要的相关性排序（简化版）
        return sorted.sort((a, b) => {
          const aScore = (a.title.length + a.summary.length) / 2;
          const bScore = (b.title.length + b.summary.length) / 2;
          return bScore - aScore;
        });
      case "popularity":
        // 基于来源和内容长度的热门度排序（简化版）
        return sorted.sort((a, b) => {
          const aScore = a.content.length + (a.author ? 10 : 0);
          const bScore = b.content.length + (b.author ? 10 : 0);
          return bScore - aScore;
        });
      default:
        return sorted;
    }
  };

  // 执行搜索
  const performSearch = (query: string, filters: SearchFilters) => {
    console.log('执行自定义搜索:', { query, filters });
    
    let results = allNews;

    // 应用各种筛选器
    if (query.trim()) {
      results = performTextSearch(results, query);
    }
    
    if (filters.keywords.length > 0) {
      results = performKeywordSearch(results, filters.keywords);
    }
    
    if (filters.categories.length > 0) {
      results = filterByCategories(results, filters.categories);
    }
    
    results = filterByDateRange(results, filters.dateRange);
    
    if (filters.sources.length > 0) {
      results = filterBySources(results, filters.sources);
    }
    
    results = sortNews(results, filters.sortBy);
    
    console.log(`搜索结果: ${results.length} 条新闻`);
    setSearchResults(results);
    setCurrentSearch({ query, filters });
  };

  // 重置搜索
  const resetSearch = () => {
    setSearchResults(allNews);
    setCurrentSearch({
      query: "",
      filters: {
        keywords: [],
        categories: [],
        dateRange: "all",
        sources: [],
        sortBy: "date"
      }
    });
  };

  // 当原始新闻数据更新时，重新应用搜索
  useEffect(() => {
    if (currentSearch.query || 
        currentSearch.filters.keywords.length > 0 ||
        currentSearch.filters.categories.length > 0 ||
        currentSearch.filters.dateRange !== "all" ||
        currentSearch.filters.sources.length > 0) {
      performSearch(currentSearch.query, currentSearch.filters);
    } else {
      setSearchResults(allNews);
    }
  }, [allNews]);

  return {
    searchResults,
    currentSearch,
    performSearch,
    resetSearch,
    hasActiveSearch: currentSearch.query.trim() !== "" || 
                    currentSearch.filters.keywords.length > 0 ||
                    currentSearch.filters.categories.length > 0 ||
                    currentSearch.filters.dateRange !== "all" ||
                    currentSearch.filters.sources.length > 0
  };
};
