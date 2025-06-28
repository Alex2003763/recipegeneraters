import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  Clock,
  Users,
  ChefHat,
  Trash2,
  Eye,
  BookOpen,
  Filter,
  SortAsc,
  SortDesc,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRecipes } from '../hooks/useRecipes';

const RecipesPage = () => {
  const { recipes, loading, error, deleteRecipe, searchRecipes, refreshRecipes } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // 處理搜索輸入
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 使用 useEffect 實現 debounce 搜索
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        searchRecipes(searchQuery);
      } else {
        refreshRecipes();
      }
    }, 500); // 500ms 延遲

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, searchRecipes, refreshRecipes]);

  // 處理刪除食譜
  const handleDeleteRecipe = async (id, title) => {
    try {
      await deleteRecipe(id);
      toast.success(`已刪除食譜「${title}」`);
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error('刪除食譜失敗');
    }
  };

  // 獲取所有標籤
  const allTags = [...new Set(recipes.flatMap(recipe => recipe.tags || []))];

  // 過濾和排序食譜
  const filteredAndSortedRecipes = recipes
    .filter(recipe => {
      if (selectedTags.length === 0) return true;
      return selectedTags.some(tag => recipe.tags?.includes(tag));
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // 格式化日期
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-red-600">{error}</div>
        <button
          onClick={refreshRecipes}
          className="btn-primary"
        >
          重新載入
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-foreground">我的食譜</h1>
          <p className="mt-2 text-gray-600 dark:text-dark-muted-foreground">
            共有 {recipes.length} 份食譜
          </p>
        </div>
        <Link
          to="/"
          className="btn-primary inline-flex items-center px-5 py-2.5 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          創建新食譜
        </Link>
      </div>

      {/* 搜索和過濾工具欄 */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-dark-card dark:border-dark-border">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* 搜索框 */}
          <div className="relative flex-1">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-dark-muted-foreground" />
            <input
              type="text"
              placeholder="搜索食譜名稱或食材..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="w-full pl-10 input dark:bg-dark-input dark:border-dark-border"
            />
          </div>

          {/* 排序選擇 */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input min-w-[120px] dark:bg-dark-input dark:border-dark-border"
            >
              <option value="createdAt">創建時間</option>
              <option value="title">食譜名稱</option>
              <option value="cookingTime">烹飪時間</option>
              <option value="difficulty">難度</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 btn-outline dark:border-dark-border dark:hover:bg-dark-accent"
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="w-4 h-4 dark:text-dark-foreground" />
              ) : (
                <SortDesc className="w-4 h-4 dark:text-dark-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* 標籤過濾 */}
        {allTags.length > 0 && (
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-dark-border">
            <div className="flex items-center mb-2">
              <Filter className="w-4 h-4 mr-2 text-gray-500 dark:text-dark-muted-foreground" />
              <span className="text-sm font-medium text-gray-700 dark:text-dark-foreground">依標籤過濾：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-100 dark:bg-dark-accent text-primary-800 dark:text-dark-primary border border-primary-300 dark:border-dark-primary'
                      : 'bg-gray-100 dark:bg-dark-input text-gray-700 dark:text-dark-foreground border border-gray-300 dark:border-dark-border hover:bg-gray-200 dark:hover:bg-dark-accent'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 食譜列表 */}
     <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredAndSortedRecipes.length === 0 ? (
        <div className="py-12 text-center lg:col-span-3">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-dark-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-dark-foreground">
            {searchQuery ? '找不到相關食譜' : '還沒有食譜'}
          </h3>
          <p className="mb-4 text-gray-600 dark:text-dark-muted-foreground">
            {searchQuery
              ? '嘗試使用不同的關鍵字搜索'
              : '開始創建您的第一份 AI 食譜吧！'
            }
          </p>
          {!searchQuery && (
            <Link to="/" className="btn-primary inline-flex items-center px-5 py-2.5 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
              <Sparkles className="w-5 h-5 mr-2" />
              創建食譜
            </Link>
          )}
        </div>
      ) : (
        filteredAndSortedRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card group">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-gray-900 transition-colors dark:text-dark-foreground group-hover:text-primary-600 dark:group-hover:text-dark-primary line-clamp-2">
                {recipe.title}
              </h3>
              <div className="flex space-x-1 transition-opacity opacity-0 group-hover:opacity-100">
                <Link
                  to={`/recipe/${recipe.id}`}
                  className="p-1 text-gray-500 transition-colors dark:text-dark-muted-foreground hover:text-primary-600 dark:hover:text-dark-primary"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(recipe)}
                  className="p-1 text-gray-500 transition-colors dark:text-dark-muted-foreground hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

             <p className="mb-4 text-sm text-gray-600 dark:text-dark-muted-foreground line-clamp-2">
               {recipe.description}
             </p>

             <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-dark-muted-foreground">
               <div className="flex items-center space-x-3">
                 <div className="flex items-center">
                   <Clock className="w-3 h-3 mr-1" />
                   {recipe.cookingTime}
                 </div>
                 <div className="flex items-center">
                   <Users className="w-3 h-3 mr-1" />
                   {recipe.servings} 人份
                 </div>
                 <div className="flex items-center">
                   <ChefHat className="w-3 h-3 mr-1" />
                   {recipe.difficulty}
                 </div>
               </div>
             </div>

             {recipe.tags && recipe.tags.length > 0 && (
               <div className="flex flex-wrap gap-1 mb-3">
                 {recipe.tags.slice(0, 3).map(tag => (
                   <span
                     key={tag}
                     className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full dark:bg-dark-input dark:text-dark-foreground"
                   >
                     {tag}
                   </span>
                 ))}
                 {recipe.tags.length > 3 && (
                   <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full dark:bg-dark-input dark:text-dark-foreground">
                     +{recipe.tags.length - 3}
                   </span>
                 )}
               </div>
             )}

             <div className="text-xs text-gray-400 dark:text-dark-muted-foreground">
               創建於 {formatDate(recipe.createdAt)}
             </div>
           </div>
         ))
       )}
     </div>

      {/* 刪除確認彈窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg dark:bg-dark-card">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-dark-foreground">
              確認刪除食譜
            </h3>
            <p className="mb-6 text-gray-600 dark:text-dark-muted-foreground">
              您確定要刪除「{showDeleteConfirm.title}」嗎？此操作無法復原。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn-outline dark:border-dark-border dark:hover:bg-dark-accent"
              >
                取消
              </button>
              <button
                onClick={() => handleDeleteRecipe(showDeleteConfirm.id, showDeleteConfirm.title)}
                className="text-white bg-red-600 btn hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesPage;