import LegalLayout from "../../../components/LegalLayout";
import { AlertTriangle, Clock, Mail, Globe, DollarSign, Bot, ExternalLink, TrendingUp, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Disclaimer - HowToAiWorld",
  description: "Disclaimer for HowToAiWorld. Important information about the content on our website.",
};

const sections = [
  { id: "not-advice", title: "1. Not Professional Advice" },
  { id: "ai-disclaimer", title: "2. AI Disclaimer" },
  { id: "affiliate", title: "3. Affiliate Disclosure" },
  { id: "external-links", title: "4. External Links" },
  { id: "earnings", title: "5. Earnings Disclaimer" },
  { id: "errors", title: "6. Errors & Omissions" },
  { id: "contact", title: "7. Contact Us" },
];

export default function DisclaimerPage() {
  return (
    <LegalLayout sections={sections}>
      {/* Header Card */}
      <div className="premium-card p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Disclaimer</h1>
            <p className="text-muted mt-1">Important legal information about our content</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-card-border">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Clock className="w-4 h-4" />
            <span>Effective: <time dateTime="2026-02-07" className="text-foreground font-medium">February 07, 2026</time></span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-card-border" />
          <div className="flex items-center gap-2 text-sm text-muted">
            <AlertCircle className="w-4 h-4" />
            <span>Please read carefully</span>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-foreground text-sm">Important Notice</p>
          <p className="text-sm text-muted mt-1">
            The information provided on this website is for general informational and educational purposes only. 
            All information is provided in good faith, however we make no representation or warranty of any kind.
          </p>
        </div>
      </div>

      {/* Content Card */}
      <div className="premium-card p-6 sm:p-8">
        <div className="legal-content">
        <p className="lead">
          The information provided by Howtoaiworld (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) on https://www.howtoaiworld.com (the &quot;Site&quot;) is for general informational and educational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
        </p>
        
        <section id="not-advice">
          <div className="section-header">
            <DollarSign className="w-6 h-6 text-primary" />
            <h2>1. Not Financial or Professional Advice</h2>
          </div>
          <div className="highlight-box amber">
            <p><strong>This is the most important section of this Disclaimer.</strong></p>
          </div>
          <p>The Site cannot and does not contain professional financial, legal, or business advice. The financial information (including crypto, stock market insights, insurance, and business strategies) is provided for general educational and informational purposes only and is not a substitute for professional advice.</p>
          <p>Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of financial advice. The use or reliance of any information contained on the Site is solely at your own risk.</p>
        </section>
        
        <section id="ai-disclaimer">
          <div className="section-header">
            <Bot className="w-6 h-6 text-primary" />
            <h2>2. Artificial Intelligence (AI) Disclaimer</h2>
          </div>
          <p>The content on this website discusses Artificial Intelligence (AI) tools, software, and developments. Please be aware that:</p>
          <div className="info-grid">
            <div className="info-box">
              <strong>Rapid Change</strong>
              <p>The AI landscape evolves daily. Tools, features, and pricing mentioned in our articles may change without notice.</p>
            </div>
            <div className="info-box">
              <strong>Accuracy of AI</strong>
              <p>When we discuss using AI for tasks, remember that AI models can &quot;hallucinate&quot; or produce factual errors. You should always verify AI-generated output.</p>
            </div>
            <div className="info-box">
              <strong>No Guarantees</strong>
              <p>We do not guarantee that any specific AI tool discussed will achieve a specific result for your business.</p>
            </div>
          </div>
        </section>
        
        <section id="affiliate">
          <div className="section-header">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2>3. Affiliate Disclosure</h2>
          </div>
          <p>This Site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links.</p>
          <p>We participate in various affiliate programs, and we may earn a commission from qualifying purchases. This comes at no extra cost to you. Our editorial content is not influenced by advertisers or affiliate partnerships.</p>
        </section>
        
        <section id="external-links">
          <div className="section-header">
            <ExternalLink className="w-6 h-6 text-primary" />
            <h2>4. External Links Disclaimer</h2>
          </div>
          <p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>
          <p>We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the Site. We will not be a party to or in any way be responsible for monitoring any transaction between you and third-party providers of products or services.</p>
        </section>
        
        <section id="earnings">
          <div className="section-header">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2>5. Earnings Disclaimer</h2>
          </div>
          <p>From time to time, we may report on the success of one of our existing or prior strategies/products or the success of others (e.g., &quot;How to use AI for Affiliate Marketing&quot;). The information about this success is accurately portrayed. You acknowledge that your prior success, or the success of others, does not guarantee your success.</p>
          <p>As with any business arrangement, your results may vary and will be based on your individual capacity, business experience, expertise, and level of desire. There are no guarantees concerning the level of success you may experience.</p>
        </section>
        
        <section id="errors">
          <div className="section-header">
            <AlertCircle className="w-6 h-6 text-primary" />
            <h2>6. Errors and Omissions</h2>
          </div>
          <p>While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, Howtoaiworld is not responsible for any errors or omissions, or for the results obtained from the use of this information. All information in this site is provided &quot;as is&quot;, with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information.</p>
        </section>
        
        <section id="contact">
          <div className="section-header">
            <Mail className="w-6 h-6 text-primary" />
            <h2>7. Contact Us</h2>
          </div>
          <p>If you require any more information or have any questions about our site&apos;s disclaimer, please feel free to contact us:</p>
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