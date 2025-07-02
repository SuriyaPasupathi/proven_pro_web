import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { FileText, ArrowLeft, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

interface TermsConditionsProps {
  onAccept?: () => void;
  onDecline?: () => void;
  showActions?: boolean;
}

const TermsConditions: React.FC<TermsConditionsProps> = ({ 
  onAccept, 
  onDecline, 
  showActions = false 
}) => {
  const navigate = useNavigate();

  const sections = [
    {
      id: '1',
      title: '1. Acceptance of Terms',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            By accessing and using ProvenPro ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            These Terms of Service ("Terms") govern your use of our website and services. By using our Service, you agree to these Terms in full.
          </p>
        </div>
      )
    },
    {
      id: '2',
      title: '2. Description of Service',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            ProvenPro is a professional profile and business networking platform that allows users to create, manage, and share their professional profiles, 
            connect with other professionals, and access various business services and tools.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Our Service includes but is not limited to:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 ml-2 sm:ml-4">
            <li>Professional profile creation and management</li>
            <li>Portfolio and work experience showcase</li>
            <li>Professional networking and connections</li>
            <li>Service offering and business promotion</li>
            <li>Premium membership features</li>
            <li>Analytics and profile insights</li>
          </ul>
        </div>
      )
    },
    {
      id: '3',
      title: '3. User Accounts and Registration',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information 
            during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You are responsible for safeguarding the password and for all activities that occur under your account. You agree not to disclose your password 
            to any third party and to take sole responsibility for any activities or actions under your account.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You must be at least 18 years old to create an account and use our Service.
          </p>
        </div>
      )
    },
    {
      id: '4',
      title: '4. User Content and Conduct',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You retain ownership of any content you submit, post, or display on or through the Service ("User Content"). By submitting User Content, 
            you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute such content in connection with the Service.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You agree not to post content that:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 ml-2 sm:ml-4">
            <li>Is unlawful, harmful, threatening, abusive, or defamatory</li>
            <li>Infringes on intellectual property rights</li>
            <li>Contains spam, malware, or other harmful code</li>
            <li>Impersonates another person or entity</li>
            <li>Contains confidential or proprietary information</li>
            <li>Violates any applicable laws or regulations</li>
          </ul>
        </div>
      )
    },
    {
      id: '5',
      title: '5. Privacy and Data Protection',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your privacy is important to us. Our{' '}
            <a 
              href="/privacy-policy" 
              className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                navigate('/privacy-policy');
              }}
            >
              Privacy Policy
            </a>{' '}
            explains how we collect, use, and protect your personal information. 
            By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We may collect and process personal data including but not limited to:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1 ml-2 sm:ml-4">
            <li>Name, email address, and contact information</li>
            <li>Professional credentials and work history</li>
            <li>Profile information and preferences</li>
            <li>Usage data and analytics</li>
            <li>Communication records</li>
          </ul>
        </div>
      )
    },
    {
      id: '6',
      title: '6. Payment Terms and Subscriptions',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Some features of our Service require payment. All fees are non-refundable except as required by law or as otherwise specified in these Terms.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Subscription fees are billed in advance on a recurring basis. You authorize us to charge your payment method for all fees incurred.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You may cancel your subscription at any time through your{' '}
            <a 
              href="/account/settings" 
              className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                navigate('/account/settings');
              }}
            >
              account settings
            </a>. Cancellation will take effect at the end of the current billing period.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We reserve the right to change our pricing with 30 days' notice. Price changes will not affect existing subscriptions until renewal.
          </p>
        </div>
      )
    },
    {
      id: '7',
      title: '7. Intellectual Property Rights',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The Service and its original content, features, and functionality are and will remain the exclusive property of ProvenPro and its licensors. 
            The Service is protected by copyright, trademark, and other laws.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You retain ownership of your User Content, but you grant us a license to use it as described in Section 4.
          </p>
        </div>
      )
    },
    {
      id: '8',
      title: '8. Limitation of Liability',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            In no event shall ProvenPro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, 
            incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
            or other intangible losses, resulting from your use of the Service.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Our total liability to you for any claims arising from these Terms or your use of the Service shall not exceed the amount you paid us 
            in the 12 months preceding the claim.
          </p>
        </div>
      )
    },
    {
      id: '9',
      title: '9. Termination',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, 
            under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            If you wish to terminate your account, you may simply discontinue using the Service or{' '}
            <a 
              href="/contact" 
              className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                navigate('/contact');
              }}
            >
              contact us
            </a>{' '}
            to delete your account.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, 
            ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>
        </div>
      )
    },
    {
      id: '10',
      title: '10. Governing Law and Dispute Resolution',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            These Terms shall be interpreted and governed by the laws of the jurisdiction in which ProvenPro operates, without regard to its conflict of law provisions.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules 
            of the{' '}
            <a 
              href="https://www.adr.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 inline-flex items-center gap-1"
            >
              American Arbitration Association
              <ExternalLink className="h-3 w-3" />
            </a>.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You agree to waive any right to a jury trial or to participate in a class action lawsuit.
          </p>
        </div>
      )
    },
    {
      id: '11',
      title: '11. Changes to Terms',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, 
            we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service 
            after any revisions become effective, you agree to be bound by the revised terms.
          </p>
        </div>
      )
    },
    {
      id: '12',
      title: '12. Contact Information',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <div className="bg-muted p-3 sm:p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs sm:text-sm font-medium">ProvenPro Support</p>
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
              </div>
            </div>
          </div>
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
          <FileText className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: '#5A8DB8' }} />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#5A8DB8' }}>Terms and Conditions</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
          Please read these terms and conditions carefully before using ProvenPro. These terms govern your use of our professional networking platform.
        </p>
        
      </div>

      <Separator />

      {/* Terms Content - Paragraph Format */}
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
            Accept Terms
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
          By using ProvenPro, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
        </p>
        <p className="mt-2">
          If you do not agree with any part of these terms, please do not use our Service.
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;
