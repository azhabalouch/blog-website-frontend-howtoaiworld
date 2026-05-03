import Link from 'next/link';

export const metadata = {
  title: 'Disclaimer - HowToAiWorld',
  description: 'Disclaimer for HowToAiWorld. Important information about the content on our website.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Disclaimer</h1>
        <div className="text-gray-500 mb-6">
          <time dateTime="2026-02-07">Effective Date: February 07, 2026</time>
        </div>
        <nav className="flex flex-wrap gap-4 border-b pb-4">
          <Link href="/legal/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link>
          <Link href="/legal/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</Link>
          <Link href="/legal/disclaimer" className="text-blue-600 font-medium">Disclaimer</Link>
        </nav>
      </div>
      
      <div className="prose max-w-none prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-4">
        <p>The information provided by Howtoaiworld ("we," "us," or "our") on https://www.howtoaiworld.com (the "Site") is for general informational and educational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.</p>
        
        <h3>1. Not Financial or Professional Advice</h3>
        <p><strong>This is the most important section of this Disclaimer.</strong></p>
        <p>The Site cannot and does not contain professional financial, legal, or business advice. The financial information (including crypto, stock market insights, insurance, and business strategies) is provided for general educational and informational purposes only and is not a substitute for professional advice.</p>
        <p>Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of financial advice. The use or reliance of any information contained on the Site is solely at your own risk.</p>
        
        <h3>2. Artificial Intelligence (AI) Disclaimer</h3>
        <p>The content on this website discusses Artificial Intelligence (AI) tools, software, and developments. Please be aware that:</p>
        <p><strong>Rapid Change:</strong> The AI landscape evolves daily. Tools, features, and pricing mentioned in our articles may change without notice.</p>
        <p><strong>Accuracy of AI:</strong> When we discuss using AI for tasks (such as writing or coding), remember that AI models can "hallucinate" or produce factual errors. You should always verify AI-generated output.</p>
        <p><strong>No Guarantees:</strong> We do not guarantee that any specific AI tool discussed will achieve a specific result for your business.</p>
        
        <h3>3. Affiliate Disclosure</h3>
        <p>This Site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links.</p>
        <p>We participate in various affiliate programs, and we may earn a commission from qualifying purchases. This comes at no extra cost to you. Our editorial content is not influenced by advertisers or affiliate partnerships.</p>
        
        <h3>4. External Links Disclaimer</h3>
        <p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>
        <p>We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the Site. We will not be a party to or in any way be responsible for monitoring any transaction between you and third-party providers of products or services.</p>
        
        <h3>5. Earnings Disclaimer</h3>
        <p>From time to time, we may report on the success of one of our existing or prior strategies/products or the success of others (e.g., "How to use AI for Affiliate Marketing"). The information about this success is accurately portrayed. You acknowledge that your prior success, or the success of others, does not guarantee your success.</p>
        <p>As with any business arrangement, your results may vary and will be based on your individual capacity, business experience, expertise, and level of desire. There are no guarantees concerning the level of success you may experience.</p>
        
        <h3>6. Errors and Omissions</h3>
        <p>While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, Howtoaiworld is not responsible for any errors or omissions, or for the results obtained from the use of this information. All information in this site is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information.</p>
        
        <h3>7. Contact Us</h3>
        <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at privacy@howtoaiworld.com.</p>
      </div>
    </div>
  );
}