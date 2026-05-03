export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-4xl font-bold">Contact</h1>
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" className="w-full border border-gray-300 rounded-md px-4 py-2" placeholder="Your Name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded-md px-4 py-2" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea rows={4} className="w-full border border-gray-300 rounded-md px-4 py-2" placeholder="How can we help?"></textarea>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700">Send Message</button>
        </form>
      </div>
    </div>
  );
}
