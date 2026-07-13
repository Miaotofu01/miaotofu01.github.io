import './styles/tokens.css';
import './styles/global.css';
import './styles/code.css';
import { initThemeToggle } from './components/theme-toggle';
import { initSearch } from './components/site-search';
import { initCursorRing } from './components/cursor-ring';
import { initCursorTrail } from './components/cursor-trail';
import { initClickFlash } from './components/click-flash';
import { initMobileNav } from './components/mobile-nav';
import { initReadCounter } from './components/read-counter';
import { initScrollObserver } from './components/scroll-observer';
import './components/giscus-comment';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  initCursorRing();
  initCursorTrail();
  initClickFlash();
}

initThemeToggle();
initSearch();
initMobileNav();
initReadCounter();
initScrollObserver();
