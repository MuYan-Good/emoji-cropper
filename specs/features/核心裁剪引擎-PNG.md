# 功能需求：核心裁剪引擎（PNG）

## 功能概述

实现 PNG 雪碧图的裁剪和缩放功能，根据用户输入的行列数，将一张雪碧图自动等分切割为多个单独的表情图片，并支持缩放到指定尺寸。

## 用户故事

**作为** 表情包创作者
**我想要** 将雪碧图一键裁剪为单个表情图片
**以便于** 快速导出并提交到微信表情开放平台

## 核心功能

### 1. 单张裁剪 (cropImage)

从雪碧图中裁剪指定区域的单张图片。

**输入**：
- `image`: HTMLImageElement — 原始雪碧图
- `row`: number — 行索引（从 0 开始）
- `col`: number — 列索引（从 0 开始）
- `config`: GridConfig — 网格配置

**输出**：
- `Promise<Blob>` — 裁剪后的 PNG 图片

### 2. 批量裁剪 (cropSprite)

按行列数批量裁剪整张雪碧图。

**输入**：
- `image`: HTMLImageElement — 原始雪碧图
- `config`: GridConfig — 网格配置（行列数）
- `outputSize?`: number — 输出尺寸（可选，默认 240）

**输出**：
- `Promise<Blob[]>` — 所有裁剪结果的数组

### 3. 图片缩放 (resizeImage)

将图片缩放到指定尺寸。

**输入**：
- `blob`: Blob — 原始图片
- `targetSize`: number — 目标尺寸（正方形边长）

**输出**：
- `Promise<Blob>` — 缩放后的图片

## 技术实现要点

### Canvas 操作保持透明

```typescript
// 清空画布，保持透明背景
canvas.clearRect(0, 0, width, height)
```

### 类型定义

```typescript
interface GridConfig {
  rows: number
  cols: number
}

interface CropResult {
  blob: Blob
  row: number
  col: number
  originalSize: { width: number; height: number }
}
```

### 错误处理

```typescript
// 行列数校验
if (config.rows <= 0 || config.cols <= 0) {
  throw new Error(`行列数必须大于 0，当前: ${config.rows}×${config.cols}`)
}
```

## 验收标准（AC）

| 编号 | 验收条件 | 优先级 |
|------|----------|--------|
| AC-CROP-01 | 输入 HTMLImageElement 和 GridConfig（rows=4, cols=4），能正确计算每个裁剪区域的坐标和宽高 | P0 |
| AC-CROP-02 | 裁剪后的图片尺寸正确（原图宽/cols × 原图高/rows） | P0 |
| AC-CROP-03 | 裁剪后的图片保持原图的透明通道（如有） | P0 |
| AC-CROP-04 | 裁剪后的图片能正确缩放到指定尺寸（如 240×240px） | P0 |
| AC-CROP-05 | 输出格式为 Blob，类型为 `image/png` | P0 |
| AC-CROP-06 | 当 rows 或 cols 为 0 或负数时，抛出明确的错误信息 | P0 |
| AC-CROP-07 | 当 rows × cols 超过图片实际可容纳的数量时，抛出警告或错误 | P1 |
| AC-CROP-08 | 批量裁剪函数 `cropSprite()` 能返回所有裁剪结果的数组 | P0 |
| AC-CROP-09 | 单张裁剪函数 `cropImage()` 能返回指定位置的裁剪结果 | P0 |
| AC-CROP-10 | 缩放函数 `resizeImage()` 能将图片缩放到任意正整数尺寸 | P0 |

## 边界情况

| 场景 | 预期行为 |
|------|----------|
| rows = 0 | 抛出错误："行数必须大于 0" |
| cols = 0 | 抛出错误："列数必须大于 0" |
| rows = -1 | 抛出错误："行数必须大于 0" |
| 图片未加载 | 抛出错误："图片未加载" |
| outputSize = 0 | 抛出错误："输出尺寸必须大于 0" |
| 透明背景 PNG | 保持透明通道 |
| 非正方形雪碧图 | 正常裁剪，每个单元格可能不是正方形 |

## 不在范围内

- GIF 动图裁剪（由 gifProcessor 处理）
- 自动检测行列数
- 图片格式转换

---

## 变更日志 (Change Log)

### CR-001: 支持独立设置输出宽高 (2026-04-03)

**变更类型**: 扩展
**变更原因**: 用户需要输出非正方形尺寸的表情图片

**变更内容**:
- 输出尺寸从单一数值改为支持独立宽高
- 新增 `OutputSize` 接口（width, height）
- `resizeImage` 函数支持独立宽高参数
- `cropSprite` 函数接受 `OutputSize` 参数
- UI 新增宽高比锁定开关

**新增 AC**:
- AC-CROP-11: 输出尺寸支持独立设置宽高
- AC-CROP-12: 宽高比锁定开关功能
