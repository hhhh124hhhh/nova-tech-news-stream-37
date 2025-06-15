import React, { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

export interface SearchFilters {
  keywords: string[];
  categories: string[];
  dateRange: string;
  startDate?: Date;
  endDate?: Date;
  sources: string[];
  relevance: number;
}

interface AdvancedSearchProps {
  onAdvancedSearch: (filters: SearchFilters) => void;
  currentLanguage: string;
  categories: string[];
  isOpen: boolean;
  onToggle: () => void;
}

export function AdvancedSearch({ onAdvancedSearch, currentLanguage, categories, isOpen, onToggle }: AdvancedSearchProps) {
  const [keywordsInput, setKeywordsInput] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    keywords: [],
    categories: [],
    dateRange: "all",
    sources: [],
    relevance: 50,
  });
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const handleAddKeyword = () => {
    if (keywordsInput.trim() && !filters.keywords.includes(keywordsInput.trim())) {
      setFilters({ ...filters, keywords: [...filters.keywords, keywordsInput.trim()] });
      setKeywordsInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFilters({ ...filters, keywords: filters.keywords.filter((k) => k !== keyword) });
  };

  const toggleCategory = (category: string) => {
    if (filters.categories.includes(category)) {
      setFilters({ ...filters, categories: filters.categories.filter((c) => c !== category) });
    } else {
      setFilters({ ...filters, categories: [...filters.categories, category] });
    }
  };

  const handleDateRangeChange = (range: string) => {
    setFilters({ ...filters, dateRange: range });
  };

  const handleSourceChange = (source: string) => {
    if (filters.sources.includes(source)) {
      setFilters({ ...filters, sources: filters.sources.filter((s) => s !== source) });
    } else {
      setFilters({ ...filters, sources: [...filters.sources, source] });
    }
  };

  const handleRelevanceChange = useCallback(
    (value: number[]) => {
      setFilters((prevFilters) => ({ ...prevFilters, relevance: value[0] }));
    },
    []
  );

  const handleSubmit = () => {
    onAdvancedSearch(filters);
  };

  const getKeywordsText = () => {
    if (currentLanguage === 'en') return "Keywords";
    if (currentLanguage === 'ja') return "キーワード";
    if (currentLanguage === 'ko') return "키워드";
    return "关键词";
  };

  const getAddText = () => {
    if (currentLanguage === 'en') return "Add";
    if (currentLanguage === 'ja') return "追加";
    if (currentLanguage === 'ko') return "추가";
    return "添加";
  };

  const getCategoriesText = () => {
    if (currentLanguage === 'en') return "Categories";
    if (currentLanguage === 'ja') return "カテゴリ";
    if (currentLanguage === 'ko') return "카테고리";
    return "分类";
  };

  const getDateRangeText = () => {
    if (currentLanguage === 'en') return "Date Range";
    if (currentLanguage === 'ja') return "日付範囲";
    if (currentLanguage === 'ko') return "날짜 범위";
    return "日期范围";
  };

  const getAllText = () => {
    if (currentLanguage === 'en') return "All";
    if (currentLanguage === 'ja') return "すべて";
    if (currentLanguage === 'ko') return "모두";
    return "全部";
  };

  const getLast24HoursText = () => {
    if (currentLanguage === 'en') return "Last 24 Hours";
    if (currentLanguage === 'ja') return "過去24時間";
    if (currentLanguage === 'ko') return "지난 24시간";
    return "最近24小时";
  };

  const getLastWeekText = () => {
    if (currentLanguage === 'en') return "Last Week";
    if (currentLanguage === 'ja') return "過去1週間";
    if (currentLanguage === 'ko') return "지난주";
    return "最近一周";
  };

  const getLastMonthText = () => {
    if (currentLanguage === 'en') return "Last Month";
    if (currentLanguage === 'ja') return "過去1ヶ月";
    if (currentLanguage === 'ko') return "지난달";
    return "最近一月";
  };

  const getCustomRangeText = () => {
    if (currentLanguage === 'en') return "Custom Range";
    if (currentLanguage === 'ja') return "カスタム範囲";
    if (currentLanguage === 'ko') return "사용자 지정 범위";
    return "自定义范围";
  };

  const getSourcesText = () => {
    if (currentLanguage === 'en') return "Sources";
    if (currentLanguage === 'ja') return "ソース";
    if (currentLanguage === 'ko') return "출처";
    return "来源";
  };

  const getRelevanceText = () => {
    if (currentLanguage === 'en') return "Relevance";
    if (currentLanguage === 'ja') return "関連性";
    if (currentLanguage === 'ko') return "관련성";
    return "相关性";
  };

  const getApplyFiltersText = () => {
    if (currentLanguage === 'en') return "Apply Filters";
    if (currentLanguage === 'ja') return "フィルターを適用";
    if (currentLanguage === 'ko') return "필터 적용";
    return "应用过滤";
  };

  // Filter out AI-related categories
  const filteredCategories = categories.filter(category => 
    !category.includes('AI') && 
    !category.includes('大语言模型') && 
    !category.includes('AI训练技术') && 
    !category.includes('AI行业动态') && 
    !category.includes('多模态AI') && 
    !category.includes('AI编程')
  );

  return (
    <div className="w-full">
      <Button variant="outline" onClick={onToggle}>
        Advanced Search
      </Button>
      
      {isOpen && (
        <div className="mt-4 p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          {/* Keywords */}
          <div className="mb-4 space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {getKeywordsText()}
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter keywords"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                className="flex-1"
              />
              <Button type="button" size="sm" onClick={handleAddKeyword}>
                {getAddText()}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.keywords.map((keyword) => (
                <Button
                  key={keyword}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRemoveKeyword(keyword)}
                >
                  {keyword}
                  <X className="ml-2 h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
          
          {/* Categories */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {getCategoriesText()}
            </Label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {filteredCategories.slice(1).map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={filters.categories.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="mt-4 space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {getDateRangeText()}
            </Label>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant={filters.dateRange === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleDateRangeChange("all")}
              >
                {getAllText()}
              </Button>
              <Button
                type="button"
                variant={filters.dateRange === "24h" ? "default" : "outline"}
                size="sm"
                onClick={() => handleDateRangeChange("24h")}
              >
                {getLast24HoursText()}
              </Button>
              <Button
                type="button"
                variant={filters.dateRange === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => handleDateRangeChange("7d")}
              >
                {getLastWeekText()}
              </Button>
              <Button
                type="button"
                variant={filters.dateRange === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => handleDateRangeChange("30d")}
              >
                {getLastMonthText()}
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={filters.dateRange === "custom" ? "default" : "outline"}
                    size="sm"
                  >
                    {getCustomRangeText()}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Sources */}
          <div className="mt-4 space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {getSourcesText()}
            </Label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="source-1"
                  checked={filters.sources.includes("Source 1")}
                  onCheckedChange={() => handleSourceChange("Source 1")}
                />
                <Label htmlFor="source-1" className="text-sm text-slate-700 dark:text-slate-300">
                  Source 1
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="source-2"
                  checked={filters.sources.includes("Source 2")}
                  onCheckedChange={() => handleSourceChange("Source 2")}
                />
                <Label htmlFor="source-2" className="text-sm text-slate-700 dark:text-slate-300">
                  Source 2
                </Label>
              </div>
            </div>
          </div>

          {/* Relevance */}
          <div className="mt-4 space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {getRelevanceText()}
            </Label>
            <Slider
              defaultValue={[filters.relevance]}
              max={100}
              step={1}
              onValueChange={handleRelevanceChange}
            />
          </div>

          {/* Apply Filters Button */}
          <Button type="button" className="mt-6 w-full" onClick={handleSubmit}>
            {getApplyFiltersText()}
          </Button>
        </div>
      )}
    </div>
  );
}
