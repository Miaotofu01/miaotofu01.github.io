import { readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parseFrontmatter } from '../src/utils/frontmatter';
import { renderMarkdown } from '../src/utils/markdown';
import { generateRSS } from '../src/utils/rss';
import { siteConfig } from '../src/config';
import { renderPostPage } from '../src/layouts/post';
import {
  renderHomePage,
  renderCategoriesPage,
  renderCategoryDetailPage,
  renderTagsPage,
  renderTagDetailPage,
  renderArchivePage,
  renderFriendsPage,
  render404Page,
} from '../src/layouts/pages';
import type { Post, PostMeta, CategoryInfo, TagCount, SearchIndexItem } from '../src/types';

const CONTENT_DIR = join(process.cwd(), 'content');
const DIST_DIR = join(process.cwd(), 'dist');
const PUBLIC_DIR = join(process.cwd(), 'public');

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function writePage(dir: string, html: string) {
  ensureDir(dir);
  writeFileSync(join(dir, 'index.html'), html);
}

function estimateReadingTime(text: string): number {
  const cleaned = text.replace(/```[\s\S]*?```/g, '').replace(/[#*>\-|`~\[\]()]/g, '');
  const chars = cleaned.replace(/\s/g, '').length;
  return Math.max(1, Math.ceil(chars / 400));
}

async function main() {
  console.log('🔨 Building blog...\n');
  ensureDir(DIST_DIR);

  // 1. Scan content
  const postFiles: string[] = [];
  function scanDir(dir: string) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) scanDir(join(dir, entry.name));
      else if (entry.name === 'index.md') postFiles.push(join(dir, entry.name));
    }
  }
  scanDir(CONTENT_DIR);

  // 2. Parse frontmatter
  const allMeta: PostMeta[] = [];
  for (const file of postFiles) {
    const meta = await parseFrontmatter(file);
    allMeta.push(meta);
  }

  const published = allMeta.filter(p => !p.draft);
  published.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.date.localeCompare(a.date);
  });

  console.log(`  📄 ${published.length} published posts`);

  // 3. Render posts
  const renderedPosts: Post[] = [];
  for (const meta of published) {
    const filePath = join(CONTENT_DIR, meta.slug, 'index.md');
    if (!existsSync(filePath)) continue;

    const raw = readFileSync(filePath, 'utf-8');
    const bodyOnly = raw.replace(/^---[\s\S]*?---\n?/, '');
    const { dark } = await renderMarkdown(bodyOnly, meta.lineNumbers);
    const readingTime = estimateReadingTime(bodyOnly);

    const post: Post = { ...meta, content: dark, readingTime };
    renderedPosts.push(post);

    const postDir = join(DIST_DIR, 'posts', meta.slug);
    const index = published.indexOf(meta);
    const prev = index > 0 ? published[index - 1] : undefined;
    const next = index < published.length - 1 ? published[index + 1] : undefined;
    const prevInfo = prev ? { title: prev.title, slug: prev.slug } : undefined;
    const nextInfo = next ? { title: next.title, slug: next.slug } : undefined;
    const html = renderPostPage(post, prevInfo, nextInfo);
    writePage(postDir, html);

    // Copy post assets
    const postAssetsDir = join(CONTENT_DIR, meta.slug);
    for (const f of readdirSync(postAssetsDir)) {
      if (f === 'index.md') continue;
      const src = join(postAssetsDir, f);
      const destDir = join(DIST_DIR, 'posts', meta.slug);
      ensureDir(destDir);
      copyFileSync(src, join(destDir, f));
    }
  }

  // 4. Compute categories, tags
  const catMap = new Map<string, PostMeta[]>();
  const tagMap = new Map<string, PostMeta[]>();
  for (const p of published) {
    if (!catMap.has(p.category)) catMap.set(p.category, []);
    catMap.get(p.category)!.push(p);
    for (const t of p.tags) {
      if (!tagMap.has(t)) tagMap.set(t, []);
      tagMap.get(t)!.push(p);
    }
  }

  const categories: CategoryInfo[] = [...catMap.entries()].map(([name, posts]) => ({
    name,
    count: posts.length,
    recentPosts: posts.slice(0, 3),
  }));

  const tagCounts: TagCount[] = [...tagMap.entries()].map(([name, posts]) => ({
    name,
    count: posts.length,
  })).sort((a, b) => b.count - a.count);

  // 5. Home page
  const pinned = published.filter(p => p.pinned).slice(0, 3);
  const recent = published.filter(p => !p.pinned).slice(0, 6);
  const homeHtml = renderHomePage(pinned, recent, tagCounts, siteConfig);
  writePage(DIST_DIR, homeHtml);

  // 6. Category pages
  writePage(join(DIST_DIR, 'categories'), renderCategoriesPage(categories, siteConfig));
  for (const [name, posts] of catMap) {
    writePage(join(DIST_DIR, 'categories', name), renderCategoryDetailPage(name, posts, siteConfig));
  }

  // 7. Tag pages
  const catNames = [...catMap.keys()];
  writePage(join(DIST_DIR, 'tags'), renderTagsPage(catNames, tagCounts, published, siteConfig));
  for (const [name, posts] of tagMap) {
    writePage(join(DIST_DIR, 'tags', name), renderTagDetailPage(name, posts, siteConfig));
  }

  // 8. Archive page
  const yearGroups = new Map<number, PostMeta[]>();
  for (const p of published) {
    const year = parseInt(p.date.slice(0, 4));
    if (!yearGroups.has(year)) yearGroups.set(year, []);
    yearGroups.get(year)!.push(p);
  }
  writePage(join(DIST_DIR, 'posts'), renderArchivePage(yearGroups, siteConfig));

  // 9. Friends page
  writePage(join(DIST_DIR, 'friends'), renderFriendsPage(siteConfig));

  // 10. 404 page
  writeFileSync(join(DIST_DIR, '404.html'), render404Page(siteConfig));

  // 11. RSS
  const rss = generateRSS(published, siteConfig);
  writeFileSync(join(DIST_DIR, 'feed.xml'), rss);

  // 12. Search index
  const searchIndex: SearchIndexItem[] = published.map(p => ({
    title: p.title,
    slug: p.slug,
    category: p.category,
    tags: p.tags,
    date: p.date,
    description: p.description,
  }));
  writeFileSync(join(DIST_DIR, 'search-index.json'), JSON.stringify(searchIndex));

  // 13. Copy public assets
  if (existsSync(PUBLIC_DIR)) {
    function copyDir(srcDir: string, destDir: string) {
      ensureDir(destDir);
      for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
        const src = join(srcDir, entry.name);
        const dest = join(destDir, entry.name);
        if (entry.isDirectory()) {
          copyDir(src, dest);
        } else if (entry.isFile()) {
          copyFileSync(src, dest);
        }
      }
    }
    copyDir(PUBLIC_DIR, DIST_DIR);
  }

  console.log('  ✅ Build complete');
  console.log(`     Posts: ${renderedPosts.length}`);
  console.log(`     Categories: ${categories.length}`);
  console.log(`     Tags: ${tagCounts.length}`);
}

main().catch(err => { console.error(err); process.exit(1); });
