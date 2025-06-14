
import { useState } from "react";
import { Calendar, User, Heart, MessageCircle, Clock, Tag } from "lucide-react";
import Header from "@/components/Header";
import BlogComments from "@/components/BlogComments";
import { useNews } from "@/hooks/useNews";
import { useBlogLikes } from "@/hooks/useBlogLikes";

const Blog = () => {
  const { changeLanguage, currentLanguage, handleApiKeyChange, news } = useNews();
  const { getBlogLikes, toggleLike } = useBlogLikes();
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // Extract unique categories from news data
  const categories = ["全部", ...new Set(news.map(item => item.category))];

  const blogPosts = news.map(article => ({
    id: article.id,
    title: article.title,
    excerpt: article.summary,
    content: article.content,
    author: article.author,
    publishDate: article.publishDate,
    category: article.category,
    imageUrl: article.imageUrl,
    readTime: article.readTime
  }));

  const handleLike = (blogId: string) => {
    toggleLike(blogId);
  };

  const handleComments = (blogId: string) => {
    setSelectedBlogId(blogId);
    setIsCommentsOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header 
        onCategoryChange={setSelectedCategory}
        selectedCategory={selectedCategory}
        onLanguageChange={changeLanguage}
        selectedLanguage={currentLanguage}
        onApiKeyChange={handleApiKeyChange}
        categories={categories}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              AI科技博客
            </h1>
            <p className="text-xl text-slate-300">
              探索人工智能的最新发展与深度分析
            </p>
          </div>

          <div className="space-y-8">
            {blogPosts.map((post) => {
              const likeData = getBlogLikes(post.id);
              
              return (
                <article key={post.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
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

                    <h2 className="text-2xl font-bold text-white mb-4 hover:text-blue-400 transition-colors cursor-pointer">
                      {post.title}
                    </h2>
                    
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLike(post.id)}
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
                          onClick={() => handleComments(post.id)}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-blue-400 transition-all duration-200"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">评论</span>
                        </button>
                      </div>
                      
                      <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        阅读全文 →
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      {selectedBlogId && (
        <BlogComments
          blogId={selectedBlogId}
          title={blogPosts.find(p => p.id === selectedBlogId)?.title || ''}
          isOpen={isCommentsOpen}
          onClose={() => {
            setIsCommentsOpen(false);
            setSelectedBlogId(null);
          }}
        />
      )}
    </div>
  );
};

export default Blog;
