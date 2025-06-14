
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

  const getPageTitle = () => {
    if (currentLanguage === 'en') return 'AI Large Model News Center';
    if (currentLanguage === 'ja') return 'AI大規模言語モデルニュースセンター';
    if (currentLanguage === 'ko') return 'AI 대규모 언어 모델 뉴스 센터';
    return 'AI大模型资讯中心';
  };

  const getPageDescription = () => {
    if (currentLanguage === 'en') return 'Focus on the latest developments in large language models, AI agents, multimodal AI, AI art, AI video, AI programming and cutting-edge technologies';
    if (currentLanguage === 'ja') return '大規模言語モデル、AIエージェント、マルチモーダルAI、AI画像生成、AI動画、AIプログラミングなど最先端技術の最新動向に焦点';
    if (currentLanguage === 'ko') return '대규모 언어 모델, AI 에이전트, 멀티모달 AI, AI 그림 생성, AI 비디오, AI 프로그래밍 등 최첨단 기술의 최신 동향에 집중';
    return '专注于大语言模型、AI智能体、多模态AI、AI绘画、AI视频、AI编程等前沿技术的最新发展动态';
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
            {getPageTitle()}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {getPageDescription()}
          </p>
        </div>
        <NewsList selectedCategory={selectedCategory} />
      </main>
    </div>
  );
};

export default Index;
