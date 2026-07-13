import { Marked } from 'marked';
import { createHighlighter } from 'shiki';

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['cpp', 'python', 'javascript', 'typescript', 'css', 'html', 'bash', 'json', 'yaml', 'markdown', 'text', 'java', 'rust', 'go', 'c', 'sql', 'lua', 'ruby', 'php'],
    });
  }
  return highlighter;
}

function extractLang(lang?: string): string {
  if (!lang) return 'text';
  const alias: Record<string, string> = {
    cpp: 'cpp', cc: 'cpp', cxx: 'cpp', c: 'c',
    py: 'python', js: 'javascript', ts: 'typescript',
    sh: 'bash', shell: 'bash', yml: 'yaml',
    rs: 'rust', rb: 'ruby', md: 'markdown',
  };
  return alias[lang] ?? lang;
}

function buildCodeBlock(code: string, lang: string, dark: string, light: string, lineNumbers: boolean): string {
  const langDisplay = lang === 'text' ? '' : lang.toUpperCase();

  const codeContent = (highlighted: string) => {
    if (!lineNumbers) return highlighted;
    const lines = highlighted.split('\n');
    if (lines.length > 1 && lines[lines.length - 1]?.trim() === '') lines.pop();
    return lines.map((line, i) => {
      const num = i + 1;
      return `<span class="line-number">${num}</span><span class="line-content">${line}</span>`;
    }).join('\n');
  };

  return `
<div class="code-block">
  <div class="code-block-header">
    <span class="code-block-lang">${langDisplay}</span>
    <button class="code-block-copy" onclick="
      var block = this.closest('.code-block');
      var code = block.querySelector('code').innerText;
      navigator.clipboard.writeText(code).then(function() {
        this.textContent = '\\u2713';
        this.classList.add('copied');
        var self = this;
        setTimeout(function() { self.textContent = '\\u{1F4CB}'; self.classList.remove('copied'); }, 1500);
      }.bind(this));
    ">📋</button>
  </div>
  <div class="code-block-body">
    <pre class="code-dark"><code>${codeContent(dark)}</code></pre>
    <pre class="code-light"><code>${codeContent(light)}</code></pre>
  </div>
</div>`;
}

export async function renderMarkdown(raw: string, lineNumbers = false): Promise<{ dark: string; light: string }> {
  const hl = await getHighlighter();

  const renderer = {
    code(code: string, lang?: string) {
      const l = extractLang(lang);
      const dark = hl.codeToHtml(code, { lang: l, theme: 'github-dark' });
      const light = hl.codeToHtml(code, { lang: l, theme: 'github-light' });
      const extractCode = (html: string) => {
        const match = html.match(/<code[^>]*>([\s\S]*)<\/code>/);
        return match ? (match[1] ?? '') : html;
      };
      return buildCodeBlock(code, l, extractCode(dark), extractCode(light), lineNumbers);
    },
  };

  const marked = new Marked();
  marked.use({ renderer });

  const html = await marked.parse(raw);
  return { dark: html, light: html };
}
