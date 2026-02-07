import { SITE_NAME, CONTACT_INFO } from '@/lib/constants';

export const metadata = {
  title: 'Cookie Policy',
  description: 'How we use cookies on our website.',
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light tracking-wide mb-4">COOKIE POLICY</h1>
        <p className="text-gray-600">Last updated: February 2026</p>
      </div>

      <div className="prose prose-lg max-w-none text-gray-600">
        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">WHAT ARE COOKIES?</h2>
          <p>
            Cookies are small text files that are placed on your device when you visit a website. 
            They are widely used to make websites work more efficiently and to provide information 
            to website owners.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">HOW WE USE COOKIES</h2>
          <p>We use cookies for the following purposes:</p>
          
          <h3 className="text-lg font-medium text-black mt-6 mb-3">Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable core 
            functionality such as shopping cart management and secure checkout. Without these 
            cookies, the website cannot function properly.
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Shopping cart contents</li>
            <li>Session management</li>
            <li>Admin authentication</li>
          </ul>

          <h3 className="text-lg font-medium text-black mt-6 mb-3">Performance Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting 
            and reporting information anonymously.
          </p>

          <h3 className="text-lg font-medium text-black mt-6 mb-3">Functionality Cookies</h3>
          <p>
            These cookies allow the website to remember choices you make and provide enhanced, 
            more personalized features.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">COOKIES WE USE</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 mt-4">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-black">Cookie Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-black">Purpose</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-black">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm">identi_cart</td>
                  <td className="px-4 py-2 text-sm">Stores shopping cart contents</td>
                  <td className="px-4 py-2 text-sm">7 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">identi_admin_session</td>
                  <td className="px-4 py-2 text-sm">Admin authentication</td>
                  <td className="px-4 py-2 text-sm">24 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">THIRD-PARTY COOKIES</h2>
          <p>
            We may use third-party services that set cookies on your device. These include:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li><strong>Payment Providers:</strong> Flutterwave may set cookies during the checkout process</li>
            <li><strong>Analytics:</strong> We may use analytics services to understand website usage</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">MANAGING COOKIES</h2>
          <p>
            You can control and manage cookies in various ways. Please note that removing or 
            blocking cookies can impact your user experience and parts of our website may no 
            longer be fully accessible.
          </p>
          
          <h3 className="text-lg font-medium text-black mt-6 mb-3">Browser Controls</h3>
          <p>
            Most browsers allow you to view, manage, delete, and block cookies for websites. 
            Be aware that if you delete all cookies, any preferences you have set will be lost, 
            including the ability to opt out of cookies.
          </p>

          <h3 className="text-lg font-medium text-black mt-6 mb-3">Managing Analytics Cookies</h3>
          <p>
            You can opt out of analytics tracking by using your browser&apos;s Do Not Track feature 
            or by using browser extensions designed to block tracking.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">CHANGES TO THIS POLICY</h2>
          <p>
            We may update this Cookie Policy from time to time. Any changes will be posted on 
            this page with an updated revision date.
          </p>
        </section>

        <section className="bg-gray-50 p-6 mt-12">
          <h2 className="text-xl font-medium text-black mb-4">CONTACT US</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at:
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
