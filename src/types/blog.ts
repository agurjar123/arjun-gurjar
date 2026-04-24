export type BlogMeta = {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  slug: string;
};

export type BlogPost = BlogMeta & {
  content: string;
};
