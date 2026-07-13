import { html, render } from 'lit';
import type { SearchIndexItem } from '../types';

let searchData: SearchIndexItem[] | null = null;
let selectedIndex = -1;
let currentResults: SearchIndexItem[] = [];

export function initSearch() {
  const btn = document.getElementById('search-btn');
  if (!btn) return;
  const root = document.getElementById('search-root')!;

  btn.addEventListener('click', openSearch);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.children.length > 0) closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });
}

async function openSearch() {
  if (!searchData) {
    try {
      const res = await fetch('/search-index.json');
      searchData = (await res.json()) as SearchIndexItem[];
    } catch { searchData = []; }
  }
  selectedIndex = -1;
  currentResults = [];
  const root = document.getElementById('search-root')!;
  renderSearchPanel(root, '', []);
  setTimeout(() => { (document.getElementById('search-input') as HTMLInputElement)?.focus(); }, 50);
}

function closeSearch() { const root = document.getElementById('search-root')!; render(null, root); }

function filterResults(query: string): SearchIndexItem[] {
  if (!searchData || !query.trim()) return [];
  const keywords = query.trim().toLowerCase().split(/\s+/);
  return searchData.filter(item => {
    const haystack = [item.title, item.description, item.category, ...item.tags].join(' ').toLowerCase();
    return keywords.every(kw => haystack.includes(kw));
  }).slice(0, 10);
}

function renderSearchPanel(rootEl: HTMLElement, query: string, results: SearchIndexItem[]) {
  const resultsHtml = results.length === 0 && query.length > 0
    ? html`<div class="search-empty">没有找到关于「${query}」的文章</div>`
    : results.map((r, i) => html`
        <a href="/posts/${r.slug}/"
           class="search-result-item ${i === selectedIndex ? 'selected' : ''}"
           @mouseenter=${() => { selectedIndex = i; renderSearchPanel(rootEl, query, results); }}
           @click=${closeSearch}>
          <div>${highlightMatch(r.title, query)}</div>
          <div class="search-result-meta">${r.category} · ${r.date}</div>
        </a>`);

  render(html`
    <div class="search-overlay" @click=${closeSearch}>
      <div class="search-panel" @click=${(e: Event) => e.stopPropagation()}>
        <input id="search-input" class="search-input" type="text" placeholder="搜索文章…"
               .value=${query}
               @input=${(e: InputEvent) => {
                 const q = (e.target as HTMLInputElement).value;
                 currentResults = filterResults(q);
                 selectedIndex = -1;
                 renderSearchPanel(rootEl, q, currentResults);
               }}
               @keydown=${(e: KeyboardEvent) => {
                 if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, results.length - 1); renderSearchPanel(rootEl, query, results); }
                 if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, -1); renderSearchPanel(rootEl, query, results); }
                 if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
                   window.location.href = `/posts/${results[selectedIndex]!.slug}/`;
                 }
                 if (e.key === 'Escape') closeSearch();
               }}>
        <div class="search-results">${resultsHtml}</div>
      </div>
    </div>
  `, rootEl);
}

function highlightMatch(text: string, query: string): ReturnType<typeof html> {
  if (!query.trim()) return html`${text}`;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return html`${parts.map(p =>
    p.toLowerCase() === query.toLowerCase() ? html`<mark>${p}</mark>` : p
  )}`;
}
