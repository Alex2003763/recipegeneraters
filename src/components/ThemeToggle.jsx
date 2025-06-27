import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-lg
        bg-gray-100 hover:bg-gray-200 
        dark:bg-gray-800 dark:hover:bg-gray-700
        text-gray-600 dark:text-gray-300
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900
        group
        ${className}
      `}
      title={isDark ? '切換到淺色模式' : '切換到深色模式'}
      aria-label={isDark ? '切換到淺色模式' : '切換到深色模式'}
    >
      <div className="relative w-5 h-5">
        {/* 太陽圖標 */}
        <Sun 
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out
            ${isDark 
              ? 'opacity-0 rotate-90 scale-75' 
              : 'opacity-100 rotate-0 scale-100'
            }
          `}
        />
        
        {/* 月亮圖標 */}
        <Moon 
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out
            ${isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-75'
            }
          `}
        />
      </div>
      
      {/* Hover 效果 */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
    </button>
  );
};

export default ThemeToggle;