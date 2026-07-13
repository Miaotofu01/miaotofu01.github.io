export function initReadCounter() {
  const el = document.querySelector('.read-count') as HTMLElement | null;
  if (!el) return;
  const slug = el.dataset.slug;
  if (!slug) return;
  const key = `read-count:${slug}`;
  const current = parseInt(localStorage.getItem(key) || '0', 10) + 1;
  localStorage.setItem(key, String(current));
  el.textContent = `👁 ${current} 次阅读`;
}
