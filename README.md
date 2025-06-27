# AI 食譜創作大師 🍳✨

一個創新的智慧食譜生成工具，讓您只需輸入食材或烹飪概念，即可透過自選的 AI 模型（如 OpenAI, Google Gemini, OpenRouter）即時生成詳細食譜。所有生成的食譜將安全地儲存於您的瀏覽器本地（IndexedDB），讓您隨時查閱和管理。

## 專案簡介

「AI 食譜創作大師」旨在解決烹飪時的靈感匱乏問題。無論您是想將冰箱中的剩餘食材變廢為寶，還是想探索全新的菜餚組合，只需簡單輸入您的想法，AI 就能為您量身打造一份完整的食譜，包含精確的配料和詳盡的烹飪步驟。更棒的是，您可以自定義使用的 AI 服務及其 API Key，完全掌控您的生成體驗和成本！

## 核心功能

*   **智能食譜生成：** 根據使用者輸入的食材、菜系偏好、烹飪方式或任何創意概念，自動生成詳細食譜。
*   **自定義 AI 服務：** 支援 OpenAI、Google Gemini、OpenRouter 等多種 AI 服務，使用者可輸入自己的 API Key 和模型名稱。
*   **本地食譜儲存：** 所有生成的食譜自動儲存到瀏覽器的 IndexedDB 中，無需雲端資料庫，確保您的資料隱私。
*   **歷史記錄查閱：** 方便地瀏覽和管理所有歷史生成的食譜。
*   **直觀使用者介面：** 簡潔易用的介面，提供流暢的食譜生成和查閱體驗。

## 技術棧

### 前端 (Frontend)
*   **框架:** React 18
*   **構建工具:** Vite
*   **UI 庫:** Tailwind CSS
*   **路由:** React Router DOM
*   **本地儲存:** IndexedDB (透過 Dexie.js), localStorage (用於儲存 AI 設定)
*   **圖示:** Lucide React
*   **通知:** React Hot Toast

### AI 服務
*   **大型語言模型 (LLM):**
    *   OpenAI (GPT-3.5 Turbo, GPT-4 等)
    *   Google Gemini (gemini-pro 等)
    *   OpenRouter (提供多種模型，如 Mistral, Llama 等)

## 快速開始

請確保您的開發環境已安裝 Node.js (建議 v18+) 和 npm。

### 1. 取得專案程式碼

```bash
git clone <您的專案 GitHub URL>
cd ai-recipe-creator
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 啟動開發服務器

```bash
npm run dev
```

前端應用將在 `http://localhost:5173` 啟動。

### 4. 使用應用程式

1.  開啟您的瀏覽器，訪問 `http://localhost:5173`。
2.  點擊右上角「設定」進入設定頁面。
3.  選擇您偏好的 AI 服務提供商（OpenAI, Google Gemini, OpenRouter）。
4.  輸入您的 **個人 API Key** 和您想使用的 **模型名稱**。
5.  點擊「測試連接」確保配置正確。
6.  儲存設定。
7.  返回主頁面，在輸入框中輸入您想烹飪的食材或概念（例如：「雞胸肉、花椰菜、蒜頭，健康晚餐」）。
8.  點擊「生成食譜」按鈕。
9.  AI 將生成一份詳細食譜，並自動儲存到您的瀏覽器中。
10. 您可以透過「我的食譜」頁面查閱之前生成的所有食譜。

## 部署

本專案設計為可輕鬆部署到靜態網站托管平台：

### Netlify 部署

1. 將專案推送到 GitHub
2. 在 Netlify 中連接您的 GitHub 倉庫
3. 設定構建指令為 `npm run build`
4. 設定發布目錄為 `dist`
5. 部署即可

### Cloudflare Pages 部署

1. 將專案推送到 GitHub
2. 在 Cloudflare Pages 中連接您的 GitHub 倉庫
3. 設定構建指令為 `npm run build`
4. 設定構建輸出目錄為 `dist`
5. 部署即可

## API Key 取得指南

### OpenAI
1. 訪問 [OpenAI API Keys 頁面](https://platform.openai.com/api-keys)
2. 登入您的 OpenAI 帳戶
3. 點擊「Create new secret key」
4. 複製生成的 API Key

### Google Gemini
1. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登入您的 Google 帳戶
3. 點擊「Create API key」
4. 複製生成的 API Key

### OpenRouter
1. 在 [OpenRouter Keys 頁面](https://openrouter.ai/keys) 註冊帳戶
2. 點擊「Create Key」
3. 複製生成的 API Key

## 專案結構

```
ai-recipe-creator/
├── public/                   # 靜態資源
├── src/
│   ├── components/           # UI 組件
│   │   └── Layout.jsx        # 主要布局組件
│   ├── hooks/                # 自定義 React Hooks
│   │   ├── useRecipes.js     # 食譜管理 Hook
│   │   └── useSettings.js    # 設定管理 Hook
│   ├── pages/                # 頁面組件
│   │   ├── HomePage.jsx      # 首頁
│   │   ├── RecipesPage.jsx   # 食譜列表頁
│   │   ├── RecipeDetailPage.jsx # 食譜詳情頁
│   │   └── SettingsPage.jsx  # 設定頁
│   ├── utils/                # 工具函數
│   │   ├── database.js       # IndexedDB 操作
│   │   └── aiService.js      # AI API 服務
│   ├── App.jsx               # 主應用組件
│   ├── main.jsx              # 應用入口
│   └── index.css             # 全域樣式
├── index.html                # HTML 模板
├── package.json              # 依賴配置
├── vite.config.js            # Vite 配置
├── tailwind.config.js        # Tailwind 配置
├── netlify.toml              # Netlify 配置
└── README.md                 # 專案說明
```

## 功能截圖

### 主頁面
- 智能食譜生成介面
- 示例輸入建議
- 最新生成食譜預覽

### 食譜列表
- 所有食譜的卡片展示
- 搜索和篩選功能
- 標籤分類

### 食譜詳情
- 完整的食材清單
- 步驟式烹飪指導
- 進度追蹤功能

### 設定頁面
- AI 服務配置
- API Key 管理
- 連接測試功能

## 未來潛在功能 (Roadmap)

*   **食譜編輯功能：** 允許使用者編輯 AI 生成的食譜並儲存修改。
*   **食譜分享：** 方便地將生成的食譜分享給朋友或社交媒體。
*   **多語言支援：** 支援不同語言的食譜生成和介面。
*   **食材庫存管理：** 簡易的食材庫存功能，讓 AI 優先使用現有食材。
*   **營養分析：** 提供食譜的營養成分分析。
*   **單元測試與整合測試：** 確保程式碼的穩定性和可靠性。

## 貢獻指南

歡迎提交 Issue 和 Pull Request！

1. Fork 本專案
2. 創建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 授權

本專案採用 MIT 授權條款 - 查看 [LICENSE](LICENSE) 檔案了解詳情。

## 支援

如果您遇到任何問題或有建議，請：

1. 查看現有的 [Issues](issues)
2. 創建新的 Issue 描述您的問題
3. 加入我們的討論

---

**讓烹飪變得更簡單、更有趣！** 🍳✨