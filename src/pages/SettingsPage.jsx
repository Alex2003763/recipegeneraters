import React, { useState, useEffect } from 'react';
import {
  Settings,
  Key,
  Cpu,
  TestTube,
  Save,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Info,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../hooks/useSettings';
import { AI_CONFIGS } from '../utils/aiService';

const SettingsPage = () => {
  const {
    settings,
    loading,
    error,
    saveSetting,
    saveSettings,
    resetSettings,
    testAIConnection,
    isAIConfigured
  } = useSettings();

  const [formData, setFormData] = useState(settings);

  // 當 settings 變化時同步 formData
  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      ...settings
    }));
  }, [settings]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // 處理表單變更
  const handleInputChange = async (key, value) => {
    // 如果是 provider 改變，需要載入對應的 API key 和 model
    if (key === 'provider') {
      try {
        // 先更新 formData 中的 provider
        setFormData(prev => ({ ...prev, provider: value }));
        
        // 儲存新的 provider 並載入對應設定
        await saveSetting('provider', value);
        
        // 清除連接測試結果
        setConnectionTestResult(null);
        return;
      } catch (error) {
        console.error('切換服務商失敗:', error);
      }
    }
    
    // 一般的設定變更
    setFormData(prev => ({ ...prev, [key]: value }));
    // 清除連接測試結果
    setConnectionTestResult(null);
  };

  // 儲存設定
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await saveSettings(formData);
      toast.success('設定已儲存');
    } catch (error) {
      toast.error('儲存設定失敗');
    } finally {
      setIsSaving(false);
    }
  };

  // 重置設定
  const handleResetSettings = async () => {
    if (window.confirm('確定要重置所有設定嗎？此操作無法復原。')) {
      try {
        await resetSettings();
        setFormData(settings);
        setConnectionTestResult(null);
        toast.success('設定已重置');
      } catch (error) {
        toast.error('重置設定失敗');
      }
    }
  };

  // 測試 AI 連接
  const handleTestConnection = async () => {
    if (!formData.apiKey || !formData.provider) {
      toast.error('請先填寫 API Key 和選擇提供商');
      return;
    }

    setIsTestingConnection(true);
    setConnectionTestResult(null);

    try {
      // 先儲存當前設定
      await saveSettings(formData);
      
      // 測試連接
      const result = await testAIConnection();
      setConnectionTestResult(result);
      
      if (result.success) {
        toast.success('連接測試成功！');
      } else {
        toast.error(`連接測試失敗: ${result.message}`);
      }
    } catch (error) {
      setConnectionTestResult({ success: false, message: error.message });
      toast.error('連接測試失敗');
    } finally {
      setIsTestingConnection(false);
    }
  };
  // AI 提供商選項
  const providerOptions = [
    { value: 'gemini', label: 'Google Gemini', models: ['gemini-pro', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash'] },
    { value: 'openrouter', label: 'OpenRouter', models: ['deepseek/deepseek-chat-v3-0324:free', 'qwen/qwen3-235b-a22b:free'] }
  ];

  const currentProvider = providerOptions.find(p => p.value === formData.provider);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-foreground flex items-center">
          <Settings className="h-8 w-8 mr-3" />
          設定
        </h1>
        <p className="text-gray-600 dark:text-dark-muted-foreground mt-2">
          配置您的 AI 服務和應用程式偏好設定
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* AI 服務設定 */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
        <div className="flex items-center mb-6">
          <Cpu className="h-6 w-6 text-primary-600 dark:text-dark-primary mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-foreground">AI 服務設定</h2>
        </div>

        <div className="space-y-6">
          {/* AI 提供商選擇 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-foreground mb-2">
              AI 服務提供商
            </label>
            <select
              value={formData.provider}
              onChange={(e) => handleInputChange('provider', e.target.value)}
              className="input w-full dark:bg-dark-input dark:border-dark-border"
            >
              <option value="">請選擇提供商</option>
              {providerOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-dark-muted-foreground mt-1">
              選擇您要使用的 AI 服務提供商
            </p>
          </div>

          {/* API Key 輸入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-foreground mb-2">
              API Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-dark-muted-foreground" />
              <input
                type={showApiKey ? "text" : "password"}
                value={formData.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                placeholder="輸入您的 API Key"
                className="input pl-10 pr-10 w-full dark:bg-dark-input dark:border-dark-border"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-muted-foreground hover:text-gray-600 dark:hover:text-dark-foreground transition-colors"
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-dark-muted-foreground mt-1">
              您的 API Key 將安全地存儲在瀏覽器本地，不會上傳到任何服務器
            </p>
          </div>

          {/* 模型選擇 */}
          {currentProvider && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-foreground mb-2">
                模型選擇
              </label>
              <select
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className="input w-full dark:bg-dark-input dark:border-dark-border"
              >
                {currentProvider.models.map(model => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-dark-muted-foreground mt-1">
                選擇要使用的具體模型
              </p>
            </div>
          )}

          {/* 進階設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                創意度 (Temperature)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>保守 (0)</span>
                <span className="font-medium">{formData.temperature}</span>
                <span>創意 (1)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大回應長度
              </label>
              <input
                type="number"
                min="500"
                max="4000"
                step="100"
                value={formData.maxTokens}
                onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
                className="input w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                控制 AI 回應的最大長度
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 連接測試和操作 */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-foreground">操作</h3>
          
          {/* 連接狀態指示器 */}
          {connectionTestResult && (
            <div className={`flex items-center text-sm ${
              connectionTestResult.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {connectionTestResult.success ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  連接正常
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-1" />
                  連接失敗
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleTestConnection}
            disabled={isTestingConnection || !formData.apiKey || !formData.provider}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-dark-secondary dark:text-dark-secondary-foreground dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTestingConnection ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                測試中...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                測試連接
              </>
            )}
          </button>

          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-dark-primary dark:text-dark-primary-foreground dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                儲存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                儲存設定
              </>
            )}
          </button>

          <button
            onClick={handleResetSettings}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-red-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-dark-card dark:border-dark-border dark:text-red-500 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重置設定
          </button>
        </div>
      </div>

      {/* API Key 取得指南 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
              如何取得 API Key？
            </h3>
            <div className="space极客时间 极客时间
-y-3 text-sm text-blue-800 dark:text-blue-200">
              <div>
                <strong>Google Gemini:</strong>
                <p>前往 <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline inline-flex items-center text-blue-800 dark:text-blue-200">
                  Google AI Studio <ExternalLink className="h-3 w-3 ml-1" />
                </a> 取得 API Key</p>
              </div>
              <div>
                <strong>OpenRouter:</strong>
                <p>在 <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline inline-flex items-center text-blue-800 dark:text-blue-200">
                  OpenRouter Keys 頁面 <ExternalLink className="h-3 w-3 ml-1" />
                </a> 生成 API Key（支援免費模型）</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 當前配置狀態 */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-foreground mb-4">當前配置狀態</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-dark-muted-foreground">AI 提供商：</span>
            <span className="font-medium ml-2 text-gray-900 dark:text-dark-foreground">
              {formData.provider ? providerOptions.find(p => p.value === formData.provider)?.label : '未設定'}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-dark-muted-foreground">模型：</span>
            <span className="font-medium ml-2 text-gray-900 dark:text-dark-foreground">{formData.model || '未設定'}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-dark-muted-foreground">API Key：</span>
            <span className="font-medium ml-2 text-gray-900 dark:text-dark-foreground">
              {formData.apiKey ? '已設定 ✓' : '未設定'}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-dark-muted-foreground">配置狀態：</span>
            <span className={`font-medium ml-2 ${isAIConfigured() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isAIConfigured() ? '完整配置 ✓' : '未完成配置'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;