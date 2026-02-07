import { SITE_NAME, CONTACT_INFO } from '@/lib/constants';

export const metadata = {
  title: 'About Us',
  description: 'Learn about our story and commitment to luxury craftsmanship.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light tracking-wide mb-4">ABOUT {SITE_NAME}</h1>
        <p className="text-gray-600">Crafting Elegance, Delivering Excellence</p>
      </div>

      {/* Story */}
      <div className="prose prose-lg max-w-none">
        <section className="mb-16">
          <h2 className="text-2xl font-light tracking-wide mb-6">OUR STORY</h2>
          <p className="text-gray-600 leading-relaxed">
            {SITE_NAME} was born from a passion for timeless elegance and exceptional craftsmanship. 
            We believe that true luxury lies not in excess, but in the careful selection of pieces 
            that stand the test of time.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Our journey began with a simple mission: to bring the finest handbags and shoes to 
            discerning customers who appreciate quality over quantity. Each item in our collection 
            is handpicked to meet our exacting standards of design, durability, and style.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-light tracking-wide mb-6">OUR PHILOSOPHY</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">QUALITY</h3>
              <p className="text-gray-600 text-sm">
                Only the finest materials and craftsmanship make it into our collection.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">TIMELESSNESS</h3>
              <p className="text-gray-600 text-sm">
                We curate pieces that transcend trends and remain elegant for years.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">SERVICE</h3>
              <p className="text-gray-600 text-sm">
                Exceptional customer care from browsing to delivery and beyond.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-light tracking-wide mb-6">WHY CHOOSE US</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-black mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Carefully curated collection of luxury accessories</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-black mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Nationwide delivery across Kenya</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-black mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Secure payments via M-Pesa, Card, or Pay on Delivery</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-black mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Responsive customer support via WhatsApp</span>
            </li>
          </ul>
        </section>

        <section className="bg-gray-50 p-8 text-center">
          <h2 className="text-2xl font-light tracking-wide mb-4">GET IN TOUCH</h2>
          <p className="text-gray-600 mb-6">
            We&apos;d love to hear from you. Reach out with any questions or feedback.
          </p>
          <div className="space-y-2 text-gray-600">
            <p>{CONTACT_INFO.email}</p>
            <p>{CONTACT_INFO.phone}</p>
            <p>{CONTACT_INFO.address}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
