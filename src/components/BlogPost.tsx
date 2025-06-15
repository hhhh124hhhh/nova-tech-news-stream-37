
import { useState } from 'react';
import { Calendar, User, Heart, MessageCircle, Clock, Tag } from 'lucide-react';
import BlogComments from './BlogComments';
import { useBlogLikes } from '@/hooks/useBlogLikes';

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

  // 默认占位图片
  const defaultImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80";

  // 处理图片加载错误
  const handleImageError = () => {
    setImageError(true);
  };

  // Enhanced content with markdown-like formatting
  const renderContent = () => {
    if (isExpanded) {
      return (
        <div className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-white mb-6">{post.title}</h1>
          
          <div className="text-slate-300 mb-6 leading-relaxed">
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-white mb-4 mt-8">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-bold text-white mb-3 mt-6">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={index} className="text-slate-300 mb-4 list-disc list-inside space-y-2">
                    {paragraph.split('\n').map((item, itemIndex) => (
                      <li key={itemIndex} className="text-slate-300">
                        {item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-400">$1</strong>')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-slate-300 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">技术要点</h2>
          <ul className="text-slate-300 mb-6 list-disc list-inside space-y-2">
            <li><strong className="text-blue-400">人工智能技术</strong>: 深度学习、机器学习</li>
            <li><strong className="text-blue-400">应用场景</strong>: 自然语言处理、计算机视觉</li>
            <li><strong className="text-blue-400">发展趋势</strong>: 多模态AI、边缘计算</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">代码示例</h2>
          <pre className="bg-slate-900 rounded-lg mb-6 p-4 overflow-x-auto">
            <code className="text-green-300 text-sm">
{`import tensorflow as tf

def create_model():
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(10, activation='softmax')
    ])
    return model`}
            </code>
          </pre>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">总结</h2>
          <p className="text-slate-300 leading-relaxed">
            人工智能技术正在快速发展，为各行各业带来新的机遇和挑战。通过不断的技术创新和应用实践，AI将在未来发挥越来越重要的作用。
          </p>
        </div>
      );
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
      {(post.imageUrl && !imageError) && (
        <div className="h-64 overflow-hidden bg-slate-700">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            loading="lazy"
          />
        </div>
      )}
      
      {/* 如果图片加载失败或没有图片，显示默认图片 */}
      {(!post.imageUrl || imageError) && (
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
