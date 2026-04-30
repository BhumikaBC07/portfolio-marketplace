import type { Metadata } from 'next';
import PricingTable from '@/components/PricingTable';

export const metadata: Metadata = {
  title: 'Pricing — PortfolioHub',
  description: 'Simple, transparent pricing for portfolio templates. Start free, upgrade when ready.',
};

const faq = [
  {
    q: 'Can I try before I buy?',
    a: 'Yes! All templates have a free preview mode and we offer free templates in every category so you can evaluate quality before purchasing.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'We offer a 14-day money-back guarantee on all paid plans. If you\'re not happy, just email us for a full refund.',
  },
  {
    q: 'Can I use templates for client work?',
    a: 'Pro plans include a commercial license for personal and client projects. Agency plans cover up to 5 team members and unlimited client projects.',
  },
  {
    q: 'Do templates include the source code?',
    a: 'Yes! All purchased templates come with full source code, documentation, and setup guides. Free templates have limited access.',
  },
  {
    q: 'What tech stack are templates built with?',
    a: 'Templates are built with modern stacks: Next.js, React, Tailwind CSS, and more. Each template page lists the exact tech stack.',
  },
];

export default function PricingPage() {
  return (
    <div className="pt-16" style={{ backgroundColor: '#f9f5ef' }}>
      <PricingTable />

      {/* FAQ */}
      <section className="py-24 px-6 lg:px-8" style={{ backgroundColor: '#f9f5ef' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-widest text-taupe-500 uppercase mb-3">FAQ</p>
            <h2 className="font-serif text-display-sm text-ink">Common Questions</h2>
          </div>

          <div className="divide-y divide-ivory-400 border border-ivory-400" style={{ borderRadius: '2px' }}>
            {faq.map((item, i) => (
              <div key={i} className="p-6" style={{ backgroundColor: i % 2 === 0 ? '#f9f5ef' : '#f0ebe0' }}>
                <h3 className="font-medium text-ink mb-2 text-sm">{item.q}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
