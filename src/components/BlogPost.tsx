
import { useState } from 'react';
import { Calendar, User, Heart, MessageCircle, Clock, Tag } from 'lucide-react';
import BlogComments from './BlogComments';
import { useBlogLikes } from '@/hooks/useBlogLikes';

// Dynamic import for react-markdown to handle loading
let ReactMarkdown: any = null;
let remarkGfm: any = null;

// Dynamically import markdown dependencies
const loadMarkdown = async () => {
  if (!ReactMarkdown) {
    try {
      const markdown = await import('react-markdown');
      const gfm = await import('remark-gfm');
      ReactMarkdown = markdown.default;
      remarkGfm = gfm.default;
    } catch (error) {
      console.warn('Failed to load markdown dependencies:', error);
    }
  }
};

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
  const [markdownLoaded, setMarkdownLoaded] = useState(false);
  
  const likeData = getBlogLikes(post.id);

  const handleLike = () => {
    toggleLike(post.id);
  };

  const handleExpand = async () => {
    if (!markdownLoaded) {
      await loadMarkdown();
      setMarkdownLoaded(true);
    }
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Sample markdown content for demonstration
  const markdownContent = `
# ${post.title}

${post.content}

## 技术要点

- **人工智能技术**: 深度学习、机器学习
- **应用场景**: 自然语言处理、计算机视觉
- **发展趋势**: 多模态AI、边缘计算

## 代码示例

\`\`\`python
import tensorflow as tf

def create_model():
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(10, activation='softmax')
    ])
    return model
\`\`\`

## 总结

人工智能技术正在快速发展，为各行各业带来新的机遇和挑战。
  `;

  const renderMarkdownContent = () => {
    if (ReactMarkdown && remarkGfm) {
      return (
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            className="text-slate-300"
            components={{
              h1: ({node, ...props}: any) => <h1 className="text-3xl font-bold text-white mb-4" {...props} />,
              h2: ({node, ...props}: any) => <h2 className="text-2xl font-bold text-white mb-3 mt-6" {...props} />,
              h3: ({node, ...props}: any) => <h3 className="text-xl font-bold text-white mb-2 mt-4" {...props} />,
              p: ({node, ...props}: any) => <p className="text-slate-300 mb-4 leading-relaxed" {...props} />,
              ul: ({node, ...props}: any) => <ul className="text-slate-300 mb-4 list-disc list-inside space-y-1" {...props} />,
              li: ({node, ...props}: any) => <li className="text-slate-300" {...props} />,
              code: ({node, inline, ...props}: any) => 
                inline ? 
                  <code className="bg-slate-700 text-blue-300 px-1 py-0.5 rounded text-sm" {...props} /> :
                  <code className="block bg-slate-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm" {...props} />,
              pre: ({node, ...props}: any) => <pre className="bg-slate-900 rounded-lg mb-4" {...props} />,
              strong: ({node, ...props}: any) => <strong className="text-blue-400 font-semibold" {...props} />
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      );
    } else {
      // Fallback rendering without markdown
      return (
        <div className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
          <div className="text-slate-300 whitespace-pre-wrap">{post.content}</div>
        </div>
      );
    }
  };

  return (
    <article className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
      {post.imageUrl && (
        <div className="h-64 overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
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

        {!isExpanded ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-4 hover:text-blue-400 transition-colors cursor-pointer">
              {post.title}
            </h2>
            
            <p className="text-slate-300 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          </>
        ) : (
          renderMarkdownContent()
        )}

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
            onClick={handleExpand}
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
