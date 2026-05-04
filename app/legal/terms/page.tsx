import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - HowToAiWorld',
  description: 'Terms of Service for HowToAiWorld. Read our terms and conditions for using our website.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Terms of Service</h1>
        <div className="text-muted mb-6">
          <time dateTime="2026-02-07">Effective Date: February 07, 2026</time>
        </div>
        <nav className="flex flex-wrap gap-4 border-b pb-4">
          <Link href="/legal/privacy" className="text-muted hover:text-primary">Privacy Policy</Link>
          <Link href="/legal/terms" className="text-primary font-medium">Terms of Service</Link>
          <Link href="/legal/disclaimer" className="text-muted hover:text-primary">Disclaimer</Link>
        </nav>
      </div>
      
      <div className="prose dark:prose-invert max-w-none prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-4">
        <p>Welcome to Howtoaiworld (www.howtoaiworld.com). By accessing this website, we assume you accept these terms and conditions. Do not continue to use Howtoaiworld if you do not agree to take all of the terms and conditions stated on this page.</p>
        
        <h3>1. Definitions</h3>
        <p>"Site" refers to Howtoaiworld, accessible at https://www.howtoaiworld.com.</p>
        <p>"We," "Us," and "Our" refer to Howtoaiworld.</p>
        <p>"You" and "Your" refers to you, the person logging on to this website and compliant with the Company's terms and conditions.</p>
        
        <h3>2. Intellectual Property Rights</h3>
        <p>Other than the content you own, under these Terms, Howtoaiworld and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
        <p>You are granted limited license only for purposes of viewing the material contained on this Website. You may not:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Republish material from Howtoaiworld.</li>
            <li>Sell, rent, or sub-license material from Howtoaiworld.</li>
            <li>Reproduce, duplicate, or copy material from Howtoaiworld.</li>
            <li>Redistribute content from Howtoaiworld (unless content is specifically made for redistribution).</li>
        </ul>
        
        <h3>3. Professional Disclaimer (Important)</h3>
        <p>The content provided on Howtoaiworld is for informational and educational purposes only.</p>
        <p><strong>Financial & Business Content:</strong> Information related to stocks, cryptocurrency, insurance, or business strategies is not professional financial advice. You should consult with a certified financial advisor before making any investment decisions. We are not liable for any financial losses or damages incurred from the use of information on this Site.</p>
        <p><strong>AI & Tech Advice:</strong> While we strive to provide accurate information regarding AI tools and software, technology changes rapidly. We do not guarantee that the tools, code, or methods described will function indefinitely or without error on your specific systems.</p>
        
        <h3>4. Accuracy of Information</h3>
        <p>We attempt to ensure that information on this Site is complete, accurate, and current. Despite our efforts, the information on this Site may occasionally be inaccurate, incomplete, or out of date. We make no representation as to the completeness or accuracy of any information on this Site.</p>
        
        <h3>5. Third-Party Links and Ads</h3>
        <p>Our Site may contain links to third-party web sites or services (including affiliate links and advertisements) that are not owned or controlled by Howtoaiworld.</p>
        <p><strong>Affiliate Disclosure:</strong> Some of the links on this website may be "affiliate links." This means if you click on the link and purchase an item, we may receive an affiliate commission at no extra cost to you.</p>
        <p><strong>External Content:</strong> We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You acknowledge and agree that Howtoaiworld shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of such content, goods, or services available on or through any such web sites or services.</p>
        
        <h3>6. User Comments</h3>
        <p>Certain parts of this website may offer the opportunity for users to post and exchange opinions and information. Howtoaiworld does not filter, edit, publish, or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Howtoaiworld, its agents, and/or affiliates. To the extent permitted by applicable laws, Howtoaiworld shall not be liable for the Comments or for any liability, damages, or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.</p>
        <p>We reserve the right to remove any Comments which can be considered inappropriate, offensive, or causes breach of these Terms and Conditions.</p>
        
        <h3>7. Limitation of Liability</h3>
        <p>In no event shall Howtoaiworld, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Howtoaiworld, including its officers, directors, and employees shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.</p>
        
        <h3>8. Indemnification</h3>
        <p>You hereby indemnify to the fullest extent Howtoaiworld from and against any and/or all liabilities, costs, demands, causes of action, damages, and expenses arising in any way related to your breach of any of the provisions of these Terms.</p>
        
        <h3>9. Changes to Terms</h3>
        <p>Howtoaiworld is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.</p>
        
        <h3>10. Governing Law</h3>
        <p>These Terms will be governed by and interpreted in accordance with the laws of Islamic Republic of Pakistan, and you submit to the non-exclusive jurisdiction of the courts located in Lahore, Pakistan for the resolution of any disputes.</p>
        
        <h3>11. Contact Information</h3>
        <p>If you have any questions about these Terms of Service, please contact us at:</p>
        <p><strong>Email:</strong> privacy@howtoaiworld.com</p>
        <p><strong>Website:</strong> www.howtoaiworld.com</p>
      </div>
    </div>
  );
}
