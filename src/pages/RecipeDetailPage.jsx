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
  Circle,
  Star
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
      <div className="py-12 text-center">
        <div className="mb-4 text-red-600">{error || '食譜不存在'}</div>
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
          className="inline-flex items-center px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-md shadow-sm dark:border-dark-border dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-dark-accent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回食譜列表
        </Link>
      </div>

      {/* 食譜標題和操作 */}
      <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-dark-card dark:border-dark-border">
        <div className="flex flex-col items-start justify-between mb-4 lg:flex-row lg:items-center">
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-dark-foreground">
              {recipe.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-dark-muted-foreground">
              {recipe.description}
            </p>
          </div>
          
          <div className="flex items-center mt-4 space-x-2 lg:mt-0">
            <button
              onClick={handleShareRecipe}
              className="p-2 text-gray-600 transition-colors rounded-md dark:text-dark-muted-foreground hover:bg-gray-100 dark:hover:bg-dark-accent"
              title="分享食譜"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-600 transition-colors rounded-md dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400"
              title="刪除食譜"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 食譜資訊 */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-dark-muted-foreground">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            烹飪時間：{recipe.cookingTime}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            份量：{recipe.servings} 人份
          </div>
          <div className="flex items-center">
            <ChefHat className="w-4 h-4 mr-2" />
            難度：{recipe.difficulty}
          </div>
        </div>

        {/* 標籤 */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {recipe.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-primary-100 dark:bg-dark-accent text-primary-800 dark:text-dark-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 食材列表 */}
        <div className="lg:col-span-1">
          <div className="sticky p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-dark-card dark:border-dark-border top-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-dark-foreground">
              所需食材
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-dark-foreground">{ingredient.name}</span>
                  <span className="text-sm text-gray-600 dark:text-dark-muted-foreground">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 烹飪步驟 */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-dark-card dark:border-dark-border">
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
              <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-dark-input">
                <div
                  className="h-2 transition-all duration-300 rounded-full bg-primary-600 dark:bg-dark-primary"
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
                    className="flex-shrink-0 p-1 mt-1 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-dark-accent"
                  >
                    {checkedSteps.has(index) ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 dark:text-dark-muted-foreground hover:text-gray-600 dark:hover:text-dark-foreground" />
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
        <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
          {recipe.nutritionTips && (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-dark-card dark:border-dark-border">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-dark-foreground">
                營養建議
              </h3>
              <p className="leading-relaxed text-gray-700 dark:text-dark-muted-foreground">
                {recipe.nutritionTips}
              </p>
            </div>
          )}

          {recipe.variations && (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-dark-card dark:border-dark-border">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-dark-foreground">
                變化建議
              </h3>
              <p className="leading-relaxed text-gray-700 dark:text-dark-muted-foreground">
                {recipe.variations}
              </p>
            </div>
          )}

          {recipe.funnyComment && (
            <div className="p-6 border border-yellow-200 rounded-lg shadow-sm bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 lg:col-span-2">
              <h3 className="flex items-center mb-3 text-lg font-semibold text-yellow-900 dark:text-yellow-300">
                😄 廚師評論
                {recipe.rating && (
                  <span className="flex items-center ml-3">
                    {[...Array(10)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < recipe.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill={i < recipe.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </span>
                )}
              </h3>
              <p className="italic leading-relaxed text-yellow-800 dark:text-yellow-200">
                {recipe.funnyComment}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 刪除確認彈窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg dark:bg-dark-card">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-dark-foreground">
              確認刪除食譜
            </h3>
            <p className="mb-6 text-gray-600 dark:text-dark-muted-foreground">
              您確定要刪除「{recipe.title}」嗎？此操作無法復原。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-md shadow-sm dark:border-dark-border dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-dark-accent"
              >
                取消
              </button>
              <button
                onClick={handleDeleteRecipe}
                className="px-4 py-2 text-white transition-colors bg-red-600 rounded-md shadow-sm hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
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