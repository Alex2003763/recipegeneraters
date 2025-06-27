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
  SortDesc
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
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
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
          <p className="text-gray-600 dark:text-dark-muted-foreground mt-2">
            共有 {recipes.length} 份食譜
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-dark-primary dark:hover:bg-primary-600 transition-colors"
        >
          創建新食譜
        </Link>
      </div>

      {/* 搜索和過濾工具欄 */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-dark-muted-foreground" />
            <input
              type="text"
              placeholder="搜索食譜名稱或食材..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="input pl-10 w-full dark:bg-dark-input dark:border-dark-border"
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
              className="btn-outline p-2 dark:border-dark-border dark:hover:bg-dark-accent"
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="h-4 w-4 dark:text-dark-foreground" />
              ) : (
                <SortDesc className="h-4 w-4 dark:text-dark-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* 標籤過濾 */}
        {allTags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
            <div className="flex items-center mb-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-dark-muted-foreground mr-2" />
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
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedRecipes.length === 0 ? (
        <div className="lg:col-span-3 text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 dark:text-dark-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-foreground mb-2">
            {searchQuery ? '找不到相關食譜' : '還沒有食譜'}
          </h3>
          <p className="text-gray-600 dark:text-dark-muted-foreground mb-4">
            {searchQuery
              ? '嘗試使用不同的關鍵字搜索'
              : '開始創建您的第一份 AI 食譜吧！'
            }
          </p>
          {!searchQuery && (
            <Link to="/" className="btn-primary dark:bg-dark-primary dark:hover:bg-primary-600">
              創建食譜
            </Link>
          )}
        </div>
      ) : (
        filteredAndSortedRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card group">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-900 dark:text-dark-foreground group-hover:text-primary-600 dark:group-hover:text-dark-primary transition-colors line-clamp-2">
                {recipe.title}
              </h3>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  to={`/recipe/${recipe.id}`}
                  className="p-1 text-gray-500 dark:text-dark-muted-foreground hover:text-primary-600 dark:hover:text-dark-primary transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(recipe)}
                  className="p-1 text-gray-500 dark:text-dark-muted-foreground hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

             <p className="text-sm text-gray-600 dark:text-dark-muted-foreground mb-4 line-clamp-2">
               {recipe.description}
             </p>

             <div className="flex items-center justify-between text-xs text-gray-500 dark:text-dark-muted-foreground mb-4">
               <div className="flex items-center space-x-3">
                 <div className="flex items-center">
                   <Clock className="h-3 w-3 mr-1" />
                   {recipe.cookingTime}
                 </div>
                 <div className="flex items-center">
                   <Users className="h-3 w-3 mr-1" />
                   {recipe.servings} 人份
                 </div>
                 <div className="flex items-center">
                   <ChefHat className="h-3 w-3 mr-1" />
                   {recipe.difficulty}
                 </div>
               </div>
             </div>

             {recipe.tags && recipe.tags.length > 0 && (
               <div className="flex flex-wrap gap-1 mb-3">
                 {recipe.tags.slice(0, 3).map(tag => (
                   <span
                     key={tag}
                     className="px-2 py-1 bg-gray-100 dark:bg-dark-input text-gray-600 dark:text-dark-foreground text-xs rounded-full"
                   >
                     {tag}
                   </span>
                 ))}
                 {recipe.tags.length > 3 && (
                   <span className="px-2 py-1 bg-gray-100 dark:bg-dark-input text-gray-600 dark:text-dark-foreground text-xs rounded-full">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-card rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-foreground mb-4">
              確認刪除食譜
            </h3>
            <p className="text-gray-600 dark:text-dark-muted-foreground mb-6">
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
                className="btn bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
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