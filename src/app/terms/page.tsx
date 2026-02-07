import { SITE_NAME, CONTACT_INFO } from '@/lib/constants';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using our website.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light tracking-wide mb-4">TERMS OF SERVICE</h1>
        <p className="text-gray-600">Last updated: February 2026</p>
      </div>

      <div className="prose prose-lg max-w-none text-gray-600">
        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">1. ACCEPTANCE OF TERMS</h2>
          <p>
            By accessing and using the {SITE_NAME} website and services, you agree to be bound by 
            these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">2. USE OF SERVICES</h2>
          <p>
            You agree to use our services only for lawful purposes and in accordance with these Terms. 
            You are responsible for ensuring that your use of the services complies with all applicable 
            laws and regulations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">3. ACCOUNT RESPONSIBILITIES</h2>
          <p>
            When placing an order, you are responsible for providing accurate and complete information. 
            You agree to keep your contact information up to date to ensure we can communicate with 
            you regarding your orders.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">4. PRODUCTS AND PRICING</h2>
          <p>
            All product descriptions, images, and prices are subject to change without notice. We 
            reserve the right to modify or discontinue any product at any time. Prices are displayed 
            in Kenyan Shillings (KES) and include applicable taxes unless otherwise stated.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">5. ORDERS AND PAYMENTS</h2>
          <p>
            All orders are subject to acceptance and availability. We reserve the right to refuse or 
            cancel any order for any reason. Payment must be received before delivery, except for 
            Pay on Delivery orders where applicable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">6. DELIVERY</h2>
          <p>
            We will make reasonable efforts to deliver products within the estimated timeframes. 
            However, delivery times are estimates only and are not guaranteed. Risk of loss and 
            title for items purchased pass to you upon delivery.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">7. RETURNS AND EXCHANGES</h2>
          <p>
            No returns are accepted. Exchanges are allowed within 24 hours of delivery for items 
            in original condition with tags attached. Please refer to our Returns &amp; Exchanges 
            policy for full details.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">8. INTELLECTUAL PROPERTY</h2>
          <p>
            All content on this website, including text, graphics, logos, images, and software, is 
            the property of {SITE_NAME} or its content suppliers and is protected by intellectual 
            property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">9. LIMITATION OF LIABILITY</h2>
          <p>
            To the maximum extent permitted by law, {SITE_NAME} shall not be liable for any indirect, 
            incidental, special, consequential, or punitive damages arising out of your use of our 
            services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">10. GOVERNING LAW</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Kenya. 
            Any disputes arising from these terms shall be subject to the exclusive jurisdiction 
            of the courts of Kenya.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">11. CHANGES TO TERMS</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective 
            immediately upon posting on the website. Your continued use of our services after 
            any changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="bg-gray-50 p-6 mt-12">
          <h2 className="text-xl font-medium text-black mb-4">CONTACT US</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
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
