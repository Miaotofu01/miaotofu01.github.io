export function initReadCounter() {
  const el = document.querySelector('.read-count') as HTMLElement | null;
  if (!el) return;
  const slug = el.dataset.slug;
  if (!slug) return;
  const key = `read-count:${slug}`;
  const current = parseInt(localStorage.getItem(key) || '0', 10) + 1;
  localStorage.setItem(key, String(current));
  const eyeSvg = '<svg class="icon-xs" viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  el.innerHTML = `${eyeSvg} ${current} 次阅读`;
}
