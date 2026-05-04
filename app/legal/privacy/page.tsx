import LegalLayout from "../../../components/LegalLayout";
import { Shield, Clock, Mail, Globe, Lock, Eye, Cookie, Server, Users, RefreshCw, Megaphone, Scale, Database } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - HowToAiWorld",
  description: "Privacy Policy for HowToAiWorld. Learn how we collect, use, and protect your personal information.",
};

const sections = [
  { id: "information-collected", title: "1. Information We Collect" },
  { id: "how-we-use", title: "2. How We Use Information" },
  { id: "cookies", title: "3. Cookies & Web Beacons" },
  { id: "adsense", title: "4. Google AdSense" },
  { id: "third-party", title: "5. Third-Party Services" },
  { id: "external-links", title: "6. Links to External Sites" },
  { id: "gdpr", title: "7. GDPR Data Rights" },
  { id: "ccpa", title: "8. CCPA Privacy Rights" },
  { id: "data-retention", title: "9. Data Retention" },
  { id: "data-security", title: "10. Data Security" },
  { id: "children", title: "11. Children's Privacy" },
  { id: "changes", title: "12. Changes to Policy" },
  { id: "contact", title: "13. Contact Us" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout sections={sections}>
      {/* Header Card */}
      <div className="premium-card p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-muted mt-1">How we collect, use, and protect your data</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-card-border">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Clock className="w-4 h-4" />
            <span>Effective: <time dateTime="2026-02-07" className="text-foreground font-medium">February 07, 2026</time></span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-card-border" />
          <div className="flex items-center gap-2 text-sm text-muted">
            <Lock className="w-4 h-4" />
            <span>Last Updated: February 07, 2026</span>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="premium-card p-6 sm:p-8">
        <div className="legal-content">
        <p className="lead">
          Welcome to Howtoaiworld (www.howtoaiworld.com). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, please contact us.
        </p>
        
        <section id="information-collected">
          <div className="section-header">
            <Eye className="w-6 h-6 text-primary" />
            <h2>1. Information We Collect</h2>
          </div>
          <p>This Privacy Policy governs the manner in which Howtoaiworld collects, uses, maintains, and discloses information collected from users (each, a &quot;User&quot;) of the https://www.howtoaiworld.com website (&quot;Site&quot;).</p>
          <p>We collect personal information that you voluntarily provide to us when you subscribe to our newsletter, fill out a contact form, or otherwise communicate with us.</p>
          <div className="info-grid">
            <div className="info-box">
              <strong>Personal Information</strong>
              <p>Names and email addresses that you voluntarily give us for subscribing to our newsletter or contacting support.</p>
            </div>
            <div className="info-box">
              <strong>Automated Information</strong>
              <p>IP address, browser characteristics, operating system, language preferences, referring URLs, and usage data collected through cookies.</p>
            </div>
          </div>
        </section>
        
        <section id="how-we-use">
          <div className="section-header">
            <Server className="w-6 h-6 text-primary" />
            <h2>2. How We Use Your Information</h2>
          </div>
          <p>We use the information we collect or receive:</p>
          <ul>
            <li><strong>Newsletter:</strong> We use your email address to send you the &quot;Daily News & Insights&quot; you subscribed to. You can unsubscribe at any time.</li>
            <li><strong>Advertising:</strong> We work with third-party advertising companies to serve ads. These companies may use information about your visits to provide relevant advertisements.</li>
            <li><strong>Improvements:</strong> We use feedback you provide to improve our products and services.</li>
            <li><strong>Analytics:</strong> We use tools to understand how users interact with our site to improve content and user experience.</li>
          </ul>
        </section>
        
        <section id="cookies">
          <div className="section-header">
            <Cookie className="w-6 h-6 text-primary" />
            <h2>3. Cookies and Web Beacons</h2>
          </div>
          <p>Howtoaiworld uses &quot;cookies&quot; to enhance the User experience. Your web browser places cookies on your hard drive for record-keeping purposes and sometimes to track information about them.</p>
          <div className="info-grid">
            <div className="info-box">
              <strong>Essential Cookies</strong>
              <p>Necessary for the website to function correctly.</p>
            </div>
            <div className="info-box">
              <strong>Analytics Cookies</strong>
              <p>We use these to understand how many visitors we have and how they use the site.</p>
            </div>
            <div className="info-box">
              <strong>Advertising Cookies</strong>
              <p>Third-party vendors use cookies to serve ads based on prior visits.</p>
            </div>
          </div>
          <p>You may choose to set your web browser to refuse cookies or to alert you when cookies are being sent. If you do so, note that some parts of the Site may not function properly.</p>
        </section>
        
        <section id="adsense">
          <div className="section-header">
            <Megaphone className="w-6 h-6 text-primary" />
            <h2>4. Google AdSense and DoubleClick Cookie</h2>
          </div>
          <p>We use Google AdSense Advertising on our website. Google, as a third-party vendor, uses cookies to serve ads on our Site. Google&apos;s use of the DART cookie enables it to serve ads to our users based on previous visits to our Site and other sites on the Internet.</p>
          <p><strong>Opting Out:</strong> Users may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>. Alternatively, you can opt out of some third-party vendors&apos; uses of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</p>
        </section>
        
        <section id="third-party">
          <div className="section-header">
            <Server className="w-6 h-6 text-primary" />
            <h2>5. Third-Party Services</h2>
          </div>
          <p>We may share your data with the following third-party service providers to facilitate our services:</p>
          <ul>
            <li><strong>Analytics:</strong> Third-party Service Providers (such as Google Analytics) to monitor and analyze the use of our Service.</li>
            <li><strong>Advertising:</strong> Third-party Service Providers (such as Google AdSense) to show advertisements and support our Service.</li>
            <li><strong>Newsletter Services:</strong> Third-party email marketing services to manage our newsletter delivery.</li>
          </ul>
        </section>
        
        <section id="external-links">
          <div className="section-header">
            <Globe className="w-6 h-6 text-primary" />
            <h2>6. Links to External Sites</h2>
          </div>
          <p>Our Service contains links to other sites that are not operated by us (e.g., external news sources, affiliate links). If you click on a third-party link, you will be directed to that third party&apos;s site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
        </section>
        
        <section id="gdpr">
          <div className="section-header">
            <Scale className="w-6 h-6 text-primary" />
            <h2>7. Your Data Protection Rights (GDPR)</h2>
          </div>
          <p>We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
          <ul>
            <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
            <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            <li><strong>The right to object to processing:</strong> You have the right to object to our processing of your personal data, under certain conditions.</li>
            <li><strong>The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
          </ul>
          <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at privacy@howtoaiworld.com.</p>
        </section>
        
        <section id="ccpa">
          <div className="section-header">
            <Scale className="w-6 h-6 text-primary" />
            <h2>8. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
          </div>
          <p>Under the CCPA, among other rights, California consumers have the right to:</p>
          <ul>
            <li>Request that a business that collects a consumer&apos;s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
            <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
            <li>Request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s personal data.</li>
          </ul>
          <p><strong>We do not sell your personal information.</strong> If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>
        </section>
        
        <section id="data-retention">
          <div className="section-header">
            <Database className="w-6 h-6 text-primary" />
            <h2>9. Data Retention</h2>
          </div>
          <p>We will only retain your personal information for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. For example, we will keep your email address on file as long as you remain subscribed to our newsletter, and we will delete it promptly if you choose to unsubscribe.</p>
        </section>
        
        <section id="data-security">
          <div className="section-header">
            <Lock className="w-6 h-6 text-primary" />
            <h2>10. Data Security</h2>
          </div>
          <p>We use administrative, technical, and physical security measures to help protect your personal information. However, please remember that no electronic transmission over the internet or information storage technology is 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.</p>
        </section>
        
        <section id="children">
          <div className="section-header">
            <Users className="w-6 h-6 text-primary" />
            <h2>11. Children&apos;s Privacy</h2>
          </div>
          <p>Our Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us.</p>
        </section>
        
        <section id="changes">
          <div className="section-header">
            <RefreshCw className="w-6 h-6 text-primary" />
            <h2>12. Changes to This Privacy Policy</h2>
          </div>
          <p>Howtoaiworld has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the top of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.</p>
        </section>
        
        <section id="contact">
          <div className="section-header">
            <Mail className="w-6 h-6 text-primary" />
            <h2>13. Contact Us</h2>
          </div>
          <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us:</p>
          <div className="contact-grid">
            <div className="contact-item">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <span className="label">Email</span>
                <a href="mailto:privacy@howtoaiworld.com" className="value">privacy@howtoaiworld.com</a>
              </div>
            </div>
            <div className="contact-item">
              <Globe className="w-5 h-5 text-primary" />
              <div>
                <span className="label">Website</span>
                <span className="value">www.howtoaiworld.com</span>
              </div>
            </div>
          </div>
        </section>
        </div>
      </div>
    </LegalLayout>
  );
}
