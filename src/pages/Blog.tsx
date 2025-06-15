
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

  const getBlogTitle = () => {
    if (currentLanguage === 'en') return "Global News Blog";
    if (currentLanguage === 'ja') return "グローバルニュースブログ";
    if (currentLanguage === 'ko') return "글로벌 뉴스 블로그";
    return "全球资讯博客";
  };

  const getBlogSubtitle = () => {
    if (currentLanguage === 'en') return "Explore the latest developments and in-depth analysis from around the world";
    if (currentLanguage === 'ja') return "世界各地の最新動向と詳細分析をご紹介";
    if (currentLanguage === 'ko') return "전 세계의 최신 동향과 심층 분석 탐색";
    return "探索全球最新发展与深度分析";
  };

  const getNoArticlesText = () => {
    if (currentLanguage === 'en') return "No related blog articles available";
    if (currentLanguage === 'ja') return "関連するブログ記事はありません";
    if (currentLanguage === 'ko') return "관련 블로그 기사가 없습니다";
    return "暂无相关博客文章";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
              {getBlogTitle()}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              {getBlogSubtitle()}
            </p>
          </div>

          <div className="space-y-8">
            {blogPosts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
            
            {blogPosts.length === 0 && (
              <div className="text-center text-slate-400 py-12">
                <p className="text-lg">{getNoArticlesText()}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;
