
import { useState } from "react";
import { Calendar, User, ExternalLink, Link } from "lucide-react";

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  author: string;
  publishDate: string;
  category: string;
  imageUrl?: string;
  readTime: string;
  originalUrl?: string;
  onReadMore: (id: string) => void;
}

const NewsCard = ({ id, title, summary, author, publishDate, category, imageUrl, readTime, originalUrl, onReadMore }: NewsCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleOriginalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (originalUrl) {
      window.open(originalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full">
              {category}
            </span>
          </div>
          {originalUrl && (
            <div className="absolute top-4 right-4">
              <button
                onClick={handleOriginalLinkClick}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                title="查看原文"
              >
                <Link className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
          </div>
          <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded">
            {readTime}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 hover:text-blue-400 transition-colors duration-200">
          {title}
        </h3>

        <p className="text-slate-300 mb-4 line-clamp-3 leading-relaxed">
          {summary}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={() => onReadMore(id)}
            className={`flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-all duration-200 font-medium ${
              isHovered ? "transform translate-x-1" : ""
            }`}
          >
            <span>阅读更多</span>
            <ExternalLink className="h-4 w-4" />
          </button>
          
          {originalUrl && (
            <button
              onClick={handleOriginalLinkClick}
              className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors text-sm"
            >
              <Link className="h-3 w-3" />
              <span>原文链接</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
