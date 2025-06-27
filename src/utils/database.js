import Dexie from 'dexie';

// 定義數據庫結構
class RecipeDatabase extends Dexie {
  constructor() {
    super('RecipeCreatorDB');
    
    this.version(1).stores({
      recipes: '++id, title, ingredients, instructions, createdAt, updatedAt, tags, servings, cookingTime, difficulty, funnyComment',
      settings: 'key, value, updatedAt'
    });
  }
}

// 創建數據庫實例
export const db = new RecipeDatabase();

// 食譜相關操作
export const recipeService = {
  // 添加新食譜
  async addRecipe(recipe) {
    const now = new Date();
    const recipeWithTimestamp = {
      ...recipe,
      createdAt: now,
      updatedAt: now,
      id: undefined // 讓 Dexie 自動生成 ID
    };
    
    return await db.recipes.add(recipeWithTimestamp);
  },

  // 獲取所有食譜
  async getAllRecipes() {
    return await db.recipes.orderBy('createdAt').reverse().toArray();
  },

  // 根據 ID 獲取食譜
  async getRecipeById(id) {
    return await db.recipes.get(id);
  },

  // 更新食譜
  async updateRecipe(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    
    return await db.recipes.update(id, updateData);
  },

  // 刪除食譜
  async deleteRecipe(id) {
    return await db.recipes.delete(id);
  },

  // 搜索食譜
  async searchRecipes(query) {
    const lowercaseQuery = query.toLowerCase();
    
    return await db.recipes
      .filter(recipe => 
        recipe.title.toLowerCase().includes(lowercaseQuery) ||
        recipe.ingredients.some(ingredient =>
          (typeof ingredient === 'string' ? ingredient : ingredient.name || '').toLowerCase().includes(lowercaseQuery)
        ) ||
        (recipe.tags && recipe.tags.some(tag => 
          tag.toLowerCase().includes(lowercaseQuery)
        ))
      )
      .toArray();
  },

  // 根據標籤獲取食譜
  async getRecipesByTag(tag) {
    return await db.recipes
      .filter(recipe => recipe.tags && recipe.tags.includes(tag))
      .toArray();
  },

  // 獲取食譜統計
  async getRecipeStats() {
    const totalRecipes = await db.recipes.count();
    const recipes = await db.recipes.toArray();
    
    const allTags = recipes.flatMap(recipe => recipe.tags || []);
    const uniqueTags = [...new Set(allTags)];
    
    return {
      totalRecipes,
      totalTags: uniqueTags.length,
      popularTags: this.getPopularTags(allTags)
    };
  },

  // 獲取熱門標籤
  getPopularTags(allTags) {
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
  }
};

// 設定相關操作
export const settingsService = {
  // 儲存設定
  async saveSetting(key, value) {
    const setting = {
      key,
      value,
      updatedAt: new Date()
    };
    
    return await db.settings.put(setting);
  },

  // 獲取設定
  async getSetting(key) {
    const setting = await db.settings.get(key);
    return setting ? setting.value : null;
  },

  // 獲取所有設定
  async getAllSettings() {
    const settings = await db.settings.toArray();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  },

  // 刪除設定
  async deleteSetting(key) {
    return await db.settings.delete(key);
  },

  // 清除所有設定
  async clearAllSettings() {
    return await db.settings.clear();
  }
};

// AI 設定的預設值
export const DEFAULT_AI_SETTINGS = {
  provider: '', // 'openai', 'gemini', 'openrouter'
  apiKey: '',
  model: '',
  temperature: 0.7,
  maxTokens: 1000
};

// 導出數據庫實例和服務
export default db;