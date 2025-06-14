
import { useState, useEffect } from "react";
import { useNews } from "@/hooks/useNews";
import NewsCard from "./NewsCard";
import NewsModal from "./NewsModal";
import { AlertCircle } from "lucide-react";

interface NewsListProps {
  selectedCategory: string;
}

const NewsList = ({ selectedCategory }: NewsListProps) => {
  const { news, loading, getNewsByCategory, getNewsById, apiKeyMissing } = useNews();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredNews = getNewsByCategory(selectedCategory);
  const selectedNews = selectedNewsId ? getNewsById(selectedNewsId) : null;

  useEffect(() => {
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

  const handleReadMore = (id: string) => {
    setSelectedNewsId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNewsId(null);
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
        <h2 className="text-2xl font-bold text-white">
          {selectedCategory === "全部" ? "最新资讯" : selectedCategory}
        </h2>
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

      {apiKeyMissing && (
        <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-600/50 rounded-lg flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
          <div className="text-yellow-200 text-sm">
            <p className="font-medium">正在使用演示数据</p>
            <p>要获取实时新闻，请在 src/services/newsApi.ts 中添加有效的 NewsAPI 密钥</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article) => (
          <NewsCard
            key={article.id}
            id={article.id}
            title={article.title}
            summary={article.summary}
            author={article.author}
            publishDate={article.publishDate}
            category={article.category}
            imageUrl={article.imageUrl}
            readTime={article.readTime}
            onReadMore={handleReadMore}
          />
        ))}
      </div>

      {filteredNews.length === 0 && !loading && (
        <div className="text-center text-slate-400 py-12">
          <p>暂无 {selectedCategory} 相关新闻</p>
        </div>
      )}

      <NewsModal
        news={selectedNews}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default NewsList;
