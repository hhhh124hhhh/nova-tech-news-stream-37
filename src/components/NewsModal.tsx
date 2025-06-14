
import { X, Calendar, User, Clock } from "lucide-react";
import { useMemo, useState } from "react";

interface NewsModalProps {
  news: {
    id: string;
    title: string;
    content: string;
    author: string;
    publishDate: string;
    category: string;
    imageUrl?: string;
    readTime: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const NewsModal = ({ news, isOpen, onClose }: NewsModalProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 生成稳定的图片URL
  const stableImageUrl = useMemo(() => {
    if (!news) return '';
    
    if (news.imageUrl && !imageError) {
      return news.imageUrl;
    }
    
    // 基于新闻ID生成稳定的图片
    const imageId = Math.abs(news.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0)) % 1000 + 1;
    
    return `https://picsum.photos/800/600?random=${imageId}`;
  }, [news?.id, news?.imageUrl, imageError]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageLoaded(false);
    }
  };

  // 重置状态当模态框关闭时
  const handleClose = () => {
    setImageError(false);
    setImageLoaded(false);
    onClose();
  };

  if (!isOpen || !news) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full">
              {news.category}
            </span>
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{news.publishDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{news.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{news.readTime}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="relative h-64 overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-700/50 animate-pulse flex items-center justify-center">
                <div className="text-slate-400 text-sm">加载中...</div>
              </div>
            )}
            <img
              src={stableImageUrl}
              alt={news.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
              {news.title}
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <div className="text-slate-300 leading-relaxed space-y-4">
                {news.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
