
import { useState } from 'react';
import { Calendar, User, Heart, MessageCircle, Clock, Tag } from 'lucide-react';
import BlogComments from './BlogComments';
import { useBlogLikes } from '@/hooks/useBlogLikes';
import { generateBlogImage, getImageFallbacks } from '@/services/imageGenerationApi';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    publishDate: string;
    category: string;
    imageUrl?: string;
    readTime: string;
  };
}

const BlogPost = ({ post }: BlogPostProps) => {
  const { getBlogLikes, toggleLike } = useBlogLikes();
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const likeData = getBlogLikes(post.id);

  const handleLike = () => {
    toggleLike(post.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 生成图片URL，优先使用AI生成的图片
  const generatedImageUrl = generateBlogImage(post.id, post.title, post.category);
  const fallbackImages = getImageFallbacks(post.id);
  
  // 当前使用的图片URL
  const getCurrentImageUrl = () => {
    if (post.imageUrl && !imageError && currentImageIndex === 0) {
      return post.imageUrl;
    }
    if (currentImageIndex === 0 && !imageError) {
      return generatedImageUrl;
    }
    return fallbackImages[Math.min(currentImageIndex - 1, fallbackImages.length - 1)];
  };

  // 处理图片加载错误，尝试下一个备选图片
  const handleImageError = () => {
    console.log(`图片加载失败，尝试备选图片 ${currentImageIndex + 1}`);
    if (currentImageIndex < fallbackImages.length) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setImageError(true);
    }
  };

  // 渲染扩展内容
  const renderExpandedContent = () => {
    const sections = post.content.split('\n\n');
    
    return (
      <div className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold text-white mb-6">{post.title}</h1>
        
        <div className="text-slate-300 mb-6 leading-relaxed space-y-4">
          {sections.map((section, index) => {
            if (section.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-bold text-white mb-4 mt-8">
                  {section.replace('## ', '')}
                </h2>
              );
            }
            if (section.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-bold text-white mb-3 mt-6">
                  {section.replace('### ', '')}
                </h3>
              );
            }
            if (section.includes('```')) {
              const codeContent = section.replace(/```\w*\n?/g, '').replace(/```/g, '');
              return (
                <pre key={index} className="bg-slate-900 rounded-lg mb-6 p-4 overflow-x-auto">
                  <code className="text-green-300 text-sm">{codeContent}</code>
                </pre>
              );
            }
            if (section.startsWith('- ') || section.includes('\n- ')) {
              const items = section.split('\n').filter(item => item.startsWith('- '));
              return (
                <ul key={index} className="text-slate-300 mb-4 list-disc list-inside space-y-2">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-slate-300">
                      {item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-400">$1</strong>')
                        .split('<strong class="text-blue-400">').map((part, partIndex) => {
                          if (partIndex === 0) return part;
                          const [boldText, rest] = part.split('</strong>');
                          return (
                            <span key={partIndex}>
                              <strong className="text-blue-400">{boldText}</strong>
                              {rest}
                            </span>
                          );
                        })}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-slate-300 mb-4 leading-relaxed">
                {section}
              </p>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isExpanded) {
      return renderExpandedContent();
    }

    return (
      <>
        <h2 className="text-2xl font-bold text-white mb-4 hover:text-blue-400 transition-colors cursor-pointer">
          {post.title}
        </h2>
        
        <p className="text-slate-300 mb-6 leading-relaxed">
          {post.excerpt}
        </p>
      </>
    );
  };

  return (
    <article className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
      {/* 显示生成的图片或备选图片 */}
      {!imageError && (
        <div className="h-64 overflow-hidden bg-slate-700">
          <img
            src={getCurrentImageUrl()}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            loading="lazy"
          />
        </div>
      )}
      
      {/* 图片加载失败时的占位符 */}
      {imageError && (
        <div className="h-64 overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/30 rounded-lg flex items-center justify-center">
              <Tag className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-slate-400 text-sm">{post.category}</p>
          </div>
        </div>
      )}
      
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-4">
          <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full flex items-center space-x-1">
            <Tag className="h-3 w-3" />
            <span>{post.category}</span>
          </span>
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {renderContent()}

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                likeData.userLiked
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-red-400'
              }`}
            >
              <Heart className={`h-4 w-4 ${likeData.userLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likeData.likes}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-blue-400 transition-all duration-200"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">评论</span>
            </button>
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            {isExpanded ? '收起' : '阅读全文'} →
          </button>
        </div>

        {showComments && (
          <div className="mt-6">
            <BlogComments
              blogId={post.id}
              title={post.title}
              isOpen={true}
              onClose={() => setShowComments(false)}
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogPost;
