
import { useState } from "react";
import { Menu, X, Newspaper } from "lucide-react";
import SearchBar from "./SearchBar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = ["全部", "AI智能体", "AI视频", "AI绘画", "大语言模型", "机器学习"];

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AI News Hub</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <SearchBar />
            <nav className="flex space-x-6">
              {categories.slice(0, 4).map((category) => (
                <button
                  key={category}
                  className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700/50">
            <SearchBar />
            <nav className="flex flex-col space-y-3 mt-4">
              {categories.map((category) => (
                <button
                  key={category}
                  className="text-slate-300 hover:text-white transition-colors duration-200 font-medium text-left"
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
