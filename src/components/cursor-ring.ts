export function initCursorRing() {
  const cursor = document.getElementById('global-cursor')!;
  const hero = document.getElementById('hero');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  document.addEventListener('mousedown', () => cursor.classList.add('pressing'));
  document.addEventListener('mouseup', () => cursor.classList.remove('pressing'));

  function updateHeroState() {
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const inHero = mouseX >= rect.left && mouseX <= rect.right &&
                   mouseY >= rect.top && mouseY <= rect.bottom;
    cursor.classList.toggle('in-hero', inHero);
  }

  function animate() {
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    updateHeroState();
    requestAnimationFrame(animate);
  }

  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  cursorX = mouseX;
  cursorY = mouseY;
  requestAnimationFrame(animate);
}
