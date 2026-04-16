# 表情包裁剪工具 - UI 规格书

## 1. 设计系统概述

### 1.1 设计理念

**「创意工作室」**风格——为表情包创作者打造的温暖、专业、富有创造力的工具界面。

### 1.2 设计关键词

- 温暖友好
- 专业可靠
- 创意灵感
- 简洁高效

---

## 2. 色彩系统

### 2.1 主色调

| 名称 | 色值 | 用途 |
|------|------|------|
| **Primary-50** | `#FFF7ED` | 最浅背景、高亮区域 |
| **Primary-100** | `#FFEDD5` | 浅色背景、悬停状态 |
| **Primary-200** | `#FED7AA` | 边框、分隔线 |
| **Primary-300** | `#FDBA74` | 次要元素 |
| **Primary-400** | `#FB923C` | 图标、装饰 |
| **Primary-500** | `#F97316` | **主色**、按钮、重点 |
| **Primary-600** | `#EA580C` | 悬停状态 |
| **Primary-700** | `#C2410C` | 按下状态 |
| **Primary-800** | `#9A3412` | 深色文字 |
| **Primary-900** | `#7C2D12` | 标题文字 |

### 2.2 中性色

| 名称 | 色值 | 用途 |
|------|------|------|
| **Gray-50** | `#F9FAFB` | 页面背景 |
| **Gray-100** | `#F3F4F6` | 卡片背景 |
| **Gray-200** | `#E5E7EB` | 边框、分隔线 |
| **Gray-300** | `#D1D5DB` | 禁用状态边框 |
| **Gray-400** | `#9CA3AF` | 次要文字、占位符 |
| **Gray-500** | `#6B7280` | 正文文字 |
| **Gray-600** | `#4B5563` | 强调文字 |
| **Gray-700** | `#374151` | 标题文字 |
| **Gray-800** | `#1F2937` | 深色标题 |
| **Gray-900** | `#111827` | 主标题 |

### 2.3 功能色

| 名称 | 色值 | 用途 |
|------|------|------|
| **Success-50** | `#F0FDF4` | 成功背景 |
| **Success-500** | `#22C55E` | 成功图标、文字 |
| **Success-600** | `#16A34A` | 成功按钮 |
| **Warning-50** | `#FFFBEB` | 警告背景 |
| **Warning-500** | `#F59E0B` | 警告图标、文字 |
| **Warning-600** | `#D97706` | 警告按钮 |
| **Error-50** | `#FEF2F2` | 错误背景 |
| **Error-500** | `#EF4444` | 错误图标、文字 |
| **Error-600** | `#DC2626` | 错误按钮 |
| **Info-50** | `#EFF6FF` | 信息背景 |
| **Info-500** | `#3B82F6` | 信息图标、文字 |
| **Info-600** | `#2563EB` | 信息按钮 |

### 2.4 色彩使用规范

```
页面背景:      Gray-50  #F9FAFB
卡片背景:      White    #FFFFFF
主按钮背景:    Primary-500  #F97316
主按钮悬停:    Primary-600  #EA580C
主按钮按下:    Primary-700  #C2410C
次要按钮背景:  White + Gray-200 border
边框颜色:      Gray-200  #E5E7EB
文字主色:      Gray-900  #111827
文字次要:      Gray-500  #6B7280
文字占位:      Gray-400  #9CA3AF
链接颜色:      Primary-600  #EA580C
```

---

## 3. 字体系统

### 3.1 字体家族

```css
/* 标题字体 - 可爱风格 */
--font-display: 'ZCOOL KuaiLe', 'PingFang SC', 'Microsoft YaHei', cursive;

/* 正文字体 - 清晰易读 */
--font-body: 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;

/* 数字字体 - 等宽 */
--font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;
```

### 3.2 字体层级

| 层级 | 尺寸 | 字重 | 行高 | 用途 |
|------|------|------|------|------|
| **Display** | 32px | 700 | 1.2 | 页面大标题 |
| **H1** | 24px | 700 | 1.3 | 区块标题 |
| **H2** | 20px | 600 | 1.4 | 卡片标题 |
| **H3** | 18px | 600 | 1.4 | 小标题 |
| **H4** | 16px | 600 | 1.5 | 标签 |
| **Body Large** | 16px | 400 | 1.6 | 重要正文 |
| **Body** | 14px | 400 | 1.6 | 普通正文 |
| **Body Small** | 13px | 400 | 1.5 | 辅助文字 |
| **Caption** | 12px | 400 | 1.5 | 说明文字 |
| **Overline** | 11px | 500 | 1.4 | 标签、徽章 |

### 3.3 字体使用示例

```css
/* 页面标题 */
.page-title {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-900);
}

/* 区块标题 */
.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
}

/* 卡片标题 */
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-700);
}

/* 正文 */
.body-text {
  font-size: 14px;
  font-weight: 400;
  color: var(--gray-600);
  line-height: 1.6;
}

/* 辅助文字 */
.caption {
  font-size: 12px;
  color: var(--gray-400);
}
```

---

## 4. 间距系统

### 4.1 基础间距

| Token | 值 | 用途 |
|-------|-----|------|
| **space-0** | 0 | 无间距 |
| **space-1** | 4px | 图标间距 |
| **space-2** | 8px | 紧凑间距 |
| **space-3** | 12px | 小间距 |
| **space-4** | 16px | 默认间距 |
| **space-5** | 20px | 中等间距 |
| **space-6** | 24px | 大间距 |
| **space-8** | 32px | 区块间距 |
| **space-10** | 40px | 大区块间距 |
| **space-12** | 48px | 页面间距 |

### 4.2 组件间距

```
卡片内边距:     16px (space-4)
卡片间距:       12px (space-3)
表单元素间距:   16px (space-4)
按钮内边距:     10px 16px / 12px 24px
输入框内边距:   10px 14px
区块间距:       24px (space-6)
```

### 4.3 布局间距

```
页面水平边距:   24px (移动端 16px)
页面最大宽度:   1280px
内容区最大宽度: 1200px
侧边栏宽度:     320px
```

---

## 5. 圆角系统

| Token | 值 | 用途 |
|-------|-----|------|
| **radius-none** | 0 | 无圆角 |
| **radius-sm** | 4px | 小元素 |
| **radius-md** | 8px | 按钮、输入框 |
| **radius-lg** | 12px | 卡片 |
| **radius-xl** | 16px | 大卡片 |
| **radius-2xl** | 20px | 特殊卡片 |
| **radius-full** | 9999px | 圆形、胶囊 |

---

## 6. 阴影系统

### 6.1 阴影层级

```css
/* 无阴影 */
--shadow-none: none;

/* 小阴影 - 悬停状态 */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* 默认阴影 - 卡片 */
--shadow-md: 
  0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -2px rgba(0, 0, 0, 0.1);

/* 大阴影 - 浮起卡片 */
--shadow-lg: 
  0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -4px rgba(0, 0, 0, 0.1);

/* 超大阴影 - 模态框 */
--shadow-xl: 
  0 20px 25px -5px rgba(0, 0, 0, 0.1),
  0 8px 10px -6px rgba(0, 0, 0, 0.1);

/* 彩色阴影 - 主色强调 */
--shadow-primary: 
  0 4px 14px 0 rgba(249, 115, 22, 0.39);
```

### 6.2 阴影使用规范

| 组件 | 默认 | 悬停 | 激活 |
|------|------|------|------|
| 卡片 | shadow-md | shadow-lg | shadow-md |
| 按钮 | shadow-sm | shadow-md | shadow-none |
| 主按钮 | shadow-primary | shadow-lg | shadow-none |
| 下拉菜单 | shadow-lg | - | - |
| 模态框 | shadow-xl | - | - |

---

## 7. 组件规范

### 7.1 按钮 (Button)

#### 主按钮 (Primary)

```
┌─────────────────────────────┐
│      ✂️ 一键裁剪            │
└─────────────────────────────┘

背景:    Primary-500  #F97316
文字:    White  #FFFFFF
边框:    none
圆角:    12px (radius-lg)
内边距:  12px 24px
字号:    14px
字重:    600
阴影:    shadow-primary

悬停:
  背景:  Primary-600  #EA580C
  阴影:  shadow-lg
  变换:  translateY(-1px)

按下:
  背景:  Primary-700  #C2410C
  阴影:  none
  变换:  translateY(0)

禁用:
  背景:  Gray-300  #D1D5DB
  阴影:  none
  光标:  not-allowed
```

#### 次要按钮 (Secondary)

```
┌─────────────────────────────┐
│        取消全选             │
└─────────────────────────────┘

背景:    White  #FFFFFF
文字:    Gray-700  #374151
边框:    1px solid Gray-200  #E5E7EB
圆角:    8px (radius-md)
内边距:  8px 16px
字号:    13px
字重:    500

悬停:
  背景:  Gray-50  #F9FAFB
  边框:  Gray-300  #D1D5DB
```

#### 文字按钮 (Text)

```
[重新上传]

背景:    transparent
文字:    Primary-600  #EA580C
字号:    13px
字重:    500

悬停:
  文字:  Primary-700  #C2410C
  下划线
```

#### 图标按钮 (Icon Button)

```
┌─────┐
│  ✕  │
└─────┘

尺寸:    32px × 32px
背景:    transparent
圆角:    8px (radius-md)

悬停:
  背景:  Gray-100  #F3F4F6
```

### 7.2 输入框 (Input)

```
┌─────────────────────────────┐
│  4                          │
└─────────────────────────────┘

背景:    White  #FFFFFF
边框:    1px solid Gray-200  #E5E7EB
圆角:    10px (radius-md)
内边距:  10px 14px
字号:    14px
字重:    400
颜色:    Gray-900  #111827
占位符:  Gray-400  #9CA3AF

聚焦:
  边框:  2px solid Primary-500  #F97316
  阴影:  0 0 0 3px Primary-100  #FFEDD5

错误:
  边框:  2px solid Error-500  #EF4444
  背景:  Error-50  #FEF2F2

禁用:
  背景:  Gray-100  #F3F4F6
  颜色:  Gray-400  #9CA3AF
```

### 7.3 卡片 (Card)

#### 基础卡片

```
┌─────────────────────────────┐
│                             │
│        卡片内容             │
│                             │
└─────────────────────────────┘

背景:    White  #FFFFFF
边框:    1px solid Gray-200  #E5E7EB
圆角:    16px (radius-xl)
阴影:    shadow-md
内边距:  20px

悬停:
  阴影:  shadow-lg
  变换:  translateY(-2px)
```

#### 表情卡片

```
┌─────────────────┐
│  ┌───────────┐  │
│  │           │  │
│  │  表情图   │  │  ← 图片区域
│  │           │  │
│  └───────────┘  │
│ ┌─────────────┐ │
│ │  emoji_01   │ │  ← 文件名区域
│ └─────────────┘ │
└─────────────────┘

尺寸:    自适应宽度，固定宽高比
背景:    White  #FFFFFF
边框:    2px solid Gray-200  #E5E7EB
圆角:    12px (radius-lg)
阴影:    shadow-sm

选中状态:
  边框:  2px solid Primary-500  #F97316
  阴影:  shadow-md

悬停:
  边框:  Gray-300  #D1D5DB
  阴影:  shadow-md
```

### 7.4 标签/徽章 (Badge)

```
┌─────────┐
│  16个   │
└─────────┘

背景:    Primary-100  #FFEDD5
文字:    Primary-800  #9A3412
圆角:    9999px (radius-full)
内边距:  4px 10px
字号:    12px
字重:    500
```

### 7.5 复选框 (Checkbox)

```
默认:      选中:
┌─────┐   ┌─────┐
│     │   │  ✓  │
└─────┘   └─────┘

尺寸:    20px × 20px
边框:    2px solid Gray-300  #D1D5DB
圆角:    6px (radius-md)
背景:    White  #FFFFFF

选中:
  背景:  Primary-500  #F97316
  边框:  Primary-500  #F97316
  图标:  White  #FFFFFF

悬停:
  边框:  Primary-400  #FB923C
```

### 7.6 Toast 通知

```
┌────────────────────────────────────────┐
│ ✅ 成功裁剪 16 个表情          [×]    │
└────────────────────────────────────────┘

背景:    White  #FFFFFF
边框:    1px solid Gray-200  #E5E7EB
圆角:    12px (radius-lg)
阴影:    shadow-lg
内边距:  14px 18px
最小宽度: 300px
最大宽度: 500px

成功图标:  Success-500  #22C55E
警告图标:  Warning-500  #F59E0B
错误图标:  Error-500  #EF4444
信息图标:  Info-500  #3B82F6
```

### 7.7 上传区域 (Upload Zone)

```
┌─────────────────────────────────────────────┐
│                                             │
│              ╭─────────────╮                │
│              │   📁        │                │
│              ╰─────────────╯                │
│                                             │
│         拖拽图片到这里                      │
│                                             │
└─────────────────────────────────────────────┘

背景:    White  #FFFFFF
边框:    2px dashed Gray-300  #D1D5DB
圆角:    16px (radius-xl)
内边距:  48px 32px

拖拽激活:
  背景:  Primary-50  #FFF7ED
  边框:  2px solid Primary-500  #F97316

悬停:
  边框:  Gray-400  #9CA3AF
```

---

## 8. 布局规范

### 8.1 栅格系统

```
┌─────────────────────────────────────────────────────────────┐
│  边距 24px                                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │              内容区域 (最大 1200px)                  │    │
│  │                                                     │    │
│  │   ┌──────────────┐  ┌──────────────────────────┐   │    │
│  │   │   侧边栏     │  │        主内容区           │   │    │
│  │   │   320px      │  │        自适应             │   │    │
│  │   └──────────────┘  └──────────────────────────┘   │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│  边距 24px                                                  │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 响应式断点

| 断点 | 宽度 | 布局变化 |
|------|------|----------|
| **sm** | 640px | 基础移动端布局 |
| **md** | 768px | 平板布局，卡片4列 |
| **lg** | 1024px | 桌面布局，双栏 |
| **xl** | 1280px | 大屏桌面，卡片8列 |
| **2xl** | 1536px | 超大屏，最大宽度限制 |

### 8.3 页面结构

```
┌─────────────────────────────────────────┐
│              Header 64px                │
├─────────────────────────────────────────┤
│                                         │
│              Content                    │
│           (min-height: calc(100vh - 64px)) │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │         上传区域                │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────┬────────────────┐   │
│  │   预览区域       │   设置区域      │   │
│  │   (50%)         │   (50%)        │   │
│  └─────────────────┴────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │         结果区域                │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 9. 动效规范

### 9.1 缓动函数

```css
/* 标准缓动 */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);

/* 进入缓动 - 从屏幕外进入 */
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* 离开缓动 - 退出到屏幕外 */
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* 弹性缓动 - 活泼的动画 */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* 柔和缓动 - 页面加载 */
--ease-soft: cubic-bezier(0.16, 1, 0.3, 1);
```

### 9.2 动画时长

| 类型 | 时长 | 用途 |
|------|------|------|
| **Instant** | 0ms | 立即响应 |
| **Fast** | 100ms | 微交互、按下 |
| **Normal** | 200ms | 悬停、切换 |
| **Slow** | 300ms | 展开、收起 |
| **Page** | 500ms | 页面过渡 |

### 9.3 标准动画

```css
/* 淡入 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 向上滑入 */
@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* 缩放弹出 */
@keyframes scaleIn {
  from { 
    opacity: 0; 
    transform: scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}

/* 旋转 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 脉冲 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 弹跳 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
```

### 9.4 组件动画

| 组件 | 动画 | 时长 | 缓动 |
|------|------|------|------|
| 页面加载 | 淡入 + 上滑 | 600ms | ease-soft |
| 卡片悬停 | 上浮 + 阴影 | 200ms | ease-default |
| 按钮点击 | 缩放 0.97 | 100ms | ease-in |
| Toast 进入 | 从右滑入 | 300ms | ease-out |
| Toast 离开 | 向上滑出 | 200ms | ease-in |
| 模态框 | 缩放 + 淡入 | 300ms | ease-spring |
| 加载旋转 | 无限旋转 | 1000ms | linear |

---

## 10. 图标规范

### 10.1 图标尺寸

| 尺寸 | 用途 |
|------|------|
| 16px | 内联图标、小按钮 |
| 20px | 表单图标、列表项 |
| 24px | 按钮图标、导航 |
| 32px | 大按钮、功能图标 |
| 48px | 空状态、插图 |

### 10.2 图标风格

- 线框风格 (Outline)
- 2px 描边
- 圆角端点
- 统一视觉重量

### 10.3 图标列表

| 图标 | 用途 |
|------|------|
| 📁 Upload | 上传 |
| ✂️ Crop | 裁剪 |
| ⬇️ Download | 下载 |
| ☑️ Check | 选中 |
| ✕ Close | 关闭 |
| ⚠️ Warning | 警告 |
| ❌ Error | 错误 |
| ✅ Success | 成功 |
| ℹ️ Info | 信息 |
| 🔄 Refresh | 刷新 |
| 🔒 Lock | 锁定 |
| 🔓 Unlock | 解锁 |

---

## 11. 无障碍规范

### 11.1 颜色对比度

- 正文文字与背景对比度 ≥ 4.5:1
- 大文字与背景对比度 ≥ 3:1
- 交互元素对比度 ≥ 3:1

### 11.2 焦点状态

```css
/* 焦点环 */
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* 键盘导航焦点 */
.keyboard-focus :focus {
  box-shadow: 0 0 0 3px var(--primary-200);
}
```

### 11.3 语义化

- 使用正确的 HTML 标签
- 提供 alt 文本
- 使用 ARIA 标签
- 支持屏幕阅读器

### 11.4 键盘操作

| 操作 | 按键 |
|------|------|
| 聚焦下一个 | Tab |
| 聚焦上一个 | Shift + Tab |
| 激活按钮 | Enter / Space |
| 关闭弹窗 | Escape |
| 快速裁剪 | Enter (在设置区) |

---

## 12. CSS 变量定义

```css
:root {
  /* 颜色 */
  --primary-50: #FFF7ED;
  --primary-100: #FFEDD5;
  --primary-200: #FED7AA;
  --primary-300: #FDBA74;
  --primary-400: #FB923C;
  --primary-500: #F97316;
  --primary-600: #EA580C;
  --primary-700: #C2410C;
  --primary-800: #9A3412;
  --primary-900: #7C2D12;

  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;

  --success-50: #F0FDF4;
  --success-500: #22C55E;
  --success-600: #16A34A;

  --warning-50: #FFFBEB;
  --warning-500: #F59E0B;
  --warning-600: #D97706;

  --error-50: #FEF2F2;
  --error-500: #EF4444;
  --error-600: #DC2626;

  --info-50: #EFF6FF;
  --info-500: #3B82F6;
  --info-600: #2563EB;

  /* 字体 */
  --font-display: 'ZCOOL KuaiLe', 'PingFang SC', 'Microsoft YaHei', cursive;
  --font-body: 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;

  /* 间距 */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;

  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-primary: 0 4px 14px 0 rgba(249, 115, 22, 0.39);

  /* 动画 */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-soft: cubic-bezier(0.16, 1, 0.3, 1);

  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-page: 500ms;
}
```

---

## 13. 文件命名规范

### 13.1 组件文件

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.module.css
│   └── index.ts
├── Card/
│   ├── Card.tsx
│   ├── Card.module.css
│   └── index.ts
└── ...
```

### 13.2 样式文件

```
styles/
├── variables.css      # CSS 变量
├── reset.css          # 重置样式
├── utilities.css      # 工具类
└── animations.css     # 动画定义
```

### 13.3 图片资源

```
assets/
├── icons/             # 图标
├── illustrations/     # 插图
└── images/            # 图片
```

---

## 14. 验收清单

### 14.1 视觉验收

- [ ] 颜色使用符合规范
- [ ] 字体层级正确
- [ ] 间距一致
- [ ] 圆角统一
- [ ] 阴影适当
- [ ] 图标风格一致

### 14.2 交互验收

- [ ] 悬停效果正常
- [ ] 点击反馈明确
- [ ] 动画流畅
- [ ] 加载状态清晰
- [ ] 错误提示友好

### 14.3 响应式验收

- [ ] 桌面端布局正确
- [ ] 平板端适配良好
- [ ] 移动端可用
- [ ] 断点切换平滑

### 14.4 无障碍验收

- [ ] 键盘可操作
- [ ] 对比度达标
- [ ] 屏幕阅读器友好
- [ ] 焦点状态清晰
