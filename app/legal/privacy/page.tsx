import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - HowToAiWorld',
  description: 'Privacy Policy for HowToAiWorld. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <div className="text-gray-500 mb-6">
          <time dateTime="2026-02-07">Effective Date: February 07, 2026</time>
        </div>
        <nav className="flex flex-wrap gap-4 border-b pb-4">
          <Link href="/legal/privacy" className="text-blue-600 font-medium">Privacy Policy</Link>
          <Link href="/legal/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</Link>
          <Link href="/legal/disclaimer" className="text-gray-600 hover:text-blue-600">Disclaimer</Link>
        </nav>
      </div>
      
      <div className="prose max-w-none prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-4">
        <p>Welcome to Howtoaiworld (www.howtoaiworld.com). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regards to your personal information, please contact us at howtoaiworld@gmail.com.</p>
        
        <p>This Privacy Policy governs the manner in which Howtoaiworld collects, uses, maintains, and discloses information collected from users (each, a "User") of the https://www.howtoaiworld.com website ("Site").</p>
        
        <h3>1. Information We Collect</h3>
        <p>We collect personal information that you voluntarily provide to us when you subscribe to our newsletter, fill out a contact form, or otherwise communicate with us.</p>
        <p><strong>Personal Information Provided by You:</strong> We collect names and email addresses that you voluntarily give us for the purpose of subscribing to our newsletter or contacting support.</p>
        <p><strong>Automated Information:</strong> Like many businesses, we also collect information through cookies and similar technologies. This includes your IP address, browser and device characteristics, operating system, language preferences, referring URLs, and information about how and when you use our Site.</p>
        
        <h3>2. How We Use Your Information</h3>
        <p>We use the information we collect or receive:</p>
        <p><strong>To send you our newsletter:</strong> We use your email address to send you the "Daily News & Insights" you subscribed to. You can unsubscribe at any time.</p>
        <p><strong>To display advertising:</strong> We may work with third-party advertising companies to serve ads when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>
        <p><strong>To improve our website:</strong> We may use feedback you provide to improve our products and services.</p>
        <p><strong>To analyze usage:</strong> We use tools to understand how users interact with our site to improve content and user experience.</p>
        
        <h3>3. Cookies and Web Beacons</h3>
        <p>Howtoaiworld uses "cookies" to enhance the User experience. Your web browser places cookies on your hard drive for record-keeping purposes and sometimes to track information about them.</p>
        <p><strong>Essential Cookies:</strong> Necessary for the website to function correctly.</p>
        <p><strong>Analytics Cookies:</strong> We use these to understand how many visitors we have and how they use the site.</p>
        <p><strong>Advertising Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</p>
        <p>You may choose to set your web browser to refuse cookies or to alert you when cookies are being sent. If you do so, note that some parts of the Site may not function properly.</p>
        
        <h3>4. Third-Party Services</h3>
        <p>We may share your data with the following third-party service providers to facilitate our services:</p>
        <p><strong>Analytics:</strong> We may use third-party Service Providers (such as Google Analytics) to monitor and analyze the use of our Service.</p>
        <p><strong>Advertising:</strong> We may use third-party Service Providers (such as Google AdSense) to show advertisements to you to help support and maintain our Service.</p>
        <p><strong>Newsletter Services:</strong> We may use third-party email marketing services to manage our newsletter delivery.</p>
        
        <h3>5. Links to External Sites</h3>
        <p>Our Service contains links to other sites that are not operated by us (e.g., external news sources, affiliate links). If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
        
        <h3>6. Data Security</h3>
        <p>We use administrative, technical, and physical security measures to help protect your personal information. However, please remember that no electronic transmission over the internet or information storage technology is 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.</p>
        
        <h3>7. Children's Privacy</h3>
        <p>Our Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us.</p>
        
        <h3>8. Changes to This Privacy Policy</h3>
        <p>Howtoaiworld has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the top of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.</p>
        
        <h3>9. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:</p>
        <p>
            <strong>Email:</strong> privacy@howtoaiworld.com<br />
            <strong>Website:</strong> www.howtoaiworld.com
        </p>
      </div>
    </div>
  );
}
