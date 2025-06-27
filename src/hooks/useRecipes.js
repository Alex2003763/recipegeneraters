import { useState, useEffect, useCallback } from 'react';
import { recipeService } from '../utils/database';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 載入所有食譜
  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allRecipes = await recipeService.getAllRecipes();
      setRecipes(allRecipes);
    } catch (err) {
      setError('載入食譜失敗: ' + err.message);
      console.error('載入食譜錯誤:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 添加新食譜
  const addRecipe = useCallback(async (recipe) => {
    try {
      const id = await recipeService.addRecipe(recipe);
      const newRecipe = await recipeService.getRecipeById(id);
      setRecipes(prev => [newRecipe, ...prev]);
      return id;
    } catch (err) {
      setError('添加食譜失敗: ' + err.message);
      throw err;
    }
  }, []);

  // 更新食譜
  const updateRecipe = useCallback(async (id, updates) => {
    try {
      await recipeService.updateRecipe(id, updates);
      const updatedRecipe = await recipeService.getRecipeById(id);
      setRecipes(prev => prev.map(recipe => 
        recipe.id === id ? updatedRecipe : recipe
      ));
    } catch (err) {
      setError('更新食譜失敗: ' + err.message);
      throw err;
    }
  }, []);

  // 刪除食譜
  const deleteRecipe = useCallback(async (id) => {
    try {
      await recipeService.deleteRecipe(id);
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err) {
      setError('刪除食譜失敗: ' + err.message);
      throw err;
    }
  }, []);

  // 搜索食譜
  const searchRecipes = useCallback(async (query) => {
    try {
      setLoading(true);
      const results = await recipeService.searchRecipes(query);
      setRecipes(results);
    } catch (err) {
      setError('搜索食譜失敗: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始載入
  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  return {
    recipes,
    loading,
    error,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    refreshRecipes: loadRecipes
  };
};

export default useRecipes;