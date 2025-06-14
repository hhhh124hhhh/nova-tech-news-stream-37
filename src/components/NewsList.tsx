import { useState, useEffect } from "react";
import { useNews } from "@/hooks/useNews";
import { usePodcast } from "@/hooks/usePodcast";
import NewsCard from "./NewsCard";
import NewsModal from "./NewsModal";
import { AlertCircle, CheckCircle, XCircle, Volume2 } from "lucide-react";

interface NewsListProps {
  selectedCategory: string;
}

const NewsList = ({ selectedCategory }: NewsListProps) => {
  const { news, loading, getNewsByCategory, getNewsById, apiKeyMissing, currentLanguage, apiStatus, usingFreeApi } = useNews();
  const { playPodcast, isCurrentlyPlaying, isPlaying, stopPodcast } = usePodcast();
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
    if (currentLanguage === 'en') {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } else if (currentLanguage === 'ja') {
      return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } else if (currentLanguage === 'ko') {
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
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

  const getListTitle = () => {
    const isAllCategory = selectedCategory === "全部" || selectedCategory === "All" || selectedCategory === "すべて" || selectedCategory === "전체";
    
    if (isAllCategory) {
      if (currentLanguage === 'en') return "Latest AI News";
      if (currentLanguage === 'ja') return "最新AIニュース";
      if (currentLanguage === 'ko') return "최신 AI 뉴스";
      return "最新AI资讯";
    }
    
    return selectedCategory;
  };

  const getCurrentTimeLabel = () => {
    if (currentLanguage === 'en') return "Current Time";
    if (currentLanguage === 'ja') return "現在時刻";
    if (currentLanguage === 'ko') return "현재 시간";
    return "当前时间";
  };

  const getLiveUpdateLabel = () => {
    if (currentLanguage === 'en') return "Live Updates";
    if (currentLanguage === 'ja') return "リアルタイム更新";
    if (currentLanguage === 'ko') return "실시간 업데이트";
    return "实时更新";
  };

  const getDemoDataMessage = () => {
    if (currentLanguage === 'en') return {
      title: "API Configuration Required",
      description: "Configure news APIs in project settings to get real-time news. Check API_SETUP.md for details."
    };
    if (currentLanguage === 'ja') return {
      title: "API設定が必要",
      description: "リアルタイムニュースを取得するには、プロジェクト設定でニュースAPIを設定してください。"
    };
    if (currentLanguage === 'ko') return {
      title: "API 구성 필요",
      description: "실시간 뉴스를 얻으려면 프로젝트 설정에서 뉴스 API를 구성하세요."
    };
    return {
      title: "需要配置新闻API",
      description: "请在项目设置中配置新闻API密钥以获取实时新闻。详见 API_SETUP.md 文档。"
    };
  };

  const getApiStatusInfo = () => {
    const activeApis = Object.entries(apiStatus).filter(([_, active]) => active);
    const totalApis = Object.keys(apiStatus).length;
    
    if (currentLanguage === 'en') return {
      label: `APIs: ${activeApis.length}/${totalApis} active`,
      apis: {
        newsapi: 'NewsAPI (International)',
        juhe: 'JuHe API (China)',
        tianapi: 'TianAPI (Comprehensive)',
        currents: 'Currents API (Alternative)'
      }
    };
    
    return {
      label: `API状态: ${activeApis.length}/${totalApis} 个已配置`,
      apis: {
        newsapi: 'NewsAPI (国际新闻)',
        juhe: '聚合数据 (中国新闻)',
        tianapi: '天行数据 (综合新闻)',
        currents: 'Currents API (备选)'
      }
    };
  };

  const getNoNewsMessage = () => {
    if (currentLanguage === 'en') return `No ${selectedCategory} related news available`;
    if (currentLanguage === 'ja') return `${selectedCategory}関連のニュースはありません`;
    if (currentLanguage === 'ko') return `${selectedCategory} 관련 뉴스가 없습니다`;
    return `暂无 ${selectedCategory} 相关新闻`;
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

  const demoMessage = getDemoDataMessage();
  const apiStatusInfo = getApiStatusInfo();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">
            {getListTitle()}
          </h2>
          {isPlaying && (
            <div className="flex items-center space-x-2 text-green-400">
              <Volume2 className="h-5 w-5 animate-pulse" />
              <span className="text-sm">播客播放中</span>
              <button
                onClick={stopPodcast}
                className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                停止
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-slate-300 text-sm">
            {getCurrentTimeLabel()}: <span className="text-blue-400 font-mono">{formatDate(currentDate)}</span>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{getLiveUpdateLabel()}</span>
          </div>
        </div>
      </div>

      {/* API状态信息 */}
      <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-200 font-medium">{apiStatusInfo.label}</h3>
          {usingFreeApi && (
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
              {currentLanguage === 'en' ? 'Demo API' : '演示API'}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(apiStatus).map(([key, active]) => (
            <div key={key} className="flex items-center space-x-2">
              {active ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-xs ${active ? 'text-green-300' : 'text-red-300'}`}>
                {apiStatusInfo.apis[key as keyof typeof apiStatusInfo.apis]}
              </span>
            </div>
          ))}
        </div>
        {usingFreeApi && (
          <p className="text-xs text-slate-400 mt-2">
            {currentLanguage === 'en' ? 
              'Currently using free demo APIs. Configure your API keys for real-time news.' :
              '当前使用免费演示API。配置您的API密钥以获取实时新闻。'
            }
          </p>
        )}
      </div>

      {apiKeyMissing && (
        <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-600/50 rounded-lg flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
          <div className="text-yellow-200 text-sm">
            <p className="font-medium">{demoMessage.title}</p>
            <p>{demoMessage.description}</p>
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
            originalUrl={article.originalUrl}
            onReadMore={handleReadMore}
            onPlayPodcast={playPodcast}
            isPlaying={isCurrentlyPlaying(article.id)}
          />
        ))}
      </div>

      {filteredNews.length === 0 && !loading && (
        <div className="text-center text-slate-400 py-12">
          <p>{getNoNewsMessage()}</p>
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
