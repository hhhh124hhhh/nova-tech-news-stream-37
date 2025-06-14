
import { useState } from "react";
import Header from "@/components/Header";
import NewsList from "@/components/NewsList";
import { useNews } from "@/hooks/useNews";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const { changeLanguage, currentLanguage, handleApiKeyChange } = useNews();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header 
        onCategoryChange={setSelectedCategory}
        selectedCategory={selectedCategory}
        onLanguageChange={changeLanguage}
        selectedLanguage={currentLanguage}
        onApiKeyChange={handleApiKeyChange}
      />
      <main className="container mx-auto px-4 py-8">
        <NewsList selectedCategory={selectedCategory} />
      </main>
    </div>
  );
};

export default Index;
