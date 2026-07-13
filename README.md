# 红豆的博客

个人博客，基于 Vite + TypeScript + lit-html 的 SSG。

## 本地开发

```bash
npm install
npm run dev       # Vite 开发服务器
npm run build     # 完整构建
npm test          # 运行测试
```

## 写文章

在 `content/<slug>/index.md` 创建 Markdown 文件：

```yaml
---
title: "文章标题"
date: 2026-07-13
category: 算法
tags: [图论, 最短路]
description: "文章摘要"
draft: false
pinned: false
lineNumbers: false
---
```

## 部署

Push 到 `main` 分支，GitHub Actions 自动部署到 GitHub Pages。
