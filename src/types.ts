export interface PostMeta {
  title: string;
  date: string;
  category: string;
  tags: string[];
  description: string;
  draft: boolean;
  pinned: boolean;
  lineNumbers: boolean;
  slug: string;
}

export interface Post extends PostMeta {
  content: string;
  readingTime: number;
}

export interface Friend {
  name: string;
  description: string;
  url: string;
  avatar: string;
}

export interface GiscusConfig {
  repo: string;
  repoId: string;
  categoryId: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  author: {
    name: string;
    email: string;
    github: string;
  };
  friends: Friend[];
  giscus: GiscusConfig;
  defaultTheme: 'dark' | 'light';
  postsPerPage: number;
}

export interface SearchIndexItem {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  date: string;
  description: string;
}

export interface TagCount {
  name: string;
  count: number;
}

export interface CategoryInfo {
  name: string;
  count: number;
  recentPosts: PostMeta[];
}
