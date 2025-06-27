import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChefHat, 
  Home, 
  BookOpen, 
  Settings, 
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '../hooks/useTheme';


const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  const navigation = [
    { name: '首頁', href: '/', icon: Home },
    { name: '我的食譜', href: '/recipes', icon: BookOpen },
    { name: '設定', href: '/settings', icon: Settings },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen transition-colors duration-200">
      {/* 頂部導航欄 */}
      <nav className="bg-white dark:bg-dark-card shadow-sm border-b border-gray-200 dark:border-dark-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo 和標題 */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <ChefHat className="h-8 w-8 text-primary-600 dark:text-dark-primary" />
                <span className="text-xl font-bold text-gray-900 dark:text-dark-foreground transition-colors duration-200">
                  AI 食譜創作大師
                </span>
              </Link>
            </div>

            {/* 桌面導航 */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-primary-600 bg-primary-50 dark:text-dark-primary dark:bg-dark-accent'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-dark-muted-foreground dark:hover:text-dark-foreground dark:hover:bg-dark-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* 主題切換按鈕 */}
              <div className="ml-4 pl-4 border-l border-gray-200 dark:border-dark-border">
                <ThemeToggle />
              </div>
            </div>

            {/* 移動端菜單按鈕 */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-dark-muted-foreground dark:hover:text-dark-foreground dark:hover:bg-dark-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-dark-ring transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
{/* 移動端導航菜單 */}
{isMobileMenuOpen && (
  <div className="md:hidden">
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border transition-colors">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive(item.href)
                ? 'text-primary-600 bg-primary-50 dark:text-dark-primary dark:bg-dark-accent'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-dark-muted-foreground dark:hover:text-dark-foreground dark:hover:bg-dark-accent'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  </div>
)}
      </nav>

      {/* 主要內容區域 */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* 頁腳 */}
      <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500 dark:text-dark-muted-foreground">
            <p>© 2024 AI 食譜創作大師. 讓烹飪變得更簡單、更有趣！</p>
            <p className="mt-1">
              由 AI 驅動 • 數據存儲在您的瀏覽器本地 • 隱私安全
            </p>
          </div>
        </div>
      </footer>
    {/* Toast 通知 */}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: theme === 'dark' ? '#2a2a2a' : '#fff',
          color: theme === 'dark' ? '#ffffff' : '#363636',
        },
        success: {
          duration: 3000,
          theme: {
            primary: '#22c55e',
            secondary: '#ffffff',
          },
        },
        error: {
          duration: 5000,
          theme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
    </div>
  );
};

export default Layout;