export default function AuthorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-4xl font-bold">Our Authors</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h3 className="font-bold text-lg mb-1">Muaaz Hassan</h3>
          <p className="text-blue-600 text-sm font-medium mb-3">AI Researcher</p>
          <p className="text-gray-600 text-sm">Tech enthusiast exploring AI in modern enterprise solutions.</p>
        </div>
      </div>
    </div>
  );
}