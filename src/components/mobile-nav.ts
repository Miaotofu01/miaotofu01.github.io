import { html, render } from 'lit';

export function initMobileNav() {
  const btn = document.getElementById('hamburger-btn');
  const root = document.getElementById('mobile-nav-root')!;
  if (!btn) return;

  btn.addEventListener('click', () => {
    const navLinks = document.getElementById('nav-links')!.cloneNode(true) as HTMLElement;
    render(html`
      <div class="mobile-nav-overlay" @click=${close}></div>
      <div class="mobile-nav-panel">
        ${Array.from(navLinks.querySelectorAll('li a')).map(a => {
          const el = a as HTMLAnchorElement;
          return html`<a href="${el.getAttribute('href')}" @click=${close}>${el.textContent}</a>`;
        })}
      </div>
    `, root);
  });
}

function close() { const root = document.getElementById('mobile-nav-root')!; render(null, root); }
