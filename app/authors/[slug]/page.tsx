import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthorBySlug, getAuthors, generateSlug } from "../../../lib/site-data";

export function generateStaticParams() {
  return getAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    return { title: "Author Not Found - Howtoaiworld" };
  }

  return {
    title: `${author.name} - Howtoaiworld`,
    description: author.bio,
  };
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <section className="bg-white rounded-xl shadow-sm p-8 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center text-4xl font-bold mx-auto md:mx-0">
          {author.featuredImage ? (
            <Image src={author.featuredImage} alt={author.name} width={160} height={160} className="object-cover w-full h-full" />
          ) : (
            author.initials
          )}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Author Profile</p>
          <h1 className="text-4xl font-bold mt-1">{author.name}</h1>
          <p className="text-gray-600 mt-3">{author.bio}</p>
          <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-gray-100">{author.postCount} posts</span>
            {author.categories.slice(0, 4).map((category) => (
              <span key={category} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700">{category}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {author.blogs.map((blog) => (
            <Link key={blog.title} href={`/blogs/${generateSlug(blog.title)}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
              <div className="relative h-44">
                <Image src={blog.featured_image || "https://placehold.co/600x400"} alt={blog.title} fill className="object-cover" />
              </div>
              <div className="p-5 space-y-3">
                <div className="text-xs font-semibold uppercase text-blue-600">{blog.category || "Category"}</div>
                <h3 className="font-bold text-lg leading-tight">{blog.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{blog.excerpt}</p>
                <div className="text-xs text-gray-500">{blog.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}