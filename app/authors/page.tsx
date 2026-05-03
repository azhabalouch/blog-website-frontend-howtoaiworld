import Link from "next/link";
import { getAuthors } from "../../lib/site-data";

export default function AuthorsPage() {
  const authors = getAuthors();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Our Authors</h1>
        <p className="text-gray-600 mt-2">All author profiles are generated from the live blog dataset.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {authors.map((author) => (
          <Link key={author.slug} href={`/authors/${author.slug}`} className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition">
            <div className="w-24 h-24 bg-blue-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">{author.initials}</div>
            <h3 className="font-bold text-lg mb-1">{author.name}</h3>
            <p className="text-blue-600 text-sm font-medium mb-3">{author.postCount} article{author.postCount === 1 ? "" : "s"}</p>
            <p className="text-gray-600 text-sm">{author.bio}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}