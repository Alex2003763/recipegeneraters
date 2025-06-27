import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  ChefHat,
  Edit3,
  Trash2,
  Share2,
  Heart,
  CheckCircle2,
  Circle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { recipeService } from '../utils/database';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 載入食譜詳情
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        const recipeData = await recipeService.getRecipeById(parseInt(id));
        if (recipeData) {
          setRecipe(recipeData);
        } else {
          setError('找不到此食譜');
        }
      } catch (err) {
        setError('載入食譜失敗: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadRecipe();
    }
  }, [id]);

  // 切換步驟完成狀態
  const toggleStepComplete = (stepIndex) => {
    const newCheckedSteps = new Set(checkedSteps);
    if (newCheckedSteps.has(stepIndex)) {
      newCheckedSteps.delete(stepIndex);
    } else {
      newCheckedSteps.add(stepIndex);
    }
    setCheckedSteps(newCheckedSteps);
  };

  // 刪除食譜
  const handleDeleteRecipe = async () => {
    try {
      await recipeService.deleteRecipe(parseInt(id));
      toast.success('食譜已刪除');
      navigate('/recipes');
    } catch (error) {
      toast.error('刪除食譜失敗');
    }
  };

  // 分享食譜
  const handleShareRecipe = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        });
      } catch (error) {
        // 用戶取消分享或發生錯誤
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  // 複製到剪貼板
  const copyToClipboard = () => {
    const recipeText = `${recipe.title}\n\n${recipe.description}\n\n食材：\n${recipe.ingredients.map(ing => `• ${ing.name} ${ing.amount} ${ing.unit}`).join('\n')}\n\n步驟：\n${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}`;
    
    navigator.clipboard.writeText(recipeText).then(() => {
      toast.success('食譜已複製到剪貼板');
    }).catch(() => {
      toast.error('複製失敗');
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || '食譜不存在'}</div>
        <Link to="/recipes" className="btn-primary">
          返回食譜列表
        </Link>
      </div>
    );
  }

  const completedSteps = checkedSteps.size;
  const totalSteps = recipe.instructions.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* 返回按鈕 */}
      <div className="mb-6">
        <Link
          to="/recipes"
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-dark-accent transition-colors inline-flex items-center shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回食譜列表
        </Link>
      </div>

      {/* 食譜標題和操作 */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-foreground mb-2">
              {recipe.title}
            </h1>
            <p className="text-gray-600 dark:text-dark-muted-foreground text-lg">
              {recipe.description}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <button
              onClick={handleShareRecipe}
              className="p-2 rounded-md text-gray-600 dark:text-dark-muted-foreground hover:bg-gray-100 dark:hover:bg-dark-accent transition-colors"
              title="分享食譜"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-md text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-colors"
              title="刪除食譜"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 食譜資訊 */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-dark-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            烹飪時間：{recipe.cookingTime}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            份量：{recipe.servings} 人份
          </div>
          <div className="flex items-center">
            <ChefHat className="h-4 w-4 mr-2" />
            難度：{recipe.difficulty}
          </div>
        </div>

        {/* 標籤 */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {recipe.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary-100 dark:bg-dark-accent text-primary-800 dark:text-dark-primary text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 食材列表 */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-foreground mb-4">
              所需食材
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-gray-900 dark:text-dark-foreground">{ingredient.name}</span>
                  <span className="text-gray-600 dark:text-dark-muted-foreground text-sm">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 烹飪步驟 */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-foreground">
                烹飪步驟
              </h2>
              <div className="text-sm text-gray-600 dark:text-dark-muted-foreground">
                進度：{completedSteps}/{totalSteps} 步驟
              </div>
            </div>

            {/* 進度條 */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-dark-input rounded-full h-2">
                <div
                  className="bg-primary-600 dark:bg-dark-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* 步驟列表 */}
            <div className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
                    checkedSteps.has(index)
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                      : 'bg-gray-50 dark:bg-dark-input border-gray-200 dark:border-dark-border'
                  }`}
                >
                  <button
                    onClick={() => toggleStepComplete(index)}
                    className="flex-shrink-0 mt-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-accent transition-colors"
                  >
                    {checkedSteps.has(index) ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 dark:text-dark-muted-foreground hover:text-gray-600 dark:hover:text-dark-foreground" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-dark-foreground">
                        步驟 {index + 1}
                      </span>
                    </div>
                    <p className={`text-gray-700 dark:text-dark-muted-foreground leading-relaxed ${
                      checkedSteps.has(index) ? 'line-through text-gray-500 dark:text-dark-muted-foreground' : ''
                    }`}>
                      {instruction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 額外資訊 */}
      {(recipe.nutritionTips || recipe.variations || recipe.funnyComment) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {recipe.nutritionTips && (
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-foreground mb-3">
                營養建議
              </h3>
              <p className="text-gray-700 dark:text-dark-muted-foreground leading-relaxed">
                {recipe.nutritionTips}
              </p>
            </div>
          )}

          {recipe.variations && (
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-foreground mb-3">
                變化建議
              </h3>
              <p className="text-gray-700 dark:text-dark-muted-foreground leading-relaxed">
                {recipe.variations}
              </p>
            </div>
          )}

          {recipe.funnyComment && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow-sm border border-yellow-200 dark:border-yellow-700 p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-3 flex items-center">
                😄 廚師幽默時間
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 leading-relaxed italic">
                {recipe.funnyComment ? recipe.funnyComment : "這道菜如果連你都搞砸了，那你就是個驢子！現在，動起來！"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 刪除確認彈窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-card rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-foreground mb-4">
              確認刪除食譜
            </h3>
            <p className="text-gray-600 dark:text-dark-muted-foreground mb-6">
              您確定要刪除「{recipe.title}」嗎？此操作無法復原。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-dark-accent transition-colors shadow-sm"
              >
                取消
              </button>
              <button
                onClick={handleDeleteRecipe}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition-colors shadow-sm"
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

export default RecipeDetailPage;