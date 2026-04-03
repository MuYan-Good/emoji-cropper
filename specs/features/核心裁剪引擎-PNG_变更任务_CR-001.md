# 变更任务：CR-001 支持独立设置输出宽高

## 变更概述

将输出尺寸从单一正方形数值改为支持独立设置宽高，并增加宽高比锁定功能。

**变更类型**: 扩展
**变更原因**: 用户需要输出非正方形尺寸的表情图片

---

## 影响范围

### 需求变更

| 原需求 | 变更后 |
|--------|--------|
| 输出尺寸为单一数值（正方形） | 输出尺寸支持独立宽高 |
| 无宽高比锁定 | 新增宽高比锁定开关 |

### 技术变更

| 文件 | 变更内容 |
|------|----------|
| `types/image.ts` | 新增 `OutputSize` 接口 |
| `utils/constants.ts` | 拆分为 `DEFAULT_OUTPUT_WIDTH` 和 `DEFAULT_OUTPUT_HEIGHT` |
| `utils/imageCropper.ts` | `resizeImage` 和 `cropSprite` 接受宽高参数 |
| `hooks/useSpriteCrop.ts` | `crop` 函数签名变更 |
| `components/CropControls.tsx` | UI 改为宽高两个输入框 + 锁定开关 |
| `App.tsx` | 状态管理变更 |
| `utils/imageCropper.test.ts` | 更新测试用例 |

---

## 增量任务

### TASK-CROP-05: 类型定义扩展

| 项目 | 内容 |
|------|------|
| 任务编号 | TASK-CROP-05 |
| 所属阶段 | 基础设施 |
| 依赖任务 | TASK-CROP-01 |
| 关联 AC | AC-CROP-11 |

**任务描述**：

扩展类型定义，新增 `OutputSize` 接口。

**验证标准**：

1. `OutputSize` 接口包含 `width: number` 和 `height: number` 属性
2. `CropResult.originalSize` 类型保持不变
3. TypeScript 编译通过

**代码变更**：

```typescript
// types/image.ts
export interface OutputSize {
  width: number
  height: number
}
```

---

### TASK-CROP-06: 常量更新

| 项目 | 内容 |
|------|------|
| 任务编号 | TASK-CROP-06 |
| 所属阶段 | 基础设施 |
| 依赖任务 | TASK-CROP-05 |
| 关联 AC | AC-CROP-11 |

**任务描述**：

更新常量定义，拆分默认输出尺寸为宽高两个值。

**验证标准**：

1. 删除 `DEFAULT_OUTPUT_SIZE`
2. 新增 `DEFAULT_OUTPUT_WIDTH = 240`
3. 新增 `DEFAULT_OUTPUT_HEIGHT = 240`
4. TypeScript 编译通过

---

### TASK-CROP-07: resizeImage 函数扩展

| 项目 | 内容 |
|------|------|
| 任务编号 | TASK-CROP-07 |
| 所属阶段 | 核心函数 |
| 依赖任务 | TASK-CROP-05, TASK-CROP-06 |
| 关联 AC | AC-CROP-04, AC-CROP-10, AC-CROP-11 |

**任务描述**：

修改 `resizeImage` 函数，支持独立的宽高参数。

**验证标准**：

1. 函数签名改为 `resizeImage(blob: Blob, width: number, height: number): Promise<Blob>`
2. 输入 100×100 PNG，width=240, height=120 → 输出 240×120 PNG
3. 输入 100×100 PNG，width=240, height=240 → 输出 240×240 PNG（兼容原行为）
4. width=0 或 height=0 → 抛出错误
5. 保持透明通道

---

### TASK-CROP-08: cropSprite 函数扩展

| 项目 | 内容 |
|------|------|
| 任务编号 | TASK-CROP-08 |
| 所属阶段 | 核心函数 |
| 依赖任务 | TASK-CROP-07 |
| 关联 AC | AC-CROP-08, AC-CROP-11 |

**任务描述**：

修改 `cropSprite` 函数，支持 `OutputSize` 参数。

**验证标准**：

1. 函数签名改为 `cropSprite(image, config, outputSize?: OutputSize): Promise<CropResult[]>`
2. 默认值为 `{ width: 240, height: 240 }`
3. 输入 400×400 雪碧图，outputSize={width:240, height:120} → 返回 16 个 240×120 PNG
4. 兼容原正方形行为

---

### TASK-CROP-09: useSpriteCrop Hook 更新

| 项目 | 内容 |
|------|------|
| 任务编号 | TASK-CROP-09 |
| 所属阶段 | Hook 层 |
| 依赖任务 | TASK-CROP-08 |
| 关联 AC | AC-CROP-11 |

**任务描述**：

更新 `useSpriteCrop` Hook，接受 `OutputSize` 参数。

**验证标准**：

1. `crop` 函数签名改为 `crop(image, config, outputSize?: OutputSize)`
2. 参数校验包含 width 和 height

---

### TASK-CROP-10: CropControls UI 重构

| 项目 | 内容 |
|------|------|
| 任务编号 | TASK-CROP-10 |
| 所属阶段 | UI 层 |
| 依赖任务 | TASK-CROP-09 |
| 关联 AC | AC-CROP-11, AC-CROP-12 |

**任务描述**：

重构裁剪控制面板，支持独立宽高输入和宽高比锁定。

**验证标准**：

1. 显示宽度和高度两个输入框
2. 显示宽高比锁定开关（锁图标）
3. 锁定时：修改一个值，另一个值按原图单元格比例自动计算
4. 解锁时：宽高可独立修改
5. 预设按钮改为常用尺寸组合（如 240×240、120×120）
6. 显示当前输出尺寸预览

**UI 设计**：

```
输出尺寸: [🔒] (锁定宽高比)
宽度: [  240  ] px
高度: [  240  ] px
预设: [240×240] [120×120] [自定义]
```

---

### TASK-CROP-11: App 状态管理更新

| 项目 | 内容 |
|------|------|
| 任务编号 | TASK-CROP-11 |
| 所属阶段 | 应用层 |
| 依赖任务 | TASK-CROP-10 |
| 关联 AC | AC-CROP-11 |

**任务描述**：

更新 App.tsx 状态管理，支持 `OutputSize`。

**验证标准**：

1. 状态从 `outputSize: number` 改为 `outputSize: OutputSize`
2. 传递正确的 props 给 CropControls
3. 裁剪功能正常工作

---

### TASK-CROP-12: 回归验证

| 项目 | 内容 |
|------|------|
| 任务编号 | TASK-CROP-12 |
| 所属阶段 | 测试 |
| 依赖任务 | TASK-CROP-05~11 |
| 关联 AC | 全部 |

**任务描述**：

运行所有测试，确保变更没有破坏原有功能。

**验证标准**：

1. `pnpm build` 成功
2. 所有单元测试通过
3. 手动测试：上传图片 → 裁剪 → 下载，全流程正常
4. 手动测试：宽高比锁定功能正常

---

## 新增 AC

| 编号 | 验收条件 | 优先级 |
|------|----------|--------|
| AC-CROP-11 | 输出尺寸支持独立设置宽高，输出非正方形图片 | P0 |
| AC-CROP-12 | 宽高比锁定开关：锁定时修改一个值自动计算另一个值 | P1 |

---

## 任务总览

| 任务编号 | 任务名称 | 依赖 |
|----------|----------|------|
| TASK-CROP-05 | 类型定义扩展 | TASK-CROP-01 |
| TASK-CROP-06 | 常量更新 | TASK-CROP-05 |
| TASK-CROP-07 | resizeImage 函数扩展 | TASK-CROP-05, TASK-CROP-06 |
| TASK-CROP-08 | cropSprite 函数扩展 | TASK-CROP-07 |
| TASK-CROP-09 | useSpriteCrop Hook 更新 | TASK-CROP-08 |
| TASK-CROP-10 | CropControls UI 重构 | TASK-CROP-09 |
| TASK-CROP-11 | App 状态管理更新 | TASK-CROP-10 |
| TASK-CROP-12 | 回归验证 | TASK-CROP-05~11 |

**关键路径**：TASK-CROP-05 → TASK-CROP-06 → TASK-CROP-07 → TASK-CROP-08 → TASK-CROP-09 → TASK-CROP-10 → TASK-CROP-11 → TASK-CROP-12
