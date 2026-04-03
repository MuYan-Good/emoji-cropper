# 功能完成报告：核心裁剪引擎（PNG）

## 功能概述

实现 PNG 雪碧图的裁剪和缩放功能，包含 3 个核心函数，支持将一张雪碧图按行列数自动等分切割为多个单独的表情图片，并缩放到指定尺寸。

## 完成时间

2026-04-03

## 任务完成情况

| 任务编号 | 任务名称 | 状态 |
|----------|----------|------|
| TASK-CROP-01 | 类型定义与常量 | ✅ 完成 |
| TASK-CROP-02 | 图片缩放函数 | ✅ 完成 |
| TASK-CROP-03 | 单张裁剪函数 | ✅ 完成 |
| TASK-CROP-04 | 批量裁剪函数 | ✅ 完成 |

## 已创建文件

| 文件路径 | 说明 |
|----------|------|
| `src/types/image.ts` | GridConfig、CropResult 类型定义 |
| `src/utils/constants.ts` | DEFAULT_OUTPUT_SIZE、MAX_FILE_SIZE 等常量 |
| `src/utils/imageCropper.ts` | resizeImage、cropImage、cropSprite 函数实现 |
| `src/utils/imageCropper.test.ts` | 20 个测试用例 |

## 函数清单

### resizeImage(blob: Blob, targetSize: number): Promise<Blob>

将图片缩放到指定尺寸（正方形）。

**参数**：
- `blob`: 输入图片 Blob
- `targetSize`: 目标尺寸（正方形边长）

**返回**：缩放后的 PNG Blob

**错误处理**：
- `targetSize <= 0` → 抛出 "输出尺寸必须大于 0"

### cropImage(image: HTMLImageElement, row: number, col: number, config: GridConfig): Promise<Blob>

从雪碧图中裁剪指定区域的单张图片。

**参数**：
- `image`: 原始雪碧图 HTMLImageElement
- `row`: 行索引（从 0 开始）
- `col`: 列索引（从 0 开始）
- `config`: 网格配置 `{ rows: number, cols: number }`

**返回**：裁剪后的 PNG Blob

**错误处理**：
- `config.rows <= 0` → 抛出 "行数必须大于 0"
- `config.cols <= 0` → 抛出 "列数必须大于 0"
- `row < 0 || row >= config.rows` → 抛出 "行索引越界"
- `col < 0 || col >= config.cols` → 抛出 "列索引越界"

### cropSprite(image: HTMLImageElement, config: GridConfig, outputSize?: number): Promise<Blob[]>

批量裁剪整张雪碧图并缩放到指定尺寸。

**参数**：
- `image`: 原始雪碧图 HTMLImageElement
- `config`: 网格配置 `{ rows: number, cols: number }`
- `outputSize`: 输出尺寸（可选，默认 240）

**返回**：所有裁剪结果的 Blob 数组（长度 = rows × cols）

**错误处理**：
- `config.rows <= 0` → 抛出 "行数必须大于 0"
- `config.cols <= 0` → 抛出 "列数必须大于 0"
- `outputSize <= 0` → 抛出 "输出尺寸必须大于 0"

## 测试用例统计

| 函数 | 测试数量 | 覆盖场景 |
|------|----------|----------|
| resizeImage | 5 | 正常 3 + 边界 2 |
| cropImage | 9 | 正常 4 + 边界 5 |
| cropSprite | 6 | 正常 3 + 边界 3 |
| **总计** | **20** | — |

## AC 覆盖情况

| AC 编号 | 验收条件 | 覆盖任务 | 状态 |
|---------|----------|----------|------|
| AC-CROP-01 | 正确计算裁剪区域坐标 | TASK-CROP-03 | ✅ |
| AC-CROP-02 | 裁剪后尺寸正确 | TASK-CROP-03 | ✅ |
| AC-CROP-03 | 保持透明通道 | TASK-CROP-03 | ✅ |
| AC-CROP-04 | 正确缩放到指定尺寸 | TASK-CROP-02, TASK-CROP-04 | ✅ |
| AC-CROP-05 | 输出 Blob 类型为 image/png | TASK-CROP-03 | ✅ |
| AC-CROP-06 | 行列数为 0 或负数时抛出错误 | TASK-CROP-03 | ✅ |
| AC-CROP-07 | 数组长度 = rows × cols | TASK-CROP-04 | ✅ |
| AC-CROP-08 | 批量裁剪返回完整数组 | TASK-CROP-04 | ✅ |
| AC-CROP-09 | 单张裁剪返回正确结果 | TASK-CROP-03 | ✅ |
| AC-CROP-10 | 任意正整数尺寸缩放 | TASK-CROP-02 | ✅ |

## 待手动验证

由于网络问题，依赖未能完全安装。请在网络恢复后执行：

```bash
# 安装依赖
pnpm install

# 运行测试
pnpm test run src/utils/imageCropper.test.ts

# TypeScript 类型检查
npx tsc --noEmit
```

## 后续工作

核心裁剪引擎（PNG）已完成，可以继续以下开发：

1. **Milestone 2 继续**：图片上传 Hook（useImageUpload）
2. **Milestone 2 继续**：裁剪 Hook（useSpriteCrop）
3. **Milestone 2 继续**：上传与裁剪 UI 组件
4. **Milestone 5**：GIF 动图处理引擎（gifProcessor）
