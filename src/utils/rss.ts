import type { PostMeta, SiteConfig } from '../types';

export function generateRSS(posts: PostMeta[], config: SiteConfig): string {
  const items = posts.slice(0, 20).map(p => {
    const url = `${config.url}/posts/${p.slug}/`;
    const date = new Date(p.date).toISOString();
    return `  <entry>
    <title>${escapeXml(p.title)}</title>
    <link href="${escapeXml(url)}"/>
    <id>${escapeXml(url)}</id>
    <published>${date}</published>
    <updated>${date}</updated>
    <summary>${escapeXml(p.description)}</summary>
    <category term="${escapeXml(p.category)}"/>
    ${p.tags.map(t => `<category term="${escapeXml(t)}"/>`).join('\n    ')}
  </entry>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(config.title)}</title>
  <subtitle>${escapeXml(config.description)}</subtitle>
  <link href="${escapeXml(config.url)}/feed.xml" rel="self"/>
  <link href="${escapeXml(config.url)}/"/>
  <id>${escapeXml(config.url)}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>${escapeXml(config.author.name)}</name>
    <email>${escapeXml(config.author.email)}</email>
  </author>
${items}
</feed>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
