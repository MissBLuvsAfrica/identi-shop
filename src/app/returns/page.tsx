import { SITE_NAME, RETURNS_POLICY, CONTACT_INFO } from '@/lib/constants';

export const metadata = {
  title: 'Returns & Exchanges',
  description: 'Our returns and exchange policy.',
};

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light tracking-wide mb-4">RETURNS & EXCHANGES</h1>
        <p className="text-gray-600">Our policy on returns and exchanges</p>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-12">
        <h2 className="text-lg font-medium text-yellow-800 mb-2">IMPORTANT</h2>
        <p className="text-yellow-700 text-lg font-medium">{RETURNS_POLICY.summary}</p>
      </div>

      <div className="prose prose-lg max-w-none">
        {/* Returns Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-light tracking-wide mb-6">RETURNS POLICY</h2>
          <p className="text-gray-600 mb-4">
            At {SITE_NAME}, we do not accept returns on any items. All sales are final.
          </p>
          <p className="text-gray-600">
            We encourage customers to carefully review product descriptions, images, and size guides 
            before making a purchase. If you have any questions about a product, please contact us 
            before placing your order.
          </p>
        </section>

        {/* Exchange Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-light tracking-wide mb-6">EXCHANGE POLICY</h2>
          <p className="text-gray-600 mb-4">
            We allow exchanges within 24 hours of delivery, subject to the following conditions:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            {RETURNS_POLICY.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </section>

        {/* How to Request an Exchange */}
        <section className="mb-12">
          <h2 className="text-2xl font-light tracking-wide mb-6">HOW TO REQUEST AN EXCHANGE</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-4">
            <li>
              <strong>Contact us within 24 hours</strong> of delivery via WhatsApp with:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>Your order number</li>
                <li>Item(s) you wish to exchange</li>
                <li>Preferred replacement (size/color)</li>
                <li>Photo of item in original condition</li>
              </ul>
            </li>
            <li>
              <strong>Wait for approval</strong> - We&apos;ll review your request and confirm if an 
              exchange is possible based on availability.
            </li>
            <li>
              <strong>Ship the item back</strong> - Once approved, ship the item to our address. 
              Customer covers return shipping costs unless the item is defective.
            </li>
            <li>
              <strong>Receive your exchange</strong> - Upon receiving and inspecting the returned item, 
              we&apos;ll ship your replacement.
            </li>
          </ol>
        </section>

        {/* Defective Items */}
        <section className="mb-12">
          <h2 className="text-2xl font-light tracking-wide mb-6">DEFECTIVE ITEMS</h2>
          <p className="text-gray-600 mb-4">
            If you receive a defective item, please contact us immediately via WhatsApp with:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>Your order number</li>
            <li>Clear photos showing the defect</li>
            <li>Description of the issue</li>
          </ul>
          <p className="text-gray-600">
            For verified defective items, we will cover return shipping costs and send a replacement 
            or offer store credit at our discretion.
          </p>
        </section>

        {/* What We Don't Accept */}
        <section className="mb-12">
          <h2 className="text-2xl font-light tracking-wide mb-6">ITEMS NOT ELIGIBLE FOR EXCHANGE</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Items worn, used, or altered in any way</li>
            <li>Items without original tags and packaging</li>
            <li>Items returned after 24 hours of delivery</li>
            <li>Items marked as &quot;Final Sale&quot;</li>
            <li>Items damaged by the customer</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-gray-50 p-8 text-center">
          <h2 className="text-xl font-medium mb-4">QUESTIONS?</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about our exchange policy, please don&apos;t hesitate to contact us.
          </p>
          <div className="space-y-2 text-gray-600 mb-6">
            <p>Email: {CONTACT_INFO.email}</p>
            <p>Phone: {CONTACT_INFO.phone}</p>
          </div>
          <a
            href={`https://wa.me/${process.env.WHATSAPP_E164 || '254700000000'}?text=Hi! I have a question about your exchange policy.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3 hover:bg-green-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            CHAT WITH US
          </a>
        </section>
      </div>
    </div>
  );
}
