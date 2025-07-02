import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Shield, ArrowLeft, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

interface PrivacyPolicyProps {
  onAccept?: () => void;
  onDecline?: () => void;
  showActions?: boolean;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ 
  onAccept, 
  onDecline, 
  showActions = false 
}) => {
  const navigate = useNavigate();

  const sections = [
    {
      id: '1',
      title: '1. Introduction and Scope',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            ProvenPro ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you use our professional networking platform and related services.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            This policy applies to all users of our Service, including visitors, registered users, and premium subscribers. 
            By using ProvenPro, you consent to the data practices described in this policy.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
      )
    },
    {
      id: '2',
      title: '2. Information We Collect',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We collect several types of information from and about users of our Service:
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-xs sm:text-sm mb-2">Personal Information</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 ml-2 sm:ml-4">
                <li>Name, email address, and phone number</li>
                <li>Professional credentials and work history</li>
                <li>Profile information and preferences</li>
                <li>Payment and billing information</li>
                <li>Profile pictures and portfolio content</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-xs sm:text-sm mb-2">Usage Information</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 ml-2 sm:ml-4">
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Pages visited and time spent on site</li>
                <li>Search queries and interactions</li>
                <li>Communication preferences</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-xs sm:text-sm mb-2">Automatically Collected Data</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 ml-2 sm:ml-4">
                <li>Cookies and similar tracking technologies</li>
                <li>Analytics and performance data</li>
                <li>Error logs and system information</li>
                <li>Geographic location data (with consent)</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '3',
      title: '3. How We Use Your Information',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We use the information we collect for various purposes, including:
          </p>
          
          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-xs sm:text-sm mb-2">Service Provision</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 ml-2 sm:ml-4">
                <li>Creating and managing your account</li>
                <li>Providing professional networking features</li>
                <li>Processing payments and subscriptions</li>
                <li>Delivering customer support</li>
              </ul>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-xs sm:text-sm mb-2">Communication</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 ml-2 sm:ml-4">
                <li>Sending service-related notifications</li>
                <li>Marketing communications (with consent)</li>
                <li>Responding to inquiries and support requests</li>
                <li>Sharing important updates and announcements</li>
              </ul>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-xs sm:text-sm mb-2">Improvement and Analytics</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 ml-2 sm:ml-4">
                <li>Analyzing usage patterns and trends</li>
                <li>Improving our services and user experience</li>
                <li>Developing new features and functionality</li>
                <li>Conducting research and surveys</li>
              </ul>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-xs sm:text-sm mb-2">Legal and Security</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 ml-2 sm:ml-4">
                <li>Complying with legal obligations</li>
                <li>Preventing fraud and abuse</li>
                <li>Protecting user safety and security</li>
                <li>Enforcing our terms of service</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '4',
      title: '4. Information Sharing and Disclosure',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
          </p>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-xs sm:text-sm mb-2">With Your Consent</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We may share your information when you explicitly consent to such sharing, such as when you choose to make your profile public 
                or connect with other professionals.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-xs sm:text-sm mb-2">Service Providers</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We may share information with trusted third-party service providers who assist us in operating our platform, 
                such as payment processors, hosting providers, and analytics services.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-xs sm:text-sm mb-2">Legal Requirements</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We may disclose your information if required by law, court order, or government request, or to protect our rights, 
                property, or safety, or that of our users or the public.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-xs sm:text-sm mb-2">Business Transfers</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction, 
                subject to the same privacy protections.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '5',
      title: '5. Data Security and Protection',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, 
            alteration, disclosure, or destruction.
          </p>
          
          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-xs sm:text-sm mb-2">Security Measures</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 ml-2 sm:ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure data centers and infrastructure</li>
                <li>Employee training on data protection</li>
              </ul>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-xs sm:text-sm mb-2">Data Retention</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, 
                unless a longer retention period is required or permitted by law.
              </p>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-xs sm:text-sm mb-2">Incident Response</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                In the event of a data breach, we will notify affected users and relevant authorities as required by law, 
                and take appropriate steps to mitigate any potential harm.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '6',
      title: '6. Your Privacy Rights and Choices',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You have certain rights regarding your personal information, including:
          </p>
          
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-medium text-xs sm:text-sm mb-2">Access and Portability</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Request access to your personal information and receive a copy in a portable format.
                </p>
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-medium text-xs sm:text-sm mb-2">Correction</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Request correction of inaccurate or incomplete personal information.
                </p>
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-medium text-xs sm:text-sm mb-2">Deletion</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Request deletion of your personal information, subject to legal requirements.
                </p>
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-medium text-xs sm:text-sm mb-2">Restriction</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Request restriction of processing in certain circumstances.
                </p>
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-xs sm:text-sm mb-2">Communication Preferences</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                You can control your communication preferences through your{' '}
                <a 
                  href="/account/settings" 
                  className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/account/settings');
                  }}
                >
                  account settings
                </a>, including opting out of marketing emails 
                and adjusting notification settings.
              </p>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-xs sm:text-sm mb-2">Cookie Management</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                You can manage cookie preferences through your browser settings or our{' '}
                <a 
                  href="/cookie-policy" 
                  className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/cookie-policy');
                  }}
                >
                  cookie consent banner
                </a>.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '7',
      title: '7. Cookies and Tracking Technologies',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We use cookies and similar tracking technologies to enhance your experience on our platform:
          </p>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-xs sm:text-sm mb-2">Essential Cookies</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Required for basic functionality, such as authentication and session management.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-xs sm:text-sm mb-2">Analytics Cookies</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Help us understand how users interact with our platform to improve our services.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-xs sm:text-sm mb-2">Marketing Cookies</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Used to deliver relevant advertisements and track marketing campaign effectiveness.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-xs sm:text-sm mb-2">Third-Party Services</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We may use third-party services that set their own cookies, such as{' '}
                <a 
                  href="https://analytics.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 inline-flex items-center gap-1"
                >
                  Google Analytics
                  <ExternalLink className="h-3 w-3" />
                </a>{' '}
                and social media plugins.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '8',
      title: '8. International Data Transfers',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place:
          </p>
          
          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-xs sm:text-sm mb-2">Data Transfer Safeguards</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 ml-2 sm:ml-4">
                <li>Standard contractual clauses</li>
                <li>Adequacy decisions</li>
                <li>Certification schemes</li>
                <li>Other appropriate safeguards</li>
              </ul>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-xs sm:text-sm mb-2">Processing Locations</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We primarily process data in the United States and European Union, with additional processing in other regions 
                as necessary for service provision.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '9',
      title: '9. Children\'s Privacy',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Our Service is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18.
          </p>
          
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            If you are a parent or guardian and believe your child has provided us with personal information, 
            please{' '}
            <a 
              href="/contact" 
              className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                navigate('/contact');
              }}
            >
              contact us immediately
            </a>. We will take steps to remove such information from our records.
          </p>
          
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            If you are under 18, please do not use our Service or provide any personal information to us.
          </p>
        </div>
      )
    },
    {
      id: '10',
      title: '10. Changes to This Privacy Policy',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. 
            We will notify you of any material changes by:
          </p>
          
          <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 ml-2 sm:ml-4">
            <li>Posting the updated policy on our website</li>
            <li>Sending email notifications to registered users</li>
            <li>Displaying prominent notices on our platform</li>
            <li>Updating the "Last Updated" date</li>
          </ul>
          
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your continued use of our Service after any changes indicates your acceptance of the updated Privacy Policy.
          </p>
        </div>
      )
    },
    {
      id: '11',
      title: '11. Contact Us',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          
          <div className="bg-muted p-3 sm:p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs sm:text-sm font-medium">ProvenPro Privacy Team</p>
                <a 
                  href="mailto:privacy@provenpro.com" 
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                >
                  privacy@provenpro.com
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs sm:text-sm font-medium">Data Protection Officer</p>
                <a 
                  href="mailto:dpo@provenpro.com" 
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                >
                  dpo@provenpro.com
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs sm:text-sm font-medium">General Support</p>
                <a 
                  href="mailto:support@provenpro.com" 
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                >
                  support@provenpro.com
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs sm:text-sm font-medium">Phone Support</p>
                <a 
                  href="tel:+15551234567" 
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                >
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-medium">Mailing Address</p>
                <p className="text-xs sm:text-sm text-muted-foreground">123 Business Street, Suite 100</p>
                <p className="text-xs sm:text-sm text-muted-foreground">City, State 12345</p>
                <p className="text-xs sm:text-sm text-muted-foreground">United States</p>
              </div>
            </div>
          </div>
          
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We will respond to your inquiry within 30 days of receipt.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Back Button */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground text-xs sm:text-sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Back</span>
        </Button>
      </div>

      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: '#5A8DB8' }} />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#5A8DB8' }}>Privacy Policy</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
          Your privacy is important to us. This policy explains how we collect, use, and protect your personal information 
          when you use ProvenPro.
        </p>
       
      </div>

      <Separator />

      {/* Privacy Policy Content - Paragraph Format */}
      <div className="space-y-6 sm:space-y-8">
        {sections.map((section) => (
          <div key={section.id}>
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: '#5A8DB8' }}>{section.title}</h2>
            {section.content}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
          <Button
            variant="outline"
            onClick={onDecline}
            className="min-w-[120px] text-xs sm:text-sm"
          >
            Decline
          </Button>
          <Button
            onClick={onAccept}
            className="min-w-[120px] text-xs sm:text-sm"
          >
            Accept Policy
          </Button>
        </div>
      )}

      {/* Version and Last Updated Info */}
      <div className="text-center text-xs sm:text-sm pt-2" style={{ color: '#5A8DB8' }}>
        <span>Last Updated: {new Date().toLocaleDateString()}</span>
        <span className="mx-2">|</span>
        <span>Version 1.0</span>
      </div>

      {/* Footer */}
      <div className="text-center text-xs sm:text-sm text-muted-foreground pt-4 sm:pt-6 px-2 sm:px-0">
        <p>
          By using ProvenPro, you acknowledge that you have read, understood, and agree to our Privacy Policy.
        </p>
        <p className="mt-2">
          We are committed to protecting your privacy and will handle your personal information in accordance with this policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
