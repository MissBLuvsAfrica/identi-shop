import { SITE_NAME, RETURNS_POLICY } from '@/lib/constants';
import { WHATSAPP_E164_DEFAULT } from '@/config/contact';

export const metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about orders, delivery, and returns.',
};

const faqs = [
  {
    category: 'ORDERS',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Browse our collection, select your preferred size and color, add items to your bag, and proceed to checkout. You can pay via M-Pesa, Card, or choose Pay on Delivery.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'Please contact us immediately via WhatsApp if you need to modify or cancel your order. Once an order has been dispatched, it cannot be cancelled.',
      },
      {
        q: 'How will I know my order is confirmed?',
        a: 'You\'ll receive an email confirmation immediately after placing your order. For payment gateway orders, you\'ll receive a second confirmation once payment is verified.',
      },
    ],
  },
  {
    category: 'PAYMENT',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept M-Pesa, Airtel Money, Visa/Mastercard, and Pay on Delivery for select locations.',
      },
      {
        q: 'Is it safe to pay online?',
        a: 'Yes, all payments are processed securely through Flutterwave, a PCI-DSS compliant payment gateway. We never store your card details.',
      },
      {
        q: 'When is my card charged?',
        a: 'Your card is charged immediately upon successful payment authorization. For M-Pesa, you\'ll receive an STK push to complete the transaction.',
      },
    ],
  },
  {
    category: 'DELIVERY',
    questions: [
      {
        q: 'Where do you deliver?',
        a: 'We deliver nationwide across Kenya. Delivery fees and times vary by location and are displayed at checkout.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Delivery times depend on your location: Nairobi CBD (1-2 days), Other Nairobi areas (2-3 days), Major towns (3-5 days), Other areas (5-7 days).',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is dispatched, you\'ll receive tracking information via email and WhatsApp. You can also contact us for updates.',
      },
    ],
  },
  {
    category: 'RETURNS & EXCHANGES',
    questions: [
      {
        q: 'What is your return policy?',
        a: RETURNS_POLICY.summary + ' Items must be in original condition with tags attached.',
      },
      {
        q: 'How do I request an exchange?',
        a: 'Contact us via WhatsApp within 24 hours of delivery with your order number and reason for exchange. We\'ll guide you through the process.',
      },
      {
        q: 'Who pays for exchange shipping?',
        a: 'For defective items, we cover return shipping. For size/color exchanges, the customer covers return shipping costs.',
      },
    ],
  },
  {
    category: 'PRODUCTS',
    questions: [
      {
        q: 'Are your products authentic?',
        a: 'Yes, all our products are 100% authentic. We source directly from verified suppliers and can provide authenticity certificates upon request.',
      },
      {
        q: 'How do I know my size?',
        a: 'Please refer to our size guide on each product page. If you\'re unsure, contact us via WhatsApp and we\'ll help you find the right fit.',
      },
      {
        q: 'What if an item is out of stock?',
        a: 'Contact us via WhatsApp with the item details and we\'ll let you know when it becomes available or suggest similar alternatives.',
      },
    ],
  },
];

export default function FAQsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light tracking-wide mb-4">FREQUENTLY ASKED QUESTIONS</h1>
        <p className="text-gray-600">Everything you need to know about shopping with {SITE_NAME}</p>
      </div>

      <div className="space-y-12">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-medium tracking-wide mb-6 pb-2 border-b">
              {section.category}
            </h2>
            <div className="space-y-6">
              {section.questions.map((faq, index) => (
                <div key={index}>
                  <h3 className="font-medium mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 bg-gray-50 p-8 text-center">
        <h2 className="text-xl font-medium mb-4">STILL HAVE QUESTIONS?</h2>
        <p className="text-gray-600 mb-6">
          We&apos;re here to help. Reach out to us on WhatsApp for immediate assistance.
        </p>
        <a
          href={`https://wa.me/${process.env.WHATSAPP_E164 || WHATSAPP_E164_DEFAULT}?text=Hi! I have a question.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3 hover:bg-green-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          CHAT WITH US
        </a>
      </div>
    </div>
  );
}
