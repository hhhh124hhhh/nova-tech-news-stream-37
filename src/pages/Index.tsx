
import { useState } from "react";
import Header from "@/components/Header";
import NewsList from "@/components/NewsList";
import { useNews } from "@/hooks/useNews";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const { changeLanguage, currentLanguage, handleApiKeyChange, news } = useNews();

  // Extract unique categories from news data
  const categories = ["全部", ...new Set(news.map(item => item.category))];

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
        <NewsList selectedCategory={selectedCategory} />
      </main>
    </div>
  );
};

export default Index;
