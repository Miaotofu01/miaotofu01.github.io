import './styles/tokens.css';
import './styles/global.css';
import './styles/code.css';
import { initThemeToggle } from './components/theme-toggle';
import { initSearch } from './components/site-search';
import { initCursorSystem } from './components/cursor-system';
import { initMobileNav } from './components/mobile-nav';
import { initReadCounter } from './components/read-counter';
import { initScrollObserver } from './components/scroll-observer';
import { initNavScroll } from './components/nav-scroll';
import './components/giscus-comment';

initCursorSystem();
initThemeToggle();
initSearch();
initMobileNav();
initReadCounter();
initScrollObserver();
initNavScroll();
