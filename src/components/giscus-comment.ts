import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('giscus-comments')
export class GiscusComments extends LitElement {
  @property() repo = '';
  @property() repoid = '';
  @property() categoryid = '';
  @property() term = '';

  private loaded = false;
  private observer: IntersectionObserver | null = null;

  createRenderRoot() { return this; }

  firstUpdated() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !this.loaded) this.loadGiscus();
    }, { rootMargin: '200px' });
    this.observer.observe(this);
  }

  disconnectedCallback() { this.observer?.disconnect(); }

  loadGiscus() {
    if (this.loaded || !this.repoid) return;
    this.loaded = true;
    const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark_dimmed';
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', this.repo);
    script.setAttribute('data-repo-id', this.repoid);
    script.setAttribute('data-category-id', this.categoryid);
    script.setAttribute('data-category', 'Comments');
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', this.term);
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    this.appendChild(script);
  }

  updateTheme(theme: string) {
    const iframe = this.querySelector('iframe.giscus-frame') as HTMLIFrameElement | null;
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: theme === 'light' ? 'light' : 'dark_dimmed' } } },
        'https://giscus.app'
      );
    }
  }

  render() { return html`<div class="giscus"></div>`; }
}
