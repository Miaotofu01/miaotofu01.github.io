import { renderBase, escapeH } from './base';
import type { PostMeta, CategoryInfo, TagCount, SiteConfig } from '../types';

// Inline SVG icon helpers — no emoji, per design system
const iconPin = '<svg class="icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="none"/></svg>';
const iconEdit = '<svg class="icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const iconTag = '<svg class="icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="7" r="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
const iconLink = '<svg class="icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const iconFolder = '<svg class="icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const iconEye = '<svg class="icon-xs" viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
const iconArchive = '<svg class="icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8v13H3V8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 3h22v5H1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="10" y1="12" x2="14" y2="12" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

function tagBadges(tags: string[]): string {
  return tags.map(t => `<a href="/tags/${encodeURIComponent(t)}/" class="tag-badge">${escapeH(t)}</a>`).join('');
}

function postCardPinned(p: PostMeta): string {
  return `
<a href="/posts/${p.slug}/" class="post-card-pinned">
  <div class="pinned-badge">${iconPin} 置顶</div>
  <div class="post-title">${escapeH(p.title)}</div>
  <div class="post-meta">
    ${p.date} · <a href="/categories/${encodeURIComponent(p.category)}/">${escapeH(p.category)}</a>
  </div>
  <div class="post-excerpt">${escapeH(p.description)}</div>
  <div class="tag-badges">${tagBadges(p.tags)}</div>
</a>`;
}

function postCard(p: PostMeta): string {
  const excerpt = p.description.length > 80 ? p.description.slice(0, 80) + '…' : p.description;
  return `
<a href="/posts/${p.slug}/" class="post-card animate-in">
  <div class="post-title">${escapeH(p.title)}</div>
  <div class="post-meta">
    ${p.date} · <a href="/categories/${encodeURIComponent(p.category)}/">${escapeH(p.category)}</a>
  </div>
  <div class="post-excerpt">${escapeH(excerpt)}</div>
  <div class="tag-badges">${tagBadges(p.tags)}</div>
</a>`;
}

export function renderHomePage(
  pinned: PostMeta[],
  recent: PostMeta[],
  tagCounts: TagCount[],
  config: SiteConfig,
): string {
  const heroLinks = [
    `<a href="https://github.com/${config.author.github}" title="GitHub" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>`,
    `<a href="mailto:${config.author.email}" title="Email">
      <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" stroke-width="2"/></svg>
    </a>`,
    `<a href="/feed.xml" title="RSS">
      <svg viewBox="0 0 24 24"><path d="M4 11a9 9 0 0 1 9 9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 4a16 16 0 0 1 16 16" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/></svg>
    </a>`,
  ].join('\n');

  const pinnedHtml = pinned.length > 0 ? `
  <div class="pinned-posts">
    ${pinned.slice(0, 3).map(postCardPinned).join('')}
  </div>
  <hr class="section-divider">` : '';

  const tagsHtml = tagCounts.map(t => {
    let cls = 'tag-size-sm';
    if (t.count >= 10) cls = 'tag-size-lg';
    else if (t.count >= 5) cls = 'tag-size-md';
    return `<a href="/tags/${encodeURIComponent(t.name)}/" class="${cls}">${escapeH(t.name)}</a>`;
  }).join('');

  const friendsShow = config.friends.slice(0, 8);
  const friendsHtml = friendsShow.map(f =>
    `<div class="friend-item"><a href="${escapeH(f.url)}" target="_blank" rel="noopener">${escapeH(f.name)}</a><span>${escapeH(f.description)}</span></div>`
  ).join('');

  const content = `
<section class="hero" id="hero">
  <div class="hero-content">
    <img src="/avatar.png" alt="${escapeH(config.author.name)}" class="hero-avatar">
    <h1 class="hero-name">${escapeH(config.author.name)}</h1>
    <p class="hero-bio">${escapeH(config.description)}</p>
    <div class="hero-links">${heroLinks}</div>
  </div>
</section>

<hr class="section-divider">

${pinnedHtml}

<section class="section-header">
  <h2 class="section-title">${iconEdit} 最近文章</h2>
  <a href="/posts/" class="section-more">查看全部文章 &rarr;</a>
</section>

<div class="post-grid">
  ${recent.slice(0, 6).map(postCard).join('')}
</div>

<hr class="section-divider">

<div class="home-bottom">
  <div>
    <div class="section-title" style="margin-bottom:12px">${iconTag} 标签</div>
    <div class="tag-cloud">${tagsHtml}</div>
  </div>
  <div>
    <div class="section-title" style="margin-bottom:12px">${iconLink} 友链</div>
    <div class="friend-list">${friendsHtml}</div>
    ${config.friends.length > 8 ? `<a href="/friends/" class="section-more">更多友链 &rarr;</a>` : ''}
  </div>
</div>`;

  return renderBase({ title: config.title, content, description: config.description, isHome: true });
}

export function renderCategoriesPage(categories: CategoryInfo[], _config: SiteConfig): string {
  const cards = categories.map(c => `
    <a href="/categories/${encodeURIComponent(c.name)}/" class="cat-card">
      <div class="cat-card-name">${iconFolder} ${escapeH(c.name)}</div>
      <div class="cat-card-count">${c.count} 篇文章</div>
      <ul class="cat-card-posts">
        ${c.recentPosts.slice(0, 3).map(p => `<li>${escapeH(p.title)}</li>`).join('')}
      </ul>
    </a>`).join('');

  const content = `<div class="page-header"><h1 class="page-title">${iconFolder} 分类</h1></div>
<div class="cat-grid">${cards}</div>`;
  return renderBase({ title: '分类', content });
}

export function renderCategoryDetailPage(category: string, posts: PostMeta[], _config: SiteConfig): string {
  if (posts.length === 0) {
    return renderBase({ title: category, content: `<div class="page-header"><h1 class="page-title">${iconFolder} ${escapeH(category)}</h1></div><div class="empty-state">这个分类下还没有文章哦～</div>` });
  }
  const content = `<div class="page-header"><h1 class="page-title">${iconFolder} ${escapeH(category)} &middot; ${posts.length} 篇文章</h1></div>
<div class="post-grid">${posts.map(postCard).join('')}</div>`;
  return renderBase({ title: category, content });
}

export function renderTagsPage(categories: string[], tagCounts: TagCount[], allPosts: PostMeta[], _config: SiteConfig): string {
  const catFilter = ['全部', ...categories].map(c =>
    `<a href="#" class="cat-filter-link" data-cat="${escapeH(c)}">${escapeH(c)}</a>`
  ).join('');

  const tagItems = tagCounts.map(t => {
    let cls = 'tag-size-sm';
    if (t.count >= 10) cls = 'tag-size-lg';
    else if (t.count >= 5) cls = 'tag-size-md';
    return `<a href="/tags/${encodeURIComponent(t.name)}/" class="${cls}" data-tags="${escapeH(t.name)}">${escapeH(t.name)}</a>`;
  }).join('');

  const allPostsHtml = allPosts.length === 0
    ? '<div class="empty-state">还没有任何文章哦～</div>'
    : allPosts.map(p => `<div class="post-card-wrapper" data-category="${escapeH(p.category)}" data-tags="${p.tags.map(escapeH).join(',')}">${postCard(p)}</div>`).join('');

  const content = `<div class="page-header"><h1 class="page-title">${iconTag} 标签</h1></div>
<div class="cat-filter">${catFilter}</div>
<div class="tag-cloud" style="max-width:var(--container-max);margin:0 auto;padding:16px 24px;">${tagItems}</div>
<div class="post-grid" id="tag-post-grid">${allPostsHtml}</div>`;
  return renderBase({ title: '标签', content });
}

export function renderTagDetailPage(tag: string, posts: PostMeta[], _config: SiteConfig): string {
  if (posts.length === 0) {
    return renderBase({ title: tag, content: `<div class="page-header"><h1 class="page-title">${iconTag} ${escapeH(tag)}</h1></div><div class="empty-state">还没有关于「${escapeH(tag)}」的文章哦～</div>` });
  }
  const content = `<div class="page-header"><h1 class="page-title">${iconTag} ${escapeH(tag)} &middot; ${posts.length} 篇文章</h1></div>
<div class="post-grid">${posts.map(postCard).join('')}</div>`;
  return renderBase({ title: tag, content });
}

export function renderArchivePage(yearGroups: Map<number, PostMeta[]>, _config: SiteConfig): string {
  const years = [...yearGroups.keys()].sort((a, b) => b - a);
  const html = years.map(year => {
    const posts = yearGroups.get(year)!;
    const items = posts.map(p => `
      <li class="archive-item">
        <span class="archive-date">${p.date.slice(5)}</span>
        <a href="/posts/${p.slug}/" class="archive-title">${escapeH(p.title)}</a>
      </li>`).join('');
    return `<h2 class="archive-year">${year}</h2><ul class="archive-list">${items}</ul>`;
  }).join('');

  const content = `<div class="page-header"><h1 class="page-title">${iconArchive} 归档</h1></div><div class="archive">${html}</div>`;
  return renderBase({ title: '归档', content });
}

export function renderFriendsPage(config: SiteConfig): string {
  const cards = config.friends.map(f => `
    <a href="${escapeH(f.url)}" target="_blank" rel="noopener" class="friend-card">
      ${f.avatar ? `<img src="${escapeH(f.avatar)}" alt="" class="friend-card-avatar">` : ''}
      <div class="friend-card-name">${escapeH(f.name)}</div>
      <div class="friend-card-desc">${escapeH(f.description)}</div>
    </a>`).join('');

  const content = `<div class="page-header">
  <h1 class="page-title">${iconLink} 友链</h1>
  <p class="page-subtitle">一些常去的博客和站点</p>
</div>
<div class="friend-grid">${cards}</div>
<div class="empty-state" style="padding-top:0">想交换友链？<a href="mailto:${escapeH(config.author.email)}">Email 我～</a></div>`;
  return renderBase({ title: '友链', content });
}

export function render404Page(_config: SiteConfig): string {
  const content = `
<div class="page-404">
  <div class="page-404-face">(╯&deg;□&deg;）╯︵ ┻━┻</div>
  <h1 class="page-404-title">这个页面被小夜吃掉了</h1>
  <p class="page-404-desc">可能你输错了地址，也可能是我<br>在整理文件时不小心把它咽下去了&hellip;</p>
  <a href="/" class="page-404-home">&larr; 回首页</a>
  <p class="page-404-joke">（小夜的胃里还有空间，要不去别的地方转转？）</p>
</div>`;
  return renderBase({ title: '404', content });
}
