export function initClickFlash() {
  document.addEventListener('click', (e) => {
    const hero = document.getElementById('hero');
    const inHero = hero &&
      e.clientX >= hero.getBoundingClientRect().left &&
      e.clientX <= hero.getBoundingClientRect().right &&
      e.clientY >= hero.getBoundingClientRect().top &&
      e.clientY <= hero.getBoundingClientRect().bottom;

    const flash = document.createElement('div');
    flash.className = 'click-flash';
    flash.style.left = e.clientX + 'px';
    flash.style.top = e.clientY + 'px';
    document.body.appendChild(flash);
    flash.addEventListener('animationend', () => flash.remove());

    if (inHero) {
      const ripple = document.createElement('div');
      ripple.className = 'click-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      document.body.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    }
  });
}
