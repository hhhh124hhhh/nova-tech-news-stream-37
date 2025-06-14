
import { useState } from "react";
import Header from "@/components/Header";
import NewsList from "@/components/NewsList";
import { useNews } from "@/hooks/useNews";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const { changeLanguage, currentLanguage } = useNews();

  const handleLanguageChange = (language: string) => {
    changeLanguage(language);
    // 根据语言更新分类名称
    if (language === 'en') {
      setSelectedCategory("All");
    } else if (language === 'ja') {
      setSelectedCategory("すべて");
    } else if (language === 'ko') {
      setSelectedCategory("전체");
    } else {
      setSelectedCategory("全部");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header 
        onCategoryChange={setSelectedCategory}
        selectedCategory={selectedCategory}
        onLanguageChange={handleLanguageChange}
        selectedLanguage={currentLanguage}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI News Hub
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {currentLanguage === 'zh' && '探索人工智能的最新发展，获取前沿科技资讯和深度分析'}
            {currentLanguage === 'en' && 'Explore the latest developments in artificial intelligence and get cutting-edge technology insights'}
            {currentLanguage === 'ja' && '人工知能の最新動向を探り、最先端技術の洞察と詳細な分析を入手'}
            {currentLanguage === 'ko' && '인공지능의 최신 발전을 탐구하고 최첨단 기술 인사이트와 심층 분석을 얻으세요'}
          </p>
        </div>
        <NewsList selectedCategory={selectedCategory} />
      </main>
    </div>
  );
};

export default Index;
