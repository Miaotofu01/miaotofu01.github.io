---
title: "C++ 模板元编程笔记"
date: 2026-07-10
category: 算法
tags: [C++, 模板]
description: "从 SFINAE 到 concept，模板元编程的现代 C++ 写法总结。"
draft: false
lineNumbers: true
---
# C++ 模板元编程笔记

## SFINAE 基础

Substitution Failure Is Not An Error — 替换失败不是错误。

```cpp
template<typename T>
auto foo(T t) -> decltype(t.bar()) {
    return t.bar();
}
```

## C++20 Concepts

```cpp
template<typename T>
concept Hashable = requires(T t) {
    { std::hash<T>{}(t) } -> std::convertible_to<std::size_t>;
};
```

Concepts 比 SFINAE 清晰太多，编译错误也友好很多。
