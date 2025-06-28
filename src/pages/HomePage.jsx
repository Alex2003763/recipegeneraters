import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles,
  Clock,
  Users,
  ChefHat,
  Loader2,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import { aiService } from '../utils/aiService';
import { useRecipes } from '../hooks/useRecipes';
import { useSettings } from '../hooks/useSettings';

const HomePage = () => {
  const navigate = useNavigate();
  const { addRecipe } = useRecipes();
  const { isAIConfigured } = useSettings();
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedRecipe, setLastGeneratedRecipe] = useState(null);

  // 處理食譜生成
  const handleGenerateRecipe = async () => {
    if (!input.trim()) {
      toast.error('請輸入您想要的食材或料理概念');
      return;
    }

    if (!isAIConfigured()) {
      toast.error('請先在設定頁面配置 AI 服務');
      navigate('/settings');
      return;
    }

    setIsGenerating(true);
    
    try {
      // 調用 AI 生成食譜
      const recipe = await aiService.generateRecipe(input);
      
      // 保存到數據庫
      const recipeId = await addRecipe(recipe);
      
      // 設置最後生成的食譜
      setLastGeneratedRecipe({ ...recipe, id: recipeId });
      
      toast.success('食譜生成成功！');
      setInput(''); // 清空輸入框
      
    } catch (error) {
      console.error('生成食譜失敗:', error);
      toast.error(error.message || '生成食譜時發生錯誤，請稍後再試');
    } finally {
      setIsGenerating(false);
    }
  };

  // 查看食譜詳情
  const viewRecipeDetail = () => {
    if (lastGeneratedRecipe) {
      navigate(`/recipe/${lastGeneratedRecipe.id}`);
    }
  };

  // 示例輸入建議
  const exampleInputs = [
    '雞胸肉、花椰菜、蒜頭，健康晚餐',
    '義大利麵、番茄、起司，30分鐘內完成',
    '豆腐、青菜、薑絲，素食料理',
    '牛肉、洋蔥、馬鈴薯，家常菜',
    '鮭魚、檸檬、蘆筍，低卡料理'
  ];

  return (
    <div className="space-y-8">
      {/* 歡迎標題 */}
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-dark-foreground">
          歡迎使用 AI 食譜創作大師 🍳
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-dark-muted-foreground">
          只需輸入您的食材或料理想法，AI 將為您量身打造完美的食譜
        </p>
      </div>

      {/* AI 配置提醒 */}
      {!isAIConfigured() && (
        <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
            <p className="text-yellow-800 dark:text-yellow-200">
              請先到{' '}
              <button
                onClick={() => navigate('/settings')}
                className="font-medium text-yellow-900 underline dark:text-yellow-300 hover:no-underline"
              >
                設定頁面
              </button>
              {' '}配置您的 AI 服務設定
            </p>
          </div>
        </div>
      )}

      {/* 主要輸入區域 */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-dark-card dark:border-dark-border">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-foreground">
            告訴我您想要什麼樣的料理：
          </label>
          
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="例如：雞胸肉、花椰菜、蒜頭，想做健康的晚餐..."
              className="textarea w-full min-h-[120px] resize-none dark:bg-dark-input dark:border-dark-border"
              disabled={isGenerating}
            />
            
            {/* 字數統計 */}
            <div className="absolute text-xs text-gray-400 bottom-2 right-2 dark:text-dark-muted-foreground">
              {input.length}/500
            </div>
          </div>

          {/* 生成按鈕 */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerateRecipe}
              disabled={isGenerating || !input.trim() || !isAIConfigured()}
              className="px-8 py-3 text-lg btn-primary dark:bg-dark-primary dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin dark:text-dark-primary-foreground" />
                  正在生成食譜...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2 dark:text-dark-primary-foreground" />
                  生成食譜
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 示例輸入建議 */}
      <div className="p-6 rounded-lg bg-gray-50 dark:bg-dark-card">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-dark-foreground">💡 試試這些例子：</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {exampleInputs.map((example, index) => (
            <button
              key={index}
              onClick={() => setInput(example)}
              className="p-3 text-sm text-left transition-colors bg-white border border-gray-200 rounded-md dark:bg-dark-input dark:border-dark-border hover:border-primary-300 dark:hover:border-dark-primary hover:bg-primary-50 dark:hover:bg-dark-accent dark:text-dark-foreground"
              disabled={isGenerating}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* 最近生成的食譜預覽 */}
      {lastGeneratedRecipe && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-dark-card dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-foreground">🎉 最新生成的食譜</h3>
          <button
            onClick={viewRecipeDetail}
            className="btn-primary inline-flex items-center px-5 py-2.5 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            查看完整食譜
          </button>
          </div>
          
          <div className="pl-4 border-l-4 border-primary-500 dark:border-dark-primary">
            <h4 className="mb-2 font-medium text-gray-900 dark:text-dark-foreground">
              {lastGeneratedRecipe.title}
            </h4>
            <p className="mb-3 text-sm text-gray-600 dark:text-dark-muted-foreground">
              {lastGeneratedRecipe.description}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-dark-muted-foreground">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {lastGeneratedRecipe.cookingTime}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {lastGeneratedRecipe.servings} 人份
              </div>
              <div className="flex items-center">
                <ChefHat className="w-4 h-4 mr-1" />
                {lastGeneratedRecipe.difficulty}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 功能特色介紹 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-dark-card dark:border-dark-border">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-lg bg-primary-100 dark:bg-dark-accent">
            <Sparkles className="w-6 h-6 text-primary-600 dark:text-dark-primary" />
          </div>
          <h3 className="mb-2 font-medium text-gray-900 dark:text-dark-foreground">智能生成</h3>
          <p className="text-sm text-gray-600 dark:text-dark-muted-foreground">
            輸入任何食材或概念，AI 立即為您創作專屬食譜
          </p>
        </div>

        <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-dark-card dark:border-dark-border">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-lg bg-secondary-100 dark:bg-dark-secondary">
            <BookOpen className="w-6 h-6 text-secondary-600 dark:text-dark-secondary-foreground" />
          </div>
          <h3 className="mb-2 font-medium text-gray-900 dark:text-dark-foreground">本地儲存</h3>
          <p className="text-sm text-gray-600 dark:text-dark-muted-foreground">
            所有食譜安全存儲在您的瀏覽器中，隱私有保障
          </p>
        </div>

        <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-dark-card dark:border-dark-border">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-lg dark:bg-yellow-900/20">
            <ChefHat className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="mb-2 font-medium text-gray-900 dark:text-dark-foreground">專業品質</h3>
          <p className="text-sm text-gray-600 dark:text-dark-muted-foreground">
            詳細的步驟說明和營養建議，如同專業廚師指導
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;