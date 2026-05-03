import Link from "next/link";
import Image from "next/image";
import { getAuthors } from "../../lib/site-data";

export default function AuthorsPage() {
  const authors = getAuthors();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Our Authors</h1>
        <p className="text-muted mt-2">Meet the talented writers behind our AI insights and guides.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {authors.map((author) => (
          <Link key={author.slug} href={`/authors/${author.slug}`} className="premium-card p-6 text-center hover:shadow-elevated transition-all">
            <div className="w-24 h-24 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold overflow-hidden shadow-premium">
              {author.featuredImage ? (
                <Image src={author.featuredImage} alt={author.name} width={96} height={96} className="object-cover w-full h-full" />
              ) : (
                author.initials
              )}
            </div>
            <h3 className="font-bold text-lg mb-1 text-foreground">{author.name}</h3>
            <p className="text-primary text-sm font-medium mb-3">{author.postCount} article{author.postCount === 1 ? "" : "s"}</p>
            <p className="text-muted text-sm">{author.bio}</p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {author.categories.slice(0, 3).map((cat) => (
                <span key={cat} className="text-[11px] font-semibold rounded-full bg-primary-light text-primary-dark px-2 py-1">{cat}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}