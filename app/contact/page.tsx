export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-4xl font-bold">Contact Us</h1>
      <p className="text-gray-600">We'd love to hear from you! Fill out the form below and our team will get back to you soon.</p>
      
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl">
        <form action="https://api.web3forms.com/submit" method="POST" className="space-y-4">
          <input type="hidden" name="access_key" value="62765342-bb78-41ba-8e76-7d7a8b5b8bb0" />
          <input type="hidden" name="redirect" value="https://howtoaiworld.com/thanks.html" />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Name</label>
            <input type="text" name="name" id="name" className="w-full border border-gray-300 rounded-md px-4 py-2" placeholder="Your Name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
            <input type="email" name="email" id="email" className="w-full border border-gray-300 rounded-md px-4 py-2" placeholder="you@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">Message</label>
            <textarea name="message" id="message" rows={5} className="w-full border border-gray-300 rounded-md px-4 py-2" placeholder="Type your message here..." required></textarea>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700">Send Message</button>
        </form>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Send Direct Email</h2>
          <p className="text-gray-600 mt-2">You can also reach us directly at <a href="mailto:contact@howtoaiworld.com" className="text-blue-600 hover:underline">contact@howtoaiworld.com</a></p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Our Office</h2>
          <p className="text-gray-600 mt-2">
            208-A, Basement Commercial Zone Sector C Chambelli Block G/F Bahria Town,<br />
            Lahore, 53720<br />
            Pakistan
          </p>            
        </div>
      </div>
    </div>
  );
}
