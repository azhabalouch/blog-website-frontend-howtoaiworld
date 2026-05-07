import LegalLayout from "../../../components/LegalLayout";
import { Scale, Clock, Mail, Globe } from "lucide-react";

export const metadata = {
  title: "Terms of Service - HowToAiWorld",
  description: "Terms of Service for HowToAiWorld. Read our terms and conditions for using our website.",
};

const sections = [
  { id: "definitions", title: "1. Definitions" },
  { id: "intellectual-property", title: "2. Intellectual Property" },
  { id: "professional-disclaimer", title: "3. Professional Disclaimer" },
  { id: "accuracy", title: "4. Accuracy of Information" },
  { id: "third-party", title: "5. Third-Party Links" },
  { id: "user-comments", title: "6. User Comments" },
  { id: "liability", title: "7. Limitation of Liability" },
  { id: "indemnification", title: "8. Indemnification" },
  { id: "changes", title: "9. Changes to Terms" },
  { id: "governing-law", title: "10. Governing Law" },
  { id: "contact", title: "11. Contact Information" },
];

export default function TermsPage() {
  return (
    <LegalLayout sections={sections}>
      {/* Header Card */}
      <div className="premium-card p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Scale className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Terms of Service</h1>
            <p className="text-muted mt-1">Rules and guidelines for using our platform</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-card-border">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Clock className="w-4 h-4" />
            <span>Effective: <time dateTime="2026-05-07" className="text-foreground font-medium">May 7th, 2026</time></span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-card-border" />
          <div className="flex items-center gap-2 text-sm text-muted">
            <Globe className="w-4 h-4" />
            <span>www.howtoaiworld.com</span>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="premium-card p-6 sm:p-8">
        <div className="legal-content">
        <p className="lead">
          Welcome to Howtoaiworld (www.howtoaiworld.com). By accessing this website, we assume you accept these terms and conditions. Do not continue to use Howtoaiworld if you do not agree to take all of the terms and conditions stated on this page.
        </p>
        
        <section id="definitions">
          <h2>1. Definitions</h2>
          <p>&quot;Site&quot; refers to Howtoaiworld, accessible at https://www.howtoaiworld.com.</p>
          <p>&quot;We,&quot; &quot;Us,&quot; and &quot;Our&quot; refer to Howtoaiworld.</p>
          <p>&quot;You&quot; and &quot;Your&quot; refers to you, the person logging on to this website and compliant with the Company&apos;s terms and conditions.</p>
        </section>
        
        <section id="intellectual-property">
          <h2>2. Intellectual Property Rights</h2>
          <p>Other than the content you own, under these Terms, Howtoaiworld and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
          <p>You are granted limited license only for purposes of viewing the material contained on this Website. You may not:</p>
          <ul>
            <li>Republish material from Howtoaiworld.</li>
            <li>Sell, rent, or sub-license material from Howtoaiworld.</li>
            <li>Reproduce, duplicate, or copy material from Howtoaiworld.</li>
            <li>Redistribute content from Howtoaiworld (unless content is specifically made for redistribution).</li>
          </ul>
        </section>
        
        <section id="professional-disclaimer">
          <h2>3. Professional Disclaimer</h2>
          <div className="highlight-box">
            <p><strong>Important:</strong> The content provided on Howtoaiworld is for informational and educational purposes only.</p>
          </div>
          <p><strong>Financial & Business Content:</strong> Information related to stocks, cryptocurrency, insurance, or business strategies is not professional financial advice. You should consult with a certified financial advisor before making any investment decisions. We are not liable for any financial losses or damages incurred from the use of information on this Site.</p>
          <p><strong>AI & Tech Advice:</strong> While we strive to provide accurate information regarding AI tools and software, technology changes rapidly. We do not guarantee that the tools, code, or methods described will function indefinitely or without error on your specific systems.</p>
        </section>
        
        <section id="accuracy">
          <h2>4. Accuracy of Information</h2>
          <p>We attempt to ensure that information on this Site is complete, accurate, and current. Despite our efforts, the information on this Site may occasionally be inaccurate, incomplete, or out of date. We make no representation as to the completeness or accuracy of any information on this Site.</p>
        </section>
        
        <section id="third-party">
          <h2>5. Third-Party Links and Ads</h2>
          <p>Our Site may contain links to third-party web sites or services (including affiliate links and advertisements) that are not owned or controlled by Howtoaiworld.</p>
          <p><strong>Affiliate Disclosure:</strong> Some of the links on this website may be &quot;affiliate links.&quot; This means if you click on the link and purchase an item, we may receive an affiliate commission at no extra cost to you.</p>
          <p><strong>External Content:</strong> We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You acknowledge and agree that Howtoaiworld shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of such content, goods, or services available on or through any such web sites or services.</p>
        </section>
        
        <section id="user-comments">
          <h2>6. User Comments</h2>
          <p>Certain parts of this website may offer the opportunity for users to post and exchange opinions and information. Howtoaiworld does not filter, edit, publish, or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Howtoaiworld, its agents, and/or affiliates. To the extent permitted by applicable laws, Howtoaiworld shall not be liable for the Comments or for any liability, damages, or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.</p>
          <p>We reserve the right to remove any Comments which can be considered inappropriate, offensive, or causes breach of these Terms and Conditions.</p>
        </section>
        
        <section id="liability">
          <h2>7. Limitation of Liability</h2>
          <p>In no event shall Howtoaiworld, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Howtoaiworld, including its officers, directors, and employees shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.</p>
        </section>
        
        <section id="indemnification">
          <h2>8. Indemnification</h2>
          <p>You hereby indemnify to the fullest extent Howtoaiworld from and against any and/or all liabilities, costs, demands, causes of action, damages, and expenses arising in any way related to your breach of any of the provisions of these Terms.</p>
        </section>
        
        <section id="changes">
          <h2>9. Changes to Terms</h2>
          <p>Howtoaiworld is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.</p>
        </section>
        
        <section id="governing-law">
          <h2>10. Governing Law</h2>
          <p>These Terms will be governed by and interpreted in accordance with the laws of Islamic Republic of Pakistan, and you submit to the non-exclusive jurisdiction of the courts located in Lahore, Pakistan for the resolution of any disputes.</p>
        </section>
        
        <section id="contact">
          <h2>11. Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us:</p>
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
