/**
 * Legal Page Component
 * Displays legal documents (Privacy Policy, Terms of Service, etc.)
 */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '@utils/constants';

/**
 * Legal document types
 */
export type LegalDocumentType =
  | 'privacy-policy'
  | 'terms-of-service'
  | 'refund-policy'
  | 'cookie-policy'
  | 'acceptable-use-policy'
  | 'disclaimer';

/**
 * Legal document metadata
 */
interface LegalDocumentMeta {
  title: string;
  description: string;
  path: string;
}

/**
 * Legal document metadata mapping
 */
const LEGAL_DOCUMENTS: Record<LegalDocumentType, LegalDocumentMeta> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal information',
    path: '/src/legal/privacy-policy.md',
  },
  'terms-of-service': {
    title: 'Terms of Service',
    description: 'Terms and conditions for using SIA Exam Prep',
    path: '/src/legal/terms-of-service.md',
  },
  'refund-policy': {
    title: 'Refund Policy',
    description: 'Our 14-day money-back guarantee and refund terms',
    path: '/src/legal/refund-policy.md',
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    description: 'How we use cookies and tracking technologies',
    path: '/src/legal/cookie-policy.md',
  },
  'acceptable-use-policy': {
    title: 'Acceptable Use Policy',
    description: 'Rules and guidelines for using our platform',
    path: '/src/legal/acceptable-use-policy.md',
  },
  disclaimer: {
    title: 'Disclaimer',
    description: 'Important disclaimers and limitations',
    path: '/src/legal/disclaimer.md',
  },
};

/**
 * Simple markdown to HTML converter
 * Handles basic markdown syntax for legal documents
 */
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Headers (h1-h6)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">$1</a>');

  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr class="my-8 border-gray-300" />');

  // Lists (unordered)
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gims, '<ul class="list-disc ml-6 mb-4">$1</ul>');

  // Lists (ordered)
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-accent pl-4 italic my-4">$1</blockquote>');

  // Code blocks (simple)
  html = html.replace(/```(.*?)```/gims, '<pre class="bg-gray-100 p-4 rounded my-4 overflow-x-auto"><code>$1</code></pre>');

  // Inline code
  html = html.replace(/`(.*?)`/gim, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>');

  // Paragraphs (split by double newline)
  const paragraphs = html.split('\n\n');
  html = paragraphs
    .map((p) => {
      const trimmed = p.trim();
      // Don't wrap if already an HTML tag
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol') ||
        trimmed.startsWith('<hr') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<table') ||
        trimmed === ''
      ) {
        return trimmed;
      }
      return `<p class="mb-4">${trimmed}</p>`;
    })
    .join('\n');

  // Tables (basic support)
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match.split('|').filter((cell) => cell.trim() !== '');
    const cellsHtml = cells.map((cell) => `<td class="border px-4 py-2">${cell.trim()}</td>`).join('');
    return `<tr>${cellsHtml}</tr>`;
  });
  html = html.replace(/(<tr>.*<\/tr>)/gims, '<table class="table-auto border-collapse border w-full my-4">$1</table>');

  return html;
}

/**
 * Legal Page Component
 */
export function LegalPage() {
  const { docType } = useParams<{ docType: LegalDocumentType }>();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const documentMeta = docType ? LEGAL_DOCUMENTS[docType] : null;

  useEffect(() => {
    async function loadDocument() {
      if (!docType || !documentMeta) {
        setError('Invalid document type');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch the markdown file
        const response = await fetch(documentMeta.path);

        if (!response.ok) {
          throw new Error(`Failed to load document: ${response.statusText}`);
        }

        const markdown = await response.text();
        const html = markdownToHtml(markdown);
        setContent(html);
      } catch (err) {
        console.error('Error loading legal document:', err);
        setError('Failed to load document. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadDocument();
  }, [docType, documentMeta]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !documentMeta) {
    return (
      <div className="min-h-screen bg-background px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-lg bg-red-50 p-6 text-center">
            <h1 className="mb-4 text-2xl font-bold text-red-800">Error</h1>
            <p className="mb-6 text-red-600">{error || 'Document not found'}</p>
            <Link
              to={ROUTES.HOME}
              className="inline-block rounded-lg bg-primary px-6 py-2 text-white transition hover:bg-primary-600"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <Link
            to={ROUTES.HOME}
            className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-primary"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-primary">
            {documentMeta.title}
          </h1>
          <p className="text-gray-600">{documentMeta.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <div
            className="legal-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-4">
              If you have any questions about this document, please contact us
              at:
            </p>
            <p className="font-semibold">support@siaexamprep.co.uk</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Legal page routes helper
 */
export const LEGAL_ROUTES = {
  PRIVACY_POLICY: '/legal/privacy-policy',
  TERMS_OF_SERVICE: '/legal/terms-of-service',
  REFUND_POLICY: '/legal/refund-policy',
  COOKIE_POLICY: '/legal/cookie-policy',
  ACCEPTABLE_USE_POLICY: '/legal/acceptable-use-policy',
  DISCLAIMER: '/legal/disclaimer',
} as const;
