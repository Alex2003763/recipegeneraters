import { useState, useEffect, useCallback } from 'react';
import { settingsService, DEFAULT_AI_SETTINGS } from '../utils/database';
import { aiService } from '../utils/aiService';

export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_AI_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 載入設定
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const savedSettings = await settingsService.getAllSettings();
      
      // 處理帶有 provider 前綴的設定
      const processedSettings = { ...DEFAULT_AI_SETTINGS };
      
      for (const [key, value] of Object.entries(savedSettings)) {
        if (key.includes('_apiKey') || key.includes('_model')) {
          // 跳過帶前綴的設定，稍後處理
          continue;
        }
        processedSettings[key] = value;
      }
      
      // 如果有 provider，載入對應的 apiKey 和 model
      if (processedSettings.provider) {
        const providerApiKey = savedSettings[`${processedSettings.provider}_apiKey`];
        const providerModel = savedSettings[`${processedSettings.provider}_model`];
        
        if (providerApiKey) processedSettings.apiKey = providerApiKey;
        if (providerModel) processedSettings.model = providerModel;
      }
      
      setSettings(processedSettings);
      
      // 如果有 API 設定，初始化 AI 服務
      if (processedSettings.apiKey && processedSettings.provider) {
        aiService.setConfig(
          processedSettings.provider,
          processedSettings.apiKey,
          processedSettings.model
        );
      }
    } catch (err) {
      setError('載入設定失敗: ' + err.message);
      console.error('載入設定錯誤:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 儲存單個設定
  const saveSetting = useCallback(async (key, value) => {
    try {
      // 如果是 provider 改變，需要載入對應的 API key 和 model
      if (key === 'provider') {
        // 先儲存新的 provider
        await settingsService.saveSetting('provider', value);
        
        // 載入新 provider 對應的 API key 和 model
        const savedSettings = await settingsService.getAllSettings();
        const newApiKey = savedSettings[`${value}_apiKey`] || '';
        let newModel = savedSettings[`${value}_model`] || '';
        
        // 如果沒有保存的模型，使用預設模型
        if (!newModel && value) {
          const { AI_CONFIGS } = await import('../utils/aiService');
          newModel = AI_CONFIGS[value]?.defaultModel || '';
          
          // 儲存預設模型
          if (newModel) {
            await settingsService.saveSetting(`${value}_model`, newModel);
          }
        }
        
        const updatedSettings = {
          ...settings,
          provider: value,
          apiKey: newApiKey,
          model: newModel
        };
        
        setSettings(updatedSettings);
        
        // 如果有完整設定，初始化 AI 服務
        if (newApiKey && value) {
          aiService.setConfig(value, newApiKey, newModel);
        }
        
        return;
      }
      
      // 如果是 apiKey 或 model，使用 provider 前綴
      let storageKey = key;
      if (key === 'apiKey' && settings.provider) {
        storageKey = `${settings.provider}_apiKey`;
      } else if (key === 'model' && settings.provider) {
        storageKey = `${settings.provider}_model`;
      }
      
      await settingsService.saveSetting(storageKey, value);
      setSettings(prev => ({ ...prev, [key]: value }));
      
      // 如果是 AI 相關設定，更新 AI 服務配置
      if (['provider', 'apiKey', 'model'].includes(key)) {
        const updatedSettings = { ...settings, [key]: value };
        if (updatedSettings.apiKey && updatedSettings.provider) {
          aiService.setConfig(
            updatedSettings.provider,
            updatedSettings.apiKey,
            updatedSettings.model
          );
        }
      }
    } catch (err) {
      setError('儲存設定失敗: ' + err.message);
      throw err;
    }
  }, [settings]);

  // 儲存多個設定
  const saveSettings = useCallback(async (newSettings) => {
    try {
      setError(null);
      
      // 逐一儲存設定
      for (const [key, value] of Object.entries(newSettings)) {
        // 如果是 apiKey 或 model，使用 provider 前綴
        let storageKey = key;
        if (key === 'apiKey' && newSettings.provider) {
          storageKey = `${newSettings.provider}_apiKey`;
        } else if (key === 'model' && newSettings.provider) {
          storageKey = `${newSettings.provider}_model`;
        }
        
        await settingsService.saveSetting(storageKey, value);
      }
      
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      
      // 更新 AI 服務配置
      if (updatedSettings.apiKey && updatedSettings.provider) {
        aiService.setConfig(
          updatedSettings.provider,
          updatedSettings.apiKey,
          updatedSettings.model
        );
      }
    } catch (err) {
      setError('儲存設定失敗: ' + err.message);
      throw err;
    }
  }, [settings]);

  // 重置設定
  const resetSettings = useCallback(async () => {
    try {
      await settingsService.clearAllSettings();
      setSettings(DEFAULT_AI_SETTINGS);
      // 清除 AI 服務配置
      aiService.currentConfig = null;
    } catch (err) {
      setError('重置設定失敗: ' + err.message);
      throw err;
    }
  }, []);

  // 測試 AI 連接
  const testAIConnection = useCallback(async () => {
    try {
      if (!settings.apiKey || !settings.provider) {
        throw new Error('請先設定 API Key 和提供商');
      }
      
      return await aiService.testConnection();
    } catch (err) {
      setError('測試連接失敗: ' + err.message);
      return { success: false, message: err.message };
    }
  }, [settings]);

  // 獲取特定設定
  const getSetting = useCallback((key) => {
    return settings[key];
  }, [settings]);

  // 檢查是否已配置 AI
  const isAIConfigured = useCallback(() => {
    return !!(settings.apiKey && settings.provider);
  }, [settings]);

  // 初始載入
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    saveSetting,
    saveSettings,
    resetSettings,
    getSetting,
    isAIConfigured,
    testAIConnection,
    refreshSettings: loadSettings
  };
};

export default useSettings;