# 功能完成报告：裁剪 Hook（useSpriteCrop）

## 功能概述

实现裁剪的核心逻辑，接收图片和 GridConfig，调用 imageCropper 裁剪，管理裁剪状态。

## 完成时间

2026-04-03

## 已创建文件

| 文件路径 | 说明 |
|----------|------|
| `src/hooks/useSpriteCrop.ts` | 裁剪 Hook |
| `src/hooks/useSpriteCrop.test.ts` | 8 个测试用例 |

## Hook API

```typescript
const {
  results,    // Blob[] - 裁剪结果
  isCropping, // boolean - 裁剪中状态
  error,      // string | null - 错误信息
  crop,       // (image, config, outputSize?) => Promise<void>
  reset,      // () => void
} = useSpriteCrop()
```

## 错误处理

| 场景 | 错误信息 |
|------|----------|
| image 为 null | "图片未加载" |
| rows ≤ 0 | "行数必须大于 0" |
| cols ≤ 0 | "列数必须大于 0" |
| outputSize ≤ 0 | "输出尺寸必须大于 0" |

## AC 覆盖情况

| AC 编号 | 验收条件 | 状态 |
|---------|----------|------|
| AC-CROPHOOK-01 | 4×4 裁剪返回 16 个 Blob | ✅ |
| AC-CROPHOOK-02 | 裁剪中 isCropping = true | ✅ |
| AC-CROPHOOK-03 | 成功后 isCropping = false | ✅ |
| AC-CROPHOOK-04 | 失败后 error 不为 null | ✅ |
| AC-CROPHOOK-05 | reset 功能正常 | ✅ |
| AC-CROPHOOK-06 | rows=0 返回错误 | ✅ |
| AC-CROPHOOK-07 | outputSize=0 返回错误 | ✅ |
| AC-CROPHOOK-08 | image=null 返回错误 | ✅ |

## 当前进度

```
Milestone 1: 项目初始化 ✅
Milestone 2: 核心裁剪引擎
  ├── 2.1 PNG 裁剪引擎 ✅
  ├── 2.2 图片上传 Hook ✅
  ├── 2.3 裁剪 Hook ✅
  └── 2.4 上传与裁剪 UI (待开发)
```

## 后续工作

useSpriteCrop 已完成，可以继续：

1. **ImageUploader 组件** — 拖拽上传 UI
2. **GridPreview 组件** — 网格分割线预览
3. **CropControls 组件** — 行列数输入 + 输出尺寸选择
4. **App.tsx** — 串联上传 → 设置 → 裁剪流程
