export function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement;
        const siblings = Array.from(target.parentElement!.children).filter(c => c.classList.contains('animate-in'));
        const index = siblings.indexOf(target);
        setTimeout(() => { target.style.animationPlayState = 'running'; }, index * 40);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(el => {
    (el as HTMLElement).style.animationPlayState = 'paused';
    observer.observe(el);
  });
}
