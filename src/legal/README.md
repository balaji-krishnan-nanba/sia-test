# Legal Documents - Implementation Guide

This directory contains all legal documents for the SIA Exam Prep platform. These documents are critical for legal compliance and protecting both the business and users.

---

## Documents Overview

### 1. Privacy Policy (`privacy-policy.md`)
**Purpose:** Explains how we collect, use, and protect user data

**Key Compliance:**
- UK GDPR compliant
- Data Protection Act 2018
- Covers all user rights (access, rectification, erasure, portability)
- Details third-party services and data transfers

**Must Update When:**
- Adding new data collection methods
- Integrating new third-party services
- Changing data retention policies
- Moving data storage locations

---

### 2. Terms of Service (`terms-of-service.md`)
**Purpose:** Legal agreement between users and the company

**Key Clauses:**
- Service description and disclaimers
- User responsibilities and prohibited uses
- Payment terms (one-time, no subscription)
- Intellectual property protection
- Limitation of liability
- Governing law (England and Wales)

**Must Update When:**
- Changing pricing or payment model
- Adding/removing features
- Modifying refund policy
- Changing company details (name, address, registration)

---

### 3. Refund Policy (`refund-policy.md`)
**Purpose:** 14-day money-back guarantee details

**Key Compliance:**
- Consumer Rights Act 2015 compliant
- 14-day cooling-off period
- Fair use policy (20% usage threshold)
- Clear refund process

**Must Update When:**
- Changing refund conditions
- Modifying refund timeline
- Adjusting usage thresholds

---

### 4. Cookie Policy (`cookie-policy.md`)
**Purpose:** Explains cookie usage and user rights

**Key Compliance:**
- Privacy and Electronic Communications Regulations (PECR)
- UK GDPR
- Details essential, analytics, and functional cookies
- Third-party cookie disclosure (Google, Stripe)

**Must Update When:**
- Adding new cookies or tracking
- Integrating new analytics services
- Changing cookie consent mechanism

---

### 5. Acceptable Use Policy (`acceptable-use-policy.md`)
**Purpose:** Rules for platform usage

**Key Clauses:**
- Prohibited activities (scraping, account sharing, fraud)
- Consequences of violations
- Security best practices
- Intellectual property protection

**Must Update When:**
- Identifying new abuse patterns
- Adding new prohibited activities
- Changing enforcement procedures

---

### 6. Disclaimer (`disclaimer.md`)
**Purpose:** Important disclaimers and limitations

**Key Disclaimers:**
- Not affiliated with SIA
- Not official SIA content
- No guarantee of exam success
- Content accuracy limitations
- Not professional advice

**Must Update When:**
- Changing service offerings
- Adding new content types
- Modifying guarantees or warranties

---

## Implementation Instructions

### Step 1: Update Routes

Add legal routes to `src/utils/constants.ts`:

```typescript
export const ROUTES = {
  // ... existing routes
  LEGAL: '/legal/:docType',
} as const;
```

### Step 2: Add Legal Routes to App

Update `src/App.tsx` to include legal routes:

```typescript
import { LegalPage } from '@components/legal';

// Inside <Routes>
<Route path="/legal/:docType" element={<LegalPage />} />
```

### Step 3: Add Footer with Legal Links

Create or update your footer component to include legal links:

```typescript
import { LEGAL_ROUTES } from '@components/legal';

<footer className="bg-gray-900 text-white py-8">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-bold mb-4">Legal</h3>
        <ul className="space-y-2">
          <li>
            <Link to={LEGAL_ROUTES.PRIVACY_POLICY} className="hover:text-accent">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to={LEGAL_ROUTES.TERMS_OF_SERVICE} className="hover:text-accent">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link to={LEGAL_ROUTES.REFUND_POLICY} className="hover:text-accent">
              Refund Policy
            </Link>
          </li>
          <li>
            <Link to={LEGAL_ROUTES.COOKIE_POLICY} className="hover:text-accent">
              Cookie Policy
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>
```

### Step 4: Add Content Disclaimer to Quiz Pages

In `QuizPage.tsx` and `MockExamPage.tsx`:

```typescript
import { ContentDisclaimer } from '@components/legal';

// At the top of the quiz content
<ContentDisclaimer />
```

### Step 5: Add Cookie Consent Banner

Create a cookie consent component (if not already exists):

```typescript
// src/components/legal/CookieConsent.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LEGAL_ROUTES } from '@components/legal';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const declineOptional = () => {
    localStorage.setItem('cookie_consent', 'essential_only');
    setShowBanner(false);
    // Disable analytics cookies
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          We use cookies to improve your experience. Essential cookies are
          required for the platform to function.{' '}
          <Link to={LEGAL_ROUTES.COOKIE_POLICY} className="underline">
            Learn more
          </Link>
        </p>
        <div className="flex gap-3">
          <button
            onClick={declineOptional}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Essential Only
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 bg-accent rounded hover:bg-accent-600"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Step 6: Link to Legal Docs in Registration/Checkout

In registration and payment forms:

```typescript
<p className="text-sm text-gray-600">
  By continuing, you agree to our{' '}
  <Link to={LEGAL_ROUTES.TERMS_OF_SERVICE} className="text-accent underline">
    Terms of Service
  </Link>{' '}
  and{' '}
  <Link to={LEGAL_ROUTES.PRIVACY_POLICY} className="text-accent underline">
    Privacy Policy
  </Link>
</p>
```

---

## Before Launch Checklist

### Legal Review
- [ ] Have all documents reviewed by a UK solicitor
- [ ] Verify GDPR compliance with a data protection specialist
- [ ] Ensure Consumer Rights Act 2015 compliance
- [ ] Check Electronic Commerce Regulations 2002 compliance

### Company Information
- [ ] Replace all `[Company Name]` placeholders with actual company name
- [ ] Replace `[Company Number]` with Companies House registration number
- [ ] Replace `[Registered Address]` with actual registered address
- [ ] Update `support@siaexamprep.co.uk` if using different email
- [ ] Add VAT number if VAT registered

### Implementation
- [ ] Legal routes added to App.tsx
- [ ] Footer with legal links implemented
- [ ] Cookie consent banner implemented
- [ ] Content disclaimers added to quiz pages
- [ ] Legal links in registration/checkout flows
- [ ] Terms acceptance checkbox in registration
- [ ] Privacy policy link in data collection forms

### Testing
- [ ] All legal pages load correctly
- [ ] Links in legal documents work (internal and external)
- [ ] Mobile responsive layout
- [ ] Content is readable and formatted correctly
- [ ] Cookie consent works properly
- [ ] Disclaimer appears on quiz pages

### Compliance
- [ ] Cookie consent mechanism implemented
- [ ] Data access request process defined
- [ ] Data deletion process defined
- [ ] Refund request process defined
- [ ] Customer support email monitored
- [ ] Legal compliance monitoring process established

### Documentation
- [ ] Keep a version history of all legal documents
- [ ] Document any legal reviews or changes
- [ ] Maintain records of when users accepted terms
- [ ] Track when policies were updated and users notified

---

## Updating Legal Documents

### Version Control
1. Update the "Last Updated" date at the top of the document
2. Update the version number (e.g., 1.0 → 1.1)
3. Keep a changelog of what changed

### User Notification
For **material changes**, you must:
1. Email all registered users at least 14 days before changes take effect
2. Display a prominent notice on the platform
3. Require re-acceptance of terms (for major changes to Terms of Service)

### What Constitutes Material Changes?
- Changes to refund policy
- Changes to data collection or usage
- New third-party integrations
- Changes to pricing or payment terms
- Changes to user rights or obligations
- Changes to limitation of liability

---

## Common Mistakes to Avoid

### ❌ Don't
- Copy legal documents from other websites (copyright infringement)
- Use templates without customization for your specific business
- Launch without legal review by a qualified solicitor
- Forget to update documents when business practices change
- Hide legal links in hard-to-find places
- Use overly complex legal jargon that users can't understand
- Fail to notify users of material changes

### ✅ Do
- Get professional legal review before launch
- Update documents whenever business practices change
- Make legal documents easily accessible (footer, registration, checkout)
- Use clear, plain English where possible
- Keep records of when users accept terms
- Monitor changes in UK data protection and consumer law
- Implement a process for handling data subject requests

---

## Legal Compliance Resources

### UK Regulatory Bodies
- **Information Commissioner's Office (ICO):** https://ico.org.uk/
  - GDPR and data protection guidance
  - Register as a data controller (if required)

- **Competition and Markets Authority (CMA):** https://www.gov.uk/cma
  - Consumer rights enforcement
  - Fair trading practices

- **Companies House:** https://www.gov.uk/government/organisations/companies-house
  - Company registration
  - Annual filings

### Legal Guidance
- **Citizens Advice:** https://www.citizensadvice.org.uk/
  - Consumer rights information

- **GOV.UK Business Guidance:** https://www.gov.uk/browse/business
  - E-commerce regulations
  - Data protection requirements

### Professional Advice
- **Law Society:** https://www.lawsociety.org.uk/
  - Find a qualified solicitor

- **Data Protection Solicitors:** Seek specialists in UK GDPR and e-commerce law

---

## Support Contacts

For questions about these legal documents:
- **General inquiries:** support@siaexamprep.co.uk
- **Data protection:** privacy@siaexamprep.co.uk
- **Refund requests:** support@siaexamprep.co.uk (subject: "Refund Request")
- **Legal inquiries:** legal@siaexamprep.co.uk (if separate legal team)

---

## License and Usage

These legal documents are specific to SIA Exam Prep and should not be copied or reused for other businesses without proper legal review and customization.

**© 2025 [Company Name]. All rights reserved.**

---

**Last Updated:** 7 December 2025
**Document Version:** 1.0
