
import { useState, useEffect } from "react";
import { useNews } from "@/hooks/useNews";
import NewsCard from "./NewsCard";

const NewsList = () => {
  const { news, loading } = useNews();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // 每秒更新当前时间
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-slate-700/50"></div>
            <div className="p-6">
              <div className="flex space-x-4 mb-3">
                <div className="h-4 bg-slate-700/50 rounded w-20"></div>
                <div className="h-4 bg-slate-700/50 rounded w-16"></div>
              </div>
              <div className="h-6 bg-slate-700/50 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-700/50 rounded"></div>
                <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">最新资讯</h2>
        <div className="flex items-center space-x-4">
          <div className="text-slate-300 text-sm">
            当前时间: <span className="text-blue-400 font-mono">{formatDate(currentDate)}</span>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">实时更新</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article) => (
          <NewsCard
            key={article.id}
            title={article.title}
            summary={article.summary}
            author={article.author}
            publishDate={article.publishDate}
            category={article.category}
            imageUrl={article.imageUrl}
            readTime={article.readTime}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsList;
