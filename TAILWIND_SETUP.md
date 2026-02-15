# Tailwind CSS 设置文档

## 1. 文件结构

```
project-root/
├── postcss.config.js      # PostCSS 配置文件
├── tailwind.config.js     # Tailwind CSS 配置文件
├── src/
│   └── assets/
│       └── styles/
│           └── main.css   # 主 CSS 文件
└── package.json           # 项目依赖
```

## 2. 配置文件详解

### 2.1 postcss.config.js

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},      // Tailwind CSS 插件
    autoprefixer: {},     // 自动添加浏览器前缀
  },
}
```

**功能**：
- `tailwindcss`: 处理 Tailwind CSS 指令（@tailwind）
- `autoprefixer`: 自动添加浏览器前缀，确保跨浏览器兼容性

### 2.2 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
          light: '#93c5fd'
        },
        secondary: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#6ee7b7'
        }
      },
      animation: {
        'dice-roll': 'diceRoll 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      },
      keyframes: {
        diceRoll: {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
          '20%': { transform: 'rotateX(360deg) rotateY(180deg)' },
          '40%': { transform: 'rotateX(720deg) rotateY(360deg)' },
          '60%': { transform: 'rotateX(1080deg) rotateY(540deg)' },
          '80%': { transform: 'rotateX(1440deg) rotateY(720deg)' },
          '100%': { transform: 'rotateX(1800deg) rotateY(900deg)' }
        }
      }
    },
  },
  plugins: [],
}
```

**功能**：
- `content`: 指定 Tailwind 应该扫描的文件，以发现和生成用到的类
- `theme.extend`: 扩展默认主题，添加自定义颜色和动画
- `plugins`: 可添加 Tailwind 插件（目前为空）

### 2.3 src/assets/styles/main.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定义样式 */
:root {
  --primary-color: #3b82f6;
  --primary-dark: #1d4ed8;
  /* ... 其他 CSS 变量 ... */
}

/* ... 其他自定义样式 ... */
```

**功能**：
- `@tailwind base`: 注入 Tailwind 的基础样式（预飞行样式）
- `@tailwind components`: 注入组件类
- `@tailwind utilities`: 注入实用程序类
- 自定义 CSS 变量和样式

## 3. 依赖管理

### 3.1 package.json 相关依赖

```json
{
  "dependencies": {
    "tailwindcss": "^3.4.3"  // Tailwind CSS 核心包
  },
  "devDependencies": {
    "autoprefixer": "^10.4.19"  // 自动前缀器
  }
}
```

### 3.2 安装依赖

如果尚未安装，运行：

```bash
npm install tailwindcss autoprefixer --save-dev
```

## 4. Vite 集成

Vite 自动处理 PostCSS 配置。当存在 `postcss.config.js` 文件时，Vite 会自动应用 PostCSS 插件。

### 4.1 vite.config.ts

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // Vite 会自动处理 PostCSS
  plugins: [vue()],
  // ... 其他配置
});
```

## 5. 使用方法

### 5.1 在 Vue 组件中使用

```vue
<template>
  <div class="bg-blue-500 text-white p-4 rounded-lg">
    这是一个 Tailwind 样式的 div
  </div>
</template>
```

### 5.2 响应式布局

```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- 在小屏幕上单列，中等屏幕上双列，大屏幕上三列 -->
  </div>
</template>
```

### 5.3 自定义颜色

```vue
<template>
  <button class="bg-primary text-white px-4 py-2 rounded">
    使用自定义主题颜色
  </button>
</template>
```

## 6. 常见问题解决

### 6.1 Tailwind 样式不生效

**检查项**：
1. 确认 `postcss.config.js` 文件存在且配置正确
2. 确认 `tailwind.config.js` 中的 `content` 路径正确
3. 确认 `main.css` 中包含 `@tailwind` 指令
4. 确认 `main.css` 被正确导入到项目中（在 `src/main.ts` 中）

**解决方案**：
- 重新安装依赖：`npm install`
- 清除缓存：`npm run dev -- --force`
- 检查控制台是否有错误信息

### 6.2 自定义样式被覆盖

**解决方案**：
- 使用 `!important`（不推荐）
- 确保自定义样式在 Tailwind 之后导入
- 使用更具体的选择器

### 6.3 生产环境样式丢失

**解决方案**：
- 确保所有使用到的类都在 `content` 指定的文件中
- 检查生产构建日志
- 使用 `safelist` 在 `tailwind.config.js` 中保留特定类

## 7. 优化建议

### 7.1 减少构建大小

```javascript
// tailwind.config.js
module.exports = {
  // ...
  safelist: [
    'bg-red-500',
    'text-3xl',
    // 其他必须保留的类
  ]
}
```

### 7.2 使用 JIT 模式

Tailwind CSS v3+ 默认使用 JIT（Just-In-Time）编译器，无需额外配置。

### 7.3 组件化样式

```vue
<!-- 创建可复用的样式组件 -->
<template>
  <button class="btn-primary">
    提交
  </button>
</template>

<style>
.btn-primary {
  @apply bg-primary text-white px-4 py-2 rounded-lg;
}
</style>
```

## 8. 参考资料

- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [Vite 官方文档](https://vitejs.dev/)
- [PostCSS 官方文档](https://postcss.org/)

## 9. 部署注意事项

1. 确保所有依赖都在 `package.json` 中正确列出
2. 运行 `npm install --production` 确保生产环境依赖完整
3. 检查构建输出是否包含 Tailwind 样式
4. 测试不同浏览器的兼容性

## 10. 更新日志

- 2024-01-21: 初始 Tailwind CSS 设置文档
- 2024-01-21: 添加 PostCSS 配置
- 2024-01-21: 添加 autoprefixer 支持

此文档提供了完整的 Tailwind CSS 设置指南，适用于基于 Vite 的 Vue 3 项目。