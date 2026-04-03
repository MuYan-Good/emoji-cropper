# 任务规划：图片上传 Hook（useImageUpload）

## 功能概述

实现图片上传的核心逻辑，包括文件校验、读取为 HTMLImageElement、错误处理和状态管理。

## 任务拆分策略

本功能依赖 `utils/fileHelper.ts`，需要先完成辅助函数，再实现 Hook。

## 依赖关系

```mermaid
graph LR
    A[Task 1: fileHelper 辅助函数] --> B[Task 2: useImageUpload Hook]
```

---

## Task 1: fileHelper 辅助函数

### 基本信息

| 项目 | 内容 |
|------|------|
| 任务编号 | TASK-UPLOAD-01 |
| 所属阶段 | 基础设施 |
| 预估工时 | 30 分钟 |
| 依赖任务 | 无 |
| 关联 AC | AC-UPLOAD-03, AC-UPLOAD-04 |

### 任务描述

创建 `src/utils/fileHelper.ts`，实现文件校验和辅助函数。

### 验证标准

1. `validateFile(file: File)` — 校验文件类型和大小
   - PNG/GIF 类型通过，其他类型抛出错误
   - 文件大小 ≤ 10MB 通过，超过抛出错误
   - 空文件抛出错误

2. `getImageType(file: File)` — 获取图片类型（'png' | 'gif'）
   - 返回 'png' 或 'gif'

3. `formatFileSize(bytes: number)` — 格式化文件大小
   - 返回如 "5.2 MB"

### 通俗解释

提供文件校验工具函数，让 Hook 专注于状态管理。

---

## Task 2: useImageUpload Hook

### 基本信息

| 项目 | 内容 |
|------|------|
| 任务编号 | TASK-UPLOAD-02 |
| 所属阶段 | 核心逻辑 |
| 预估工时 | 1 小时 |
| 依赖任务 | TASK-UPLOAD-01 |
| 关联 AC | AC-UPLOAD-01~09 |

### 任务描述

创建 `src/hooks/useImageUpload.ts`，实现图片上传 Hook。

### 验证标准

**正常情况**：
1. 上传 PNG 文件 → image 不为 null，imageInfo.type = 'png'
2. 上传 GIF 文件 → image 不为 null，imageInfo.type = 'gif'
3. 上传过程中 → isLoading = true
4. 上传成功后 → isLoading = false, error = null
5. 调用 reset() → image = null, error = null, imageInfo = null

**边界情况**：
6. 上传非 PNG/GIF → error = "不支持的文件格式，仅支持 PNG 和 GIF"
7. 上传超过 10MB → error = "文件大小超过 10MB 限制"
8. 上传空文件 → error = "文件为空"
9. 上传损坏图片 → error = "图片加载失败"

### 通俗解释

管理上传状态，把文件变成可裁剪的图片对象。

---

## AC 覆盖总表

| AC 编号 | 覆盖任务 | 验证方式 |
|---------|----------|----------|
| AC-UPLOAD-01 | TASK-UPLOAD-02 | 单元测试：PNG 上传成功 |
| AC-UPLOAD-02 | TASK-UPLOAD-02 | 单元测试：GIF 上传成功 |
| AC-UPLOAD-03 | TASK-UPLOAD-01, TASK-UPLOAD-02 | 单元测试：类型校验 |
| AC-UPLOAD-04 | TASK-UPLOAD-01, TASK-UPLOAD-02 | 单元测试：大小校验 |
| AC-UPLOAD-05 | TASK-UPLOAD-02 | 单元测试：loading 状态 |
| AC-UPLOAD-06 | TASK-UPLOAD-02 | 单元测试：成功后状态 |
| AC-UPLOAD-07 | TASK-UPLOAD-02 | 单元测试：失败后状态 |
| AC-UPLOAD-08 | TASK-UPLOAD-02 | 单元测试：reset 功能 |
| AC-UPLOAD-09 | TASK-UPLOAD-02 | 单元测试：imageInfo 正确性 |

---

## 任务总览

| 任务编号 | 任务名称 | 预估工时 | 依赖 |
|----------|----------|----------|------|
| TASK-UPLOAD-01 | fileHelper 辅助函数 | 30 分钟 | 无 |
| TASK-UPLOAD-02 | useImageUpload Hook | 1 小时 | TASK-UPLOAD-01 |

**总预估工时**：1.5 小时
