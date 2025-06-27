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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-foreground mb-4">
          歡迎使用 AI 食譜創作大師 🍳
        </h1>
        <p className="text-xl text-gray-600 dark:text-dark-muted-foreground max-w-2xl mx-auto">
          只需輸入您的食材或料理想法，AI 將為您量身打造完美的食譜
        </p>
      </div>

      {/* AI 配置提醒 */}
      {!isAIConfigured() && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <p className="text-yellow-800 dark:text-yellow-200">
              請先到{' '}
              <button
                onClick={() => navigate('/settings')}
                className="font-medium text-yellow-900 dark:text-yellow-300 underline hover:no-underline"
              >
                設定頁面
              </button>
              {' '}配置您的 AI 服務設定
            </p>
          </div>
        </div>
      )}

      {/* 主要輸入區域 */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
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
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-dark-muted-foreground">
              {input.length}/500
            </div>
          </div>

          {/* 生成按鈕 */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerateRecipe}
              disabled={isGenerating || !input.trim() || !isAIConfigured()}
              className="btn-primary dark:bg-dark-primary dark:hover:bg-primary-600 px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2 dark:text-dark-primary-foreground" />
                  正在生成食譜...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2 dark:text-dark-primary-foreground" />
                  生成食譜
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 示例輸入建議 */}
      <div className="bg-gray-50 dark:bg-dark-card rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-foreground mb-4">💡 試試這些例子：</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {exampleInputs.map((example, index) => (
            <button
              key={index}
              onClick={() => setInput(example)}
              className="text-left p-3 bg-white dark:bg-dark-input rounded-md border border-gray-200 dark:border-dark-border hover:border-primary-300 dark:hover:border-dark-primary hover:bg-primary-50 dark:hover:bg-dark-accent transition-colors text-sm dark:text-dark-foreground"
              disabled={isGenerating}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* 最近生成的食譜預覽 */}
      {lastGeneratedRecipe && (
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-foreground">🎉 最新生成的食譜</h3>
            <button
              onClick={viewRecipeDetail}
              className="btn-primary dark:bg-dark-primary dark:hover:bg-primary-600 text-sm"
            >
              查看完整食譜
            </button>
          </div>
          
          <div className="border-l-4 border-primary-500 dark:border-dark-primary pl-4">
            <h4 className="font-medium text-gray-900 dark:text-dark-foreground mb-2">
              {lastGeneratedRecipe.title}
            </h4>
            <p className="text-gray-600 dark:text-dark-muted-foreground text-sm mb-3">
              {lastGeneratedRecipe.description}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-dark-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {lastGeneratedRecipe.cookingTime}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {lastGeneratedRecipe.servings} 人份
              </div>
              <div className="flex items-center">
                <ChefHat className="h-4 w-4 mr-1" />
                {lastGeneratedRecipe.difficulty}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 功能特色介紹 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
          <div className="w-12 h-12 bg-primary-100 dark:bg-dark-accent rounded-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-primary-600 dark:text-dark-primary" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-dark-foreground mb-2">智能生成</h3>
          <p className="text-sm text-gray-600 dark:text-dark-muted-foreground">
            輸入任何食材或概念，AI 立即為您創作專屬食譜
          </p>
        </div>

        <div className="text-center p-6 bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
          <div className="w-12 h-12 bg-secondary-100 dark:bg-dark-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-6 w-6 text-secondary-600 dark:text-dark-secondary-foreground" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-dark-foreground mb-2">本地儲存</h3>
          <p className="text-sm text-gray-600 dark:text-dark-muted-foreground">
            所有食譜安全存儲在您的瀏覽器中，隱私有保障
          </p>
        </div>

        <div className="text-center p-6 bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ChefHat className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-dark-foreground mb-2">專業品質</h3>
          <p className="text-sm text-gray-600 dark:text-dark-muted-foreground">
            詳細的步驟說明和營養建議，如同專業廚師指導
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;