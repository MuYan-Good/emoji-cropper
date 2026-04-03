# 功能需求：裁剪 Hook（useSpriteCrop）

## 功能概述

实现裁剪的核心逻辑，接收图片和 GridConfig，调用 imageCropper 裁剪，管理裁剪状态（loading、error、results）。

## 用户故事

**作为** 表情包创作者
**我想要** 一键裁剪上传的雪碧图
**以便于** 获得裁剪后的单个表情图片

## 核心功能

### 1. 裁剪执行

- 接收 HTMLImageElement 和 GridConfig
- 调用 cropSprite() 执行裁剪
- 支持自定义输出尺寸

### 2. 状态管理

- `isCropping`: 裁剪中状态
- `error`: 错误信息（中文）
- `results`: 裁剪结果数组（Blob[]）
- `crop`: 裁剪方法
- `reset`: 重置状态

## Hook 接口设计

```typescript
interface UseSpriteCropReturn {
  results: Blob[]
  isCropping: boolean
  error: string | null
  crop: (image: HTMLImageElement, config: GridConfig, outputSize?: number) => Promise<void>
  reset: () => void
}
```

## 验收标准（AC）

| 编号 | 验收条件 | 优先级 |
|------|----------|--------|
| AC-CROPHOOK-01 | Given 已上传图片，When 调用 crop(image, {rows:4, cols:4})，Then results 包含 16 个 Blob | P0 |
| AC-CROPHOOK-02 | Given 裁剪过程中，When 正在裁剪，Then isCropping = true | P0 |
| AC-CROPHOOK-03 | Given 裁剪成功后，When 裁剪完成，Then isCropping = false, results 不为空 | P0 |
| AC-CROPHOOK-04 | Given 裁剪失败后，When 裁剪完成，Then isCropping = false, error 不为 null | P0 |
| AC-CROPHOOK-05 | Given 已有裁剪结果，When 调用 reset，Then results = [], error = null | P0 |
| AC-CROPHOOK-06 | Given rows=0，When 调用 crop，Then error = "行数必须大于 0" | P0 |
| AC-CROPHOOK-07 | Given outputSize=0，When 调用 crop，Then error = "输出尺寸必须大于 0" | P0 |
| AC-CROPHOOK-08 | Given image 为 null，When 调用 crop，Then error = "图片未加载" | P0 |

## 边界情况

| 场景 | 预期行为 |
|------|----------|
| image 为 null | error = "图片未加载" |
| rows ≤ 0 | error = "行数必须大于 0" |
| cols ≤ 0 | error = "列数必须大于 0" |
| outputSize ≤ 0 | error = "输出尺寸必须大于 0" |
| 连续裁剪 | 后一次裁剪覆盖之前的结果 |

## 不在范围内

- GIF 动图裁剪（由 gifProcessor 处理，后续迭代）
- 裁剪进度反馈（后续迭代）
- 裁剪预览（由 UI 组件处理）

## 依赖

- `utils/imageCropper.ts` — cropSprite()
- `types/image.ts` — GridConfig
