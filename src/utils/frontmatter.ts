import { readFileSync } from 'fs';
import { basename, dirname } from 'path';
import matter from 'gray-matter';
import type { PostMeta } from '../types';

export async function parseFrontmatter(filePath: string): Promise<PostMeta> {
  const raw = readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);
  const slug = basename(dirname(filePath));

  return {
    title: data.title ?? 'Untitled',
    date: formatDate(data.date),
    category: data.category ?? '未分类',
    tags: Array.isArray(data.tags) ? data.tags : [],
    description: data.description ?? '',
    draft: data.draft === true,
    pinned: data.pinned === true,
    lineNumbers: data.lineNumbers === true,
    slug,
  };
}

function formatDate(d: unknown): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
  return String(d ?? '1970-01-01');
}
