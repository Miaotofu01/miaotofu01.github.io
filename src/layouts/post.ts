import { renderBase, escapeH } from './base';
import type { Post } from '../types';
import { siteConfig } from '../config';

export function renderPostPage(post: Post, prevPost?: { title: string; slug: string }, nextPost?: { title: string; slug: string }): string {
  const tagsHtml = post.tags.map(t =>
    `<a href="/tags/${encodeURIComponent(t)}/" class="tag-badge">${escapeH(t)}</a>`
  ).join('');

  const prevNav = prevPost
    ? `<a href="/posts/${prevPost.slug}/" class="post-nav-prev">← ${escapeH(prevPost.title)}</a>`
    : '<div></div>';
  const nextNav = nextPost
    ? `<a href="/posts/${nextPost.slug}/" class="post-nav-next">${escapeH(nextPost.title)} →</a>`
    : '<div></div>';

  const giscusHtml = siteConfig.giscus.repoId ? `
    <div class="comments-section">
      <giscus-comments
        repo="${siteConfig.giscus.repo}"
        repoid="${siteConfig.giscus.repoId}"
        categoryid="${siteConfig.giscus.categoryId}"
        term="${post.slug}"
      ></giscus-comments>
    </div>` : '';

  const content = `
<article>
  <header class="article-header">
    <h1 class="article-title">${escapeH(post.title)}</h1>
    <div class="article-meta">
      ${post.date} · <a href="/categories/${encodeURIComponent(post.category)}/">${escapeH(post.category)}</a> · ${post.readingTime} min read · <span class="read-count" data-slug="${post.slug}">👁 ...次阅读</span>
    </div>
    <div class="tag-badges">${tagsHtml}</div>
  </header>

  <hr class="section-divider">

  <div class="prose">
    ${post.content}
  </div>

  <hr class="section-divider">

  <nav class="post-nav">
    ${prevNav}
    ${nextNav}
  </nav>

  ${giscusHtml}
</article>`;

  return renderBase({ title: post.title, content, description: post.description });
}
