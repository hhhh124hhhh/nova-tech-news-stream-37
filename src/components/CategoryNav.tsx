
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Hash } from "lucide-react";

interface CategoryNavProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  currentLanguage: string;
}

const CategoryNav = ({ categories, selectedCategory, onCategoryChange, currentLanguage }: CategoryNavProps) => {
  const getMoreCategoriesText = () => {
    if (currentLanguage === 'en') return "More Categories";
    if (currentLanguage === 'ja') return "その他のカテゴリ";
    if (currentLanguage === 'ko') return "더 많은 카테고리";
    return "更多分类";
  };

  // Filter out AI-related categories
  const filteredCategories = categories.filter(category => 
    !category.includes('AI') && 
    !category.includes('大语言模型') && 
    !category.includes('AI训练技术') && 
    !category.includes('AI行业动态') && 
    !category.includes('多模态AI') && 
    !category.includes('AI编程')
  );

  // 快速导航到专门页面
  const handleSpecialCategories = (category: string) => {
    if (category === '财经' || category === 'Business' || category === 'ビジネス' || category === '비즈니스') {
      window.location.href = '/business';
      return;
    }
    if (category === '科技' || category === 'Technology' || category === 'テクノロジー' || category === '기술') {
      window.location.href = '/tech';
      return;
    }
    if (category === '娱乐' || category === 'Entertainment' || category === 'エンターテイメント' || category === '엔터테인먼트') {
      window.location.href = '/entertainment';
      return;
    }
    if (category === '体育' || category === 'Sports' || category === 'スポーツ' || category === '스포츠') {
      window.location.href = '/sports';
      return;
    }
    if (category === '健康' || category === 'Health' || category === '健康日' || category === '건강한') {
      window.location.href = '/health';
      return;
    }
    if (category === '热点' || category === 'Trending' || category === 'トレンド' || category === '트렌딩') {
      window.location.href = '/trending';
      return;
    }
    
    // 普通分类切换
    onCategoryChange(category);
  };

  // 显示前8个分类，其余放在下拉菜单中
  const visibleCategories = filteredCategories.slice(0, 8);
  const hiddenCategories = filteredCategories.slice(8);

  return (
    <nav className="flex items-center space-x-1 flex-wrap">
      {visibleCategories.map((category) => (
        <Button
          key={category}
          onClick={() => handleSpecialCategories(category)}
          variant={selectedCategory === category ? "default" : "ghost"}
          size="sm"
          className={`transition-all duration-200 text-xs whitespace-nowrap ${
            selectedCategory === category
              ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
              : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-800'
          }`}
        >
          <Hash className="h-3 w-3 mr-1" />
          {category}
        </Button>
      ))}
      
      {hiddenCategories.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-800 text-xs"
            >
              {getMoreCategoriesText()} <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 z-50">
            {hiddenCategories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => handleSpecialCategories(category)}
                className={`text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-700 cursor-pointer ${
                  selectedCategory === category ? 'bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-400' : ''
                }`}
              >
                <Hash className="h-3 w-3 mr-2" />
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};

export default CategoryNav;
