import { SITE_NAME, CONTACT_INFO } from '@/lib/constants';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light tracking-wide mb-4">PRIVACY POLICY</h1>
        <p className="text-gray-600">Last updated: February 2026</p>
      </div>

      <div className="prose prose-lg max-w-none text-gray-600">
        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">1. INFORMATION WE COLLECT</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Name, email address, phone number</li>
            <li>Delivery address</li>
            <li>Payment information (processed securely by our payment provider)</li>
            <li>Order history and preferences</li>
            <li>Communications you send to us</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">2. HOW WE USE YOUR INFORMATION</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and updates</li>
            <li>Respond to your inquiries and requests</li>
            <li>Improve our products and services</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Prevent fraud and enhance security</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">3. INFORMATION SHARING</h2>
          <p>
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Payment processors to complete transactions</li>
            <li>Delivery partners to fulfill orders</li>
            <li>Service providers who assist our operations</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">4. DATA SECURITY</h2>
          <p>
            We implement appropriate security measures to protect your personal information. 
            However, no method of transmission over the internet is 100% secure. We use 
            industry-standard encryption for sensitive data transmission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">5. DATA RETENTION</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes 
            for which it was collected, including to satisfy legal, accounting, or reporting 
            requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">6. YOUR RIGHTS</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt out of marketing communications</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">7. COOKIES</h2>
          <p>
            We use cookies to enhance your experience on our website. For more information, 
            please see our Cookie Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">8. THIRD-PARTY LINKS</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for 
            the privacy practices of these websites. We encourage you to read the privacy 
            policies of any third-party sites you visit.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">9. CHILDREN&apos;S PRIVACY</h2>
          <p>
            Our services are not intended for children under 18 years of age. We do not 
            knowingly collect personal information from children.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">10. CHANGES TO THIS POLICY</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any 
            changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="bg-gray-50 p-6 mt-12">
          <h2 className="text-xl font-medium text-black mb-4">CONTACT US</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-4">
            <strong>Email:</strong> {CONTACT_INFO.email}<br />
            <strong>Phone:</strong> {CONTACT_INFO.phone}<br />
            <strong>Address:</strong> {CONTACT_INFO.address}
          </p>
        </section>
      </div>
    </div>
  );
}
