/**
 * Scroll reveal — osu! style entrance animations.
 * Uses CSS transitions (not animations) matching the reference implementation.
 * Each .reveal element gets a staggered transition-delay based on sibling index.
 */
export function initScrollObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
  );

  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    const siblings = el.parentElement?.querySelectorAll('.reveal');
    if (siblings) {
      const index = Array.prototype.indexOf.call(siblings, el);
      (el as HTMLElement).style.transitionDelay = (index * 40) + 'ms';
    }
    observer.observe(el);
  });
}
