
import { useState } from "react";
import Header from "@/components/Header";
import BlogPost from "@/components/BlogPost";
import { useNews } from "@/hooks/useNews";

const Blog = () => {
  const { changeLanguage, currentLanguage, handleApiKeyChange, news } = useNews();
  const [selectedCategory, setSelectedCategory] = useState("全部");

  // Extract unique categories from news data
  const categories = ["全部", ...new Set(news.map(item => item.category))];

  const blogPosts = news
    .filter(article => selectedCategory === "全部" || article.category === selectedCategory)
    .map(article => ({
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
            {blogPosts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
            
            {blogPosts.length === 0 && (
              <div className="text-center text-slate-400 py-12">
                <p className="text-lg">暂无相关博客文章</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;
