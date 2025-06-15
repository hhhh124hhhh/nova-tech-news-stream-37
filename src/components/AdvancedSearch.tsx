
import { useState } from "react";
import { Filter, Calendar, Globe, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdvancedSearchProps {
  onAdvancedSearch: (filters: SearchFilters) => void;
  currentLanguage: string;
  categories: string[];
  isOpen: boolean;
  onToggle: () => void;
}

export interface SearchFilters {
  keywords: string[];
  categories: string[];
  dateRange: string;
  sources: string[];
  sortBy: string;
}

const AdvancedSearch = ({ onAdvancedSearch, currentLanguage, categories, isOpen, onToggle }: AdvancedSearchProps) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState("all");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date");
  const [keywordInput, setKeywordInput] = useState("");

  const getTexts = () => {
    if (currentLanguage === 'en') return {
      title: "Advanced Search",
      keywords: "Keywords",
      addKeyword: "Add Keyword",
      categories: "Categories", 
      dateRange: "Date Range",
      sources: "Sources",
      sortBy: "Sort By",
      search: "Search",
      reset: "Reset",
      keywordPlaceholder: "Enter keyword...",
      dateOptions: {
        all: "All Time",
        today: "Today", 
        week: "This Week",
        month: "This Month",
        year: "This Year"
      },
      sortOptions: {
        date: "Latest First",
        relevance: "Relevance",
        popularity: "Popularity"
      },
      sourceOptions: {
        all: "All Sources",
        newsapi: "NewsAPI",
        hackernews: "HackerNews", 
        reddit: "Reddit",
        github: "GitHub"
      }
    };
    
    if (currentLanguage === 'ja') return {
      title: "高度検索",
      keywords: "キーワード",
      addKeyword: "キーワード追加",
      categories: "カテゴリ",
      dateRange: "日付範囲", 
      sources: "ソース",
      sortBy: "ソート",
      search: "検索",
      reset: "リセット",
      keywordPlaceholder: "キーワード入力...",
      dateOptions: {
        all: "全期間",
        today: "今日",
        week: "今週", 
        month: "今月",
        year: "今年"
      },
      sortOptions: {
        date: "最新順",
        relevance: "関連性",
        popularity: "人気順"
      },
      sourceOptions: {
        all: "全ソース",
        newsapi: "NewsAPI",
        hackernews: "HackerNews",
        reddit: "Reddit", 
        github: "GitHub"
      }
    };

    if (currentLanguage === 'ko') return {
      title: "고급 검색",
      keywords: "키워드",
      addKeyword: "키워드 추가",
      categories: "카테고리",
      dateRange: "날짜 범위",
      sources: "출처", 
      sortBy: "정렬",
      search: "검색",
      reset: "초기화",
      keywordPlaceholder: "키워드 입력...",
      dateOptions: {
        all: "전체 기간",
        today: "오늘",
        week: "이번 주",
        month: "이번 달", 
        year: "올해"
      },
      sortOptions: {
        date: "최신순",
        relevance: "관련성",
        popularity: "인기순"
      },
      sourceOptions: {
        all: "모든 출처",
        newsapi: "NewsAPI", 
        hackernews: "HackerNews",
        reddit: "Reddit",
        github: "GitHub"
      }
    };
    
    // 默认中文
    return {
      title: "高级搜索",
      keywords: "关键词",
      addKeyword: "添加关键词", 
      categories: "分类",
      dateRange: "日期范围",
      sources: "来源",
      sortBy: "排序方式",
      search: "搜索",
      reset: "重置", 
      keywordPlaceholder: "输入关键词...",
      dateOptions: {
        all: "全部时间",
        today: "今天",
        week: "本周",
        month: "本月",
        year: "今年"
      },
      sortOptions: {
        date: "最新优先", 
        relevance: "相关性",
        popularity: "热门度"
      },
      sourceOptions: {
        all: "全部来源",
        newsapi: "NewsAPI",
        hackernews: "HackerNews",
        reddit: "Reddit",
        github: "GitHub"
      }
    };
  };

  const texts = getTexts();

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSource = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source) 
        : [...prev, source]
    );
  };

  const handleSearch = () => {
    const filters: SearchFilters = {
      keywords,
      categories: selectedCategories,
      dateRange,
      sources: selectedSources,
      sortBy
    };
    onAdvancedSearch(filters);
  };

  const handleReset = () => {
    setKeywords([]);
    setSelectedCategories([]);
    setDateRange("all");
    setSelectedSources([]);
    setSortBy("date");
    setKeywordInput("");
    onAdvancedSearch({
      keywords: [],
      categories: [],
      dateRange: "all", 
      sources: [],
      sortBy: "date"
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700"
      >
        <Filter className="h-4 w-4 mr-2" />
        {texts.title}
      </Button>
    );
  }

  return (
    <Card className="w-full bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>{texts.title}</span>
          </div>
          <Button
            onClick={onToggle}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 关键词搜索 */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            <Tag className="h-4 w-4 inline mr-2" />
            {texts.keywords}
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              placeholder={texts.keywordPlaceholder}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={addKeyword} size="sm">
              {texts.addKeyword}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="bg-blue-600 text-white cursor-pointer"
                onClick={() => removeKeyword(keyword)}
              >
                {keyword} ×
              </Badge>
            ))}
          </div>
        </div>

        {/* 分类选择 */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            {texts.categories}
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.filter(cat => cat !== "全部" && cat !== "All" && cat !== "すべて" && cat !== "전체").map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategories.includes(category)
                    ? "bg-blue-600 text-white"
                    : "border-slate-600 text-slate-300 hover:bg-slate-700"
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 日期范围 */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              <Calendar className="h-4 w-4 inline mr-2" />
              {texts.dateRange}
            </label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">{texts.dateOptions.all}</SelectItem>
                <SelectItem value="today">{texts.dateOptions.today}</SelectItem>
                <SelectItem value="week">{texts.dateOptions.week}</SelectItem>
                <SelectItem value="month">{texts.dateOptions.month}</SelectItem>
                <SelectItem value="year">{texts.dateOptions.year}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 来源选择 */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              <Globe className="h-4 w-4 inline mr-2" />
              {texts.sources}
            </label>
            <div className="flex flex-wrap gap-1">
              {Object.entries(texts.sourceOptions).map(([key, label]) => {
                if (key === 'all') return null;
                return (
                  <Badge
                    key={key}
                    variant={selectedSources.includes(key) ? "default" : "outline"}
                    className={`cursor-pointer text-xs ${
                      selectedSources.includes(key)
                        ? "bg-green-600 text-white"
                        : "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }`}
                    onClick={() => toggleSource(key)}
                  >
                    {label}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* 排序方式 */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              {texts.sortBy}
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="date">{texts.sortOptions.date}</SelectItem>
                <SelectItem value="relevance">{texts.sortOptions.relevance}</SelectItem>
                <SelectItem value="popularity">{texts.sortOptions.popularity}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button onClick={handleReset} variant="outline" size="sm">
            {texts.reset}
          </Button>
          <Button onClick={handleSearch} size="sm">
            {texts.search}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
