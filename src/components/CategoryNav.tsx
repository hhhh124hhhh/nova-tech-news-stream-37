
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

  // 显示前4个分类，其余放在下拉菜单中
  const visibleCategories = categories.slice(0, 4);
  const hiddenCategories = categories.slice(4);

  return (
    <nav className="flex items-center space-x-1">
      {visibleCategories.map((category) => (
        <Button
          key={category}
          onClick={() => onCategoryChange(category)}
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
          <DropdownMenuContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            {hiddenCategories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => onCategoryChange(category)}
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
