# 任务规划：裁剪 Hook（useSpriteCrop）

## 功能概述

实现裁剪的核心逻辑，接收图片和 GridConfig，调用 imageCropper 裁剪，管理裁剪状态。

## 任务拆分

本功能为单一 Hook，直接实现即可。

---

## Task 1: useSpriteCrop Hook

### 基本信息

| 项目 | 内容 |
|------|------|
| 任务编号 | TASK-CROPHOOK-01 |
| 所属阶段 | 核心逻辑 |
| 预估工时 | 1 小时 |
| 依赖任务 | imageCropper.ts（已完成） |
| 关联 AC | AC-CROPHOOK-01~08 |

### 任务描述

创建 `src/hooks/useSpriteCrop.ts`，实现裁剪 Hook。

### 验证标准

**正常情况**：
1. 调用 crop(image, {rows:4, cols:4}) → results.length = 16
2. 裁剪过程中 → isCropping = true
3. 裁剪成功后 → isCropping = false, results 不为空
4. 调用 reset() → results = [], error = null

**边界情况**：
5. image 为 null → error = "图片未加载"
6. rows = 0 → error = "行数必须大于 0"
7. outputSize = 0 → error = "输出尺寸必须大于 0"

### 通俗解释

管理裁剪状态，把大图切成小块。

---

## AC 覆盖总表

| AC 编号 | 覆盖任务 | 验证方式 |
|---------|----------|----------|
| AC-CROPHOOK-01 | TASK-CROPHOOK-01 | 单元测试：裁剪成功 |
| AC-CROPHOOK-02 | TASK-CROPHOOK-01 | 单元测试：loading 状态 |
| AC-CROPHOOK-03 | TASK-CROPHOOK-01 | 单元测试：成功后状态 |
| AC-CROPHOOK-04 | TASK-CROPHOOK-01 | 单元测试：失败后状态 |
| AC-CROPHOOK-05 | TASK-CROPHOOK-01 | 单元测试：reset 功能 |
| AC-CROPHOOK-06 | TASK-CROPHOOK-01 | 单元测试：rows 校验 |
| AC-CROPHOOK-07 | TASK-CROPHOOK-01 | 单元测试：outputSize 校验 |
| AC-CROPHOOK-08 | TASK-CROPHOOK-01 | 单元测试：image 校验 |

---

## 任务总览

| 任务编号 | 任务名称 | 预估工时 | 依赖 |
|----------|----------|----------|------|
| TASK-CROPHOOK-01 | useSpriteCrop Hook | 1 小时 | imageCropper.ts |

**总预估工时**：1 小时
