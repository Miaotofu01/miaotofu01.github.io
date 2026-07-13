import { siteConfig } from '../config';

interface BaseOptions {
  title: string;
  content: string;
  description?: string;
  isHome?: boolean;
}

export function renderBase({ title, content, description, isHome }: BaseOptions): string {
  const desc = description ?? siteConfig.description;
  const theme = siteConfig.defaultTheme;
  const bodyClass = isHome ? 'home' : '';

  return `<!DOCTYPE html>
<html lang="zh-CN" data-theme="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeH(title)} - ${escapeH(siteConfig.title)}</title>
  <meta name="description" content="${escapeH(desc)}">
  <meta property="og:title" content="${escapeH(title)}">
  <meta property="og:description" content="${escapeH(desc)}">
  <meta property="og:url" content="${siteConfig.url}">
  <meta property="og:type" content="${isHome ? 'website' : 'article'}">
  <meta property="og:image" content="${siteConfig.url}/og-image.png">
  <meta name="twitter:card" content="summary">
  <link rel="alternate" type="application/atom+xml" title="${escapeH(siteConfig.title)} RSS" href="/feed.xml">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/main.css">
</head>
<body class="${bodyClass}">
  <canvas class="cursor-canvas" id="cursor-canvas" aria-hidden="true"></canvas>
  <div class="global-cursor" id="global-cursor" aria-hidden="true"></div>

  <nav>
    <div class="nav-inner">
      <a href="/" class="nav-brand">
        <span class="nav-brand-dot"></span>
        ${escapeH(siteConfig.title)}
      </a>
      <ul class="nav-links" id="nav-links">
        <li><a href="/posts/">文章</a></li>
        <li><a href="/categories/">分类</a></li>
        <li><a href="/tags/">标签</a></li>
        <li><a href="/posts/">归档</a></li>
        <li><a href="/friends/">友链</a></li>
      </ul>
      <div class="nav-links" style="gap:8px">
        <button class="nav-icon-btn" id="search-btn" title="搜索">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
        <button class="nav-icon-btn" id="theme-btn" title="切换主题">
          <svg id="theme-icon-dark" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg id="theme-icon-light" viewBox="0 0 24 24" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>
        <button class="hamburger-btn" id="hamburger-btn" title="菜单">
          <svg viewBox="0 0 24 24" width="22" height="22"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>
  </nav>

  ${content}

  <footer>
    <p>© ${new Date().getFullYear()} ${escapeH(siteConfig.author.name)} · <a href="/feed.xml">RSS</a> · Powered by Vite + lit-html</p>
  </footer>

  <div id="search-root"></div>
  <div id="mobile-nav-root"></div>

  <script type="module" src="/assets/main.js"></script>
</body>
</html>`;
}

export function escapeH(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
