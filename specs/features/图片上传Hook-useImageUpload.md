# 功能需求：图片上传 Hook（useImageUpload）

## 功能概述

实现图片上传的核心逻辑，包括文件校验、读取为 HTMLImageElement、错误处理和状态管理。作为连接 UI 组件和裁剪引擎的桥梁。

## 用户故事

**作为** 表情包创作者
**我想要** 上传一张雪碧图并自动校验
**以便于** 确保图片符合裁剪要求，并获得可用于裁剪的图片对象

## 核心功能

### 1. 文件校验

- **类型校验**：仅接受 PNG 和 GIF 格式
- **大小校验**：最大支持 10MB

### 2. 图片加载

- 将文件读取为 HTMLImageElement
- 返回图片的原始尺寸信息

### 3. 状态管理

- `isLoading`: 加载中状态
- `error`: 错误信息（中文）
- `image`: 加载成功的 HTMLImageElement
- `imageInfo`: 图片信息（尺寸、类型、文件名）

## Hook 接口设计

```typescript
interface UseImageUploadReturn {
  image: HTMLImageElement | null
  imageInfo: ImageInfo | null
  isLoading: boolean
  error: string | null
  upload: (file: File) => Promise<void>
  reset: () => void
}

interface ImageInfo {
  width: number
  height: number
  type: 'png' | 'gif'
  fileName: string
  fileSize: number
}
```

## 验收标准（AC）

| 编号 | 验收条件 | 优先级 |
|------|----------|--------|
| AC-UPLOAD-01 | Given 用户上传 PNG 文件，When 文件大小 ≤ 10MB，Then 成功加载并返回 HTMLImageElement | P0 |
| AC-UPLOAD-02 | Given 用户上传 GIF 文件，When 文件大小 ≤ 10MB，Then 成功加载并返回 HTMLImageElement | P0 |
| AC-UPLOAD-03 | Given 用户上传非 PNG/GIF 文件，When 调用 upload，Then error = "不支持的文件格式，仅支持 PNG 和 GIF" | P0 |
| AC-UPLOAD-04 | Given 用户上传超过 10MB 的文件，When 调用 upload，Then error = "文件大小超过 10MB 限制" | P0 |
| AC-UPLOAD-05 | Given 上传过程中，When 正在加载，Then isLoading = true | P0 |
| AC-UPLOAD-06 | Given 上传成功后，When 加载完成，Then isLoading = false, image 不为 null | P0 |
| AC-UPLOAD-07 | Given 上传失败后，When 加载完成，Then isLoading = false, error 不为 null | P0 |
| AC-UPLOAD-08 | Given 已有上传结果，When 调用 reset，Then image = null, error = null, imageInfo = null | P0 |
| AC-UPLOAD-09 | Given 上传成功后，When 查询 imageInfo，Then 包含正确的 width、height、type、fileName、fileSize | P0 |

## 边界情况

| 场景 | 预期行为 |
|------|----------|
| 上传空文件 | error = "文件为空" |
| 上传损坏的图片 | error = "图片加载失败" |
| 连续上传多个文件 | 后上传的文件覆盖之前的结果 |
| 上传超大文件（>10MB） | error = "文件大小超过 10MB 限制" |

## 不在范围内

- 拖拽上传的 UI 逻辑（由 react-dropzone 处理）
- 图片预览（由 UI 组件处理）
- 多文件上传（本项目不支持）

## 依赖

- `utils/constants.ts` — MAX_FILE_SIZE、SUPPORTED_TYPES
- `utils/fileHelper.ts` — validateFile()、getImageType()
