/**
 * Nav scroll background — transparent at top, frosted glass on scroll.
 */
export function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      nav.style.background = 'rgba(22, 27, 34, 0.94)';
      nav.style.backdropFilter = 'blur(12px)';
    } else {
      nav.style.background = '';
      nav.style.backdropFilter = '';
    }
  });
}
