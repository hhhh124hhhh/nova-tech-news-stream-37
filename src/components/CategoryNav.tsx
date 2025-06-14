
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

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

  // 显示前5个分类，其余放在下拉菜单中
  const visibleCategories = categories.slice(0, 5);
  const hiddenCategories = categories.slice(5);

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
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          {category}
        </Button>
      ))}
      
      {hiddenCategories.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs">
              {getMoreCategoriesText()} <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-800 border-slate-700">
            {hiddenCategories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer ${
                  selectedCategory === category ? 'bg-slate-700 text-white' : ''
                }`}
              >
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
