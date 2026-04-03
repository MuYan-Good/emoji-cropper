# 表情包雪碧图裁剪工具

一个简洁高效的 Web 工具，用于将表情包雪碧图（Sprite Sheet）一键裁剪为单个表情图片，支持批量命名和下载。

## 功能特性

- **拖拽上传** - 支持拖拽或点击上传 PNG/GIF 雪碧图
- **网格预览** - 实时预览裁剪网格，可视化调整行列数
- **独立宽高** - 支持设置不同的输出宽度和高度
- **宽高比锁定** - 一键锁定/解锁宽高比，自动计算比例
- **批量命名** - 自动编号命名，支持双击编辑文件名
- **单张下载** - 鼠标悬停单个表情即可下载
- **批量导出** - 一键打包下载所有选中表情为 ZIP
- **Toast 提示** - 操作反馈实时提示

## 快速开始

### 安装依赖

```bash
pnpm install
# 或
npm install
```

### 开发模式

```bash
pnpm dev
```

访问 http://localhost:5173

### 生产构建

```bash
pnpm build
```

构建产物位于 `dist/` 目录

## 使用方法

1. **上传图片** - 拖拽或点击上传区域选择雪碧图
2. **设置网格** - 输入行数和列数（如 4×4）
3. **调整尺寸** - 设置输出尺寸，可锁定宽高比
4. **一键裁剪** - 点击裁剪按钮生成表情卡片
5. **编辑命名** - 双击文件名可编辑
6. **下载导出** - 单张下载或批量打包

## 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite 6
- **样式**: Tailwind CSS 4
- **测试**: Vitest + Testing Library
- **依赖**:
  - react-dropzone - 文件拖拽上传
  - jszip - ZIP 打包
  - file-saver - 文件下载

## 项目结构

```
src/
├── components/        # UI 组件
│   ├── CropControls.tsx    # 裁剪控制面板
│   ├── EmojiCard.tsx       # 表情卡片
│   ├── EmojiGrid.tsx       # 卡片网格
│   ├── GridPreview.tsx     # 网格预览
│   ├── ImageUploader.tsx   # 图片上传
│   └── Toast.tsx           # 提示组件
├── hooks/             # 自定义 Hooks
│   ├── useEmojiGrid.ts     # 表情网格状态
│   ├── useExport.ts        # 导出逻辑
│   ├── useImageUpload.ts   # 图片上传
│   └── useSpriteCrop.ts    # 裁剪逻辑
├── types/             # 类型定义
│   └── image.ts
├── utils/             # 工具函数
│   ├── constants.ts        # 常量
│   ├── fileHelper.ts       # 文件处理
│   ├── imageCropper.ts     # 裁剪引擎
│   └── zipExporter.ts      # ZIP 导出
├── App.tsx            # 主应用
└── main.tsx           # 入口文件
```

## 默认配置

| 配置项 | 默认值 |
|--------|--------|
| 默认行数 | 4 |
| 默认列数 | 4 |
| 默认输出宽度 | 240px |
| 默认输出高度 | 240px |
| 最大文件大小 | 10MB |
| 支持格式 | PNG, GIF |

## 开发命令

```bash
pnpm dev      # 启动开发服务器
pnpm build    # 生产构建
pnpm preview  # 预览构建结果
pnpm test     # 运行测试
pnpm lint     # 代码检查
pnpm format   # 代码格式化
```

## 目标平台

主要面向微信表情开放平台：
- 单个表情尺寸：240×240px
- 支持格式：PNG, GIF
- 文件命名规范：自定义命名

## 开发流程

### 整体思路

本项目采用**需求驱动、分层架构、TDD 开发**的模式：

```
需求分析 → 技术选型 → 架构设计 → 任务拆解 → TDD 开发 → 集成测试
```

### 技术选型考虑

| 需求 | 技术方案 | 理由 |
|------|----------|------|
| 快速开发 | Vite + React | 生态成熟，开发体验好 |
| 类型安全 | TypeScript | 减少运行时错误 |
| 样式开发 | Tailwind CSS 4 | 原子化 CSS，快速迭代 |
| 图片处理 | Canvas API | 原生支持，无需额外依赖 |
| 文件下载 | JSZip + FileSaver | 成熟稳定，体积小 |
| 测试框架 | Vitest | 与 Vite 深度集成 |

### 核心模块设计

```
┌─────────────────────────────────────────────────────┐
│                    UI 层 (Components)                │
│  ImageUploader → GridPreview → CropControls → ...   │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                   Hook 层 (Hooks)                    │
│  useImageUpload → useSpriteCrop → useEmojiGrid      │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                  工具层 (Utils)                      │
│       imageCropper → zipExporter → fileHelper       │
└─────────────────────────────────────────────────────┘
```

**分层原则**：
- UI 层只负责展示和交互
- Hook 层管理状态和业务逻辑
- 工具层提供纯函数，易于测试

### TDD 开发流程

每个功能模块遵循 **Red-Green-Refactor** 循环：

1. **Red** - 先写失败的测试用例
2. **Green** - 写最少代码让测试通过
3. **Refactor** - 重构优化代码

示例：

```typescript
// 1. Red: 先写测试
it('should resize 100x100 PNG to 240x240', async () => {
  const input = await createTestPng(100, 100)
  const result = await resizeImage(input, 240, 240)
  const dims = await getImageDimensions(result)
  expect(dims.width).toBe(240)
  expect(dims.height).toBe(240)
})

// 2. Green: 实现函数
export async function resizeImage(blob: Blob, size: number): Promise<Blob> {
  // ... 实现代码
}

// 3. Refactor: 优化实现
```

### 开发顺序

```
Milestone 1: 项目初始化
    ↓
Milestone 2: 核心裁剪引擎（PNG）
    ↓
Milestone 3: 卡片网格与命名
    ↓
Milestone 4: 导出与下载
    ↓
Milestone 5: 完善与优化
```

### 代码规范

- **命名约定**: 组件用 PascalCase，函数用 camelCase
- **文件组织**: 按功能模块划分，就近原则
- **类型优先**: 先定义类型，再写实现
- **单一职责**: 每个函数只做一件事

### AI 辅助开发

本项目在开发过程中使用了 AI 编程工具辅助，以下是实践经验：

#### AI 擅长的场景

| 场景 | 效果 | 示例 |
|------|------|------|
| 需求澄清 | ⭐⭐⭐⭐⭐ | 通过对话梳理功能边界和验收标准 |
| 技术方案 | ⭐⭐⭐⭐ | 推荐技术栈、架构设计建议 |
| 代码生成 | ⭐⭐⭐⭐ | 根据类型定义生成实现代码 |
| 测试用例 | ⭐⭐⭐⭐⭐ | 生成边界条件和正常流程测试 |
| Bug 排查 | ⭐⭐⭐⭐ | 分析错误日志、定位问题根因 |
| 文档编写 | ⭐⭐⭐⭐⭐ | 生成 README、注释、说明文档 |

#### AI 不擅长的场景

- 理解隐含的业务背景知识
- 处理跨文件的复杂依赖关系
- 创造性的 UI/UX 设计决策

#### 高效使用 AI 的技巧

1. **提供清晰上下文** - 说明技术栈、项目结构、相关文件
2. **拆分小任务** - 一次只让 AI 做一件事
3. **先定义类型** - TypeScript 类型是最好的需求描述
4. **要求写测试** - 让 AI 先写测试再写实现
5. **人工 Review** - AI 生成的代码需要人工检查

#### 典型对话模式

```
用户: 我需要实现一个图片裁剪函数，输入是 HTMLImageElement 和网格配置，
      输出是裁剪后的 Blob 数组。

AI:   我来帮你设计这个函数。首先定义类型...

用户: 类型定义好了，请先写测试用例。

AI:   好的，以下是边界条件和正常流程的测试...

用户: 测试通过了，请优化一下性能。

AI:   我建议使用离屏 Canvas 批量处理...
```

#### 注意事项

- AI 生成的代码可能存在安全风险，需要 Review
- 不要让 AI 直接操作生产环境
- 敏感信息（API Key、密码）不要提供给 AI
- 保持对代码的理解，不要盲目复制粘贴

## License

MIT
