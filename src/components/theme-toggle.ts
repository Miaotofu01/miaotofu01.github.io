export function initThemeToggle() {
  const btn = document.getElementById('theme-btn');
  if (!btn) return;

  const html = document.documentElement;
  const darkIcon = document.getElementById('theme-icon-dark')!;
  const lightIcon = document.getElementById('theme-icon-light')!;

  const saved = localStorage.getItem('theme');
  const current = saved ?? 'dark';
  html.setAttribute('data-theme', current);
  updateIcons(current);

  function updateIcons(theme: string) {
    darkIcon.style.display = theme === 'dark' ? '' : 'none';
    lightIcon.style.display = theme === 'dark' ? 'none' : '';
  }

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcons(next);
    const giscus = document.querySelector('giscus-comments') as any;
    if (giscus?.updateTheme) giscus.updateTheme(next);
  });
}
