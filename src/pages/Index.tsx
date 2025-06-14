
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
            AI大模型资讯中心
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {currentLanguage === 'zh' && '专注于大语言模型、AI智能体、多模态AI等前沿技术的最新发展动态'}
            {currentLanguage === 'en' && 'Focus on the latest developments in large language models, AI agents, multimodal AI and cutting-edge technologies'}
            {currentLanguage === 'ja' && '大規模言語モデル、AIエージェント、マルチモーダルAIなど最先端技術の最新動向に焦点'}
            {currentLanguage === 'ko' && '대규모 언어 모델, AI 에이전트, 멀티모달 AI 등 최첨단 기술의 최신 동향에 집중'}
          </p>
        </div>
        <NewsList selectedCategory={selectedCategory} />
      </main>
    </div>
  );
};

export default Index;

