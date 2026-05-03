import cacheData from "../data/cache.json";

export type BlogRecord = {
  title: string;
  author: string;
  category?: string;
  date?: string;
  excerpt?: string;
  keywords?: string[];
  featured_image?: string;
  content_images?: string[];
  captions?: string;
  content?: string;
  faq?: Array<{ question: string; answer: string }>;
};

export type AuthorProfile = {
  name: string;
  slug: string;
  postCount: number;
  categories: string[];
  blogs: BlogRecord[];
  latestBlog?: BlogRecord;
  featuredImage?: string;
  initials: string;
  bio: string;
};

export function generateSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export function getBlogs(): BlogRecord[] {
  return ((cacheData as { blogs?: BlogRecord[] }).blogs || []).slice();
}

export function getBlogBySlug(slug: string) {
  return getBlogs().find((blog) => generateSlug(blog.title) === slug);
}

export function getCategories() {
  const categoryMap = new Map<string, number>();

  getBlogs().forEach((blog) => {
    const parts = (blog.category || "")
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);

    parts.forEach((part) => {
      categoryMap.set(part, (categoryMap.get(part) || 0) + 1);
    });
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count, slug: generateSlug(name) }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
}

export function getAuthors(): AuthorProfile[] {
  const authorMap = new Map<string, BlogRecord[]>();

  getBlogs().forEach((blog) => {
    const authorName = blog.author || "Unknown Author";
    const authorBlogs = authorMap.get(authorName) || [];
    authorBlogs.push(blog);
    authorMap.set(authorName, authorBlogs);
  });

  return Array.from(authorMap.entries())
    .map(([name, blogs]) => {
      const sortedBlogs = blogs.slice().sort((left, right) => {
        const leftTime = left.date ? new Date(left.date).getTime() : 0;
        const rightTime = right.date ? new Date(right.date).getTime() : 0;
        return rightTime - leftTime;
      });

      const categories = Array.from(
        new Set(
          sortedBlogs.flatMap((blog) =>
            (blog.category || "")
              .split("/")
              .map((part) => part.trim())
              .filter(Boolean)
          )
        )
      );

      const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase() || "")
        .slice(0, 2)
        .join("") || "A";

      return {
        name,
        slug: generateSlug(name),
        postCount: sortedBlogs.length,
        categories,
        blogs: sortedBlogs,
        latestBlog: sortedBlogs[0],
        featuredImage: sortedBlogs[0]?.featured_image,
        initials,
        bio: `${name} contributes ${sortedBlogs.length} article${sortedBlogs.length === 1 ? "" : "s"} across ${categories.slice(0, 2).join(" and ") || "our core topics"}.`,
      };
    })
    .sort((left, right) => right.postCount - left.postCount || left.name.localeCompare(right.name));
}

export function getAuthorBySlug(slug: string) {
  return getAuthors().find((author) => author.slug === slug);
}