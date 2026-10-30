import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { WHATSAPP_PHONE, WHATSAPP_URL } from '../lib/whatsappMessages';

const LAST_UPDATED = '29 October 2026';

interface Section {
  heading: string;
  body: React.ReactNode;
}

const LegalLayout: React.FC<{ title: string; intro: string; sections: Section[]; other: { to: string; label: string } }> = ({
  title,
  intro,
  sections,
  other,
}) => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
    <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0070DC] hover:underline mb-6">
      <ArrowLeft className="w-3.5 h-3.5" /> Back to the shop
    </Link>

    <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
      <header className="border-b border-slate-100 pb-5 mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-500 mt-2">Last updated: {LAST_UPDATED}</p>
        <p className="text-sm text-slate-600 leading-relaxed mt-4">{intro}</p>
      </header>

      <div className="space-y-7">
        {sections.map((s, i) => (
          <section key={s.heading} aria-labelledby={`sec-${i}`}>
            <h2 id={`sec-${i}`} className="text-xl font-bold text-slate-900 mb-2">
              {i + 1}. {s.heading}
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
              {s.body}
            </div>
          </section>
        ))}
      </div>

      <footer className="border-t border-slate-100 mt-8 pt-5 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <span>
          Questions? Message us on{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0070DC] hover:underline">
            WhatsApp {WHATSAPP_PHONE}
          </a>
          .
        </span>
        <Link to={other.to} className="font-semibold text-[#0070DC] hover:underline">
          {other.label}
        </Link>
      </footer>
    </article>
  </div>
);

const privacySections: Section[] = [
  {
    heading: 'Who we are',
    body: (
      <>
        <p>
          Helen’s Varieties Venture (“we”, “us”) runs the website helensvarieties.com.ng. We help customers in Nigeria
          pre-order products from 1688, China and other international suppliers. We decide how and why your personal data
          is used when you shop with us, so we are the “data controller” under the Nigeria Data Protection Act 2023
          (NDPA).
        </p>
        <p>
          You can reach us on WhatsApp at{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0070DC] hover:underline">
            {WHATSAPP_PHONE}
          </a>
          .
        </p>
      </>
    ),
  },
  {
    heading: 'What information we collect',
    body: (
      <ul>
        <li>
          <strong>Order details you give us at checkout:</strong> your full name, phone number, email address (optional if
          you give a phone number), delivery address (street, city and state), the items you order and any notes.
        </li>
        <li>
          <strong>Messages you send us:</strong> the “Contact” form opens WhatsApp with your message filled in. What you
          send (for example your name, WhatsApp number, a product link and your notes) reaches us through WhatsApp.
        </li>
        <li>
          <strong>Information saved on your own device:</strong> your cart, wishlist and a copy of the orders you place
          are stored in your browser so the site can remember them. We do not receive this until you place an order.
        </li>
        <li>
          <strong>Voice and chat assistant:</strong> the assistant answers from our product and order information. If you
          use voice input, your browser’s speech recognition handles it, and your browser provider (for example Google in
          Chrome) may process the audio under its own policy. If spoken replies from an online voice provider are turned on,
          the text of the assistant’s reply (not your personal details) is sent to that provider to produce the audio.
        </li>
      </ul>
    ),
  },
  {
    heading: 'How we use your information',
    body: (
      <>
        <ul>
          <li>to confirm availability, prices and payment with you, usually on WhatsApp;</li>
          <li>to place your order with suppliers, arrange inspection, shipping and delivery to your address;</li>
          <li>to show you your order status when you enter your order number and tracking secret;</li>
          <li>to answer your questions and handle problems with an order;</li>
          <li>to keep business and accounting records, prevent fraud and meet legal obligations.</li>
        </ul>
        <p>
          Our legal bases under the NDPA are: carrying out the order you ask us to make (contract), your consent where we
          ask for it (for example when you choose to message us), our legitimate interest in running and securing the
          business, and legal obligations.
        </p>
        <p>We do not sell your personal data, and the site does not use advertising trackers.</p>
      </>
    ),
  },
  {
    heading: 'Who we share it with',
    body: (
      <ul>
        <li>
          <strong>Delivery and logistics partners and supplier agents</strong>, only what is needed to deliver your order
          (usually your name, phone number and delivery address).
        </li>
        <li>
          <strong>Cloudflare</strong>, our hosting and database provider, which stores the order information described above
          on our behalf.
        </li>
        <li>
          <strong>WhatsApp (Meta)</strong>, when you message us or we message you there.
        </li>
        <li>
          <strong>Authorities</strong>, where the law requires it.
        </li>
      </ul>
    ),
  },
  {
    heading: 'Where your data is stored',
    body: (
      <p>
        Our hosting provider runs data centres in several countries, so your information may be stored or processed outside
        Nigeria. Where that happens we rely on providers that apply appropriate security and data protection safeguards.
      </p>
    ),
  },
  {
    heading: 'How long we keep it',
    body: (
      <p>
        We keep order records for as long as we need them to deliver your order, deal with any complaint or dispute, and meet
        our accounting and legal obligations. After that we delete the information or make it anonymous.
      </p>
    ),
  },
  {
    heading: 'How we protect it',
    body: (
      <p>
        The site uses an encrypted (HTTPS) connection, order details are only visible with the order number and tracking
        secret, and access to our administration area is limited to authorised staff with a password. No online service can be
        completely secure, so please keep your tracking secret private.
      </p>
    ),
  },
  {
    heading: 'Your rights',
    body: (
      <>
        <p>Under the NDPA you can ask us to:</p>
        <ul>
          <li>tell you what personal data we hold about you and give you a copy;</li>
          <li>correct data that is wrong or incomplete;</li>
          <li>delete your data, where we no longer need it;</li>
          <li>stop or restrict using your data in certain ways, or object to how we use it;</li>
          <li>withdraw consent you gave us earlier.</li>
        </ul>
        <p>
          Message us on WhatsApp ({WHATSAPP_PHONE}) with your order number and we will respond. If you are unhappy with our
          answer you can complain to the Nigeria Data Protection Commission (NDPC).
        </p>
      </>
    ),
  },
  {
    heading: 'Children',
    body: <p>Our service is meant for adults. We do not knowingly collect personal data from children.</p>,
  },
  {
    heading: 'Changes to this policy',
    body: (
      <p>
        If we change how we use personal data we will update this page and the “Last updated” date above.
      </p>
    ),
  },
];

const termsSections: Section[] = [
  {
    heading: 'About these terms',
    body: (
      <p>
        These terms apply when you use helensvarieties.com.ng or place a pre-order with Helen’s Varieties Venture. By
        placing an order you agree to them. Please read them together with our{' '}
        <Link to="/privacy" className="font-semibold text-[#0070DC] hover:underline">
          Privacy Policy
        </Link>{' '}
        and the{' '}
        <Link to="/pre-order" className="font-semibold text-[#0070DC] hover:underline">
          How Pre-Order Works
        </Link>{' '}
        page.
      </p>
    ),
  },
  {
    heading: 'How pre-ordering works',
    body: (
      <>
        <p>
          We source products for you from 1688, China and other international suppliers. Items shown on the site are not held
          in stock in Nigeria. When you submit a pre-order you are asking us to source the item for you.
        </p>
        <p>
          Your order is only accepted once we have confirmed availability and the amount with you on WhatsApp and your payment
          has been confirmed. We may decline or cancel an order, for example if an item is unavailable or the information
          provided is wrong. If we cancel an order you have already paid for, we will refund that payment.
        </p>
      </>
    ),
  },
  {
    heading: 'Prices',
    body: (
      <ul>
        <li>Prices are shown in Nigerian Naira (₦).</li>
        <li>
          <strong>Product prices exclude international shipping, customs charges and other applicable delivery fees</strong>{' '}
          unless clearly stated otherwise. These are calculated from the actual weight and arrangements for your order and
          communicated to you separately.
        </li>
        <li>
          Supplier prices and exchange rates can change. The price we confirm with you on WhatsApp before you pay is the price
          of the products in that order.
        </li>
      </ul>
    ),
  },
  {
    heading: 'Payment',
    body: (
      <>
        <p>
          Nothing is charged on the website. After you submit a pre-order we send you our payment details on WhatsApp and you
          pay by bank transfer. Your order starts once we confirm your payment.
        </p>
        <p>
          <strong>Protect yourself from fraud:</strong> only pay into account details that we send you ourselves on WhatsApp
          from {WHATSAPP_PHONE}. We never ask for your card PIN or a one-time password. The receipt on the website is a record
          of your order, not proof of payment.
        </p>
      </>
    ),
  },
  {
    heading: 'Delivery',
    body: (
      <ul>
        <li>
          Delivery times we mention (for example 10 to 15 days for air freight) are estimates, not guarantees. Delays can
          happen at the supplier, in transit or at customs.
        </li>
        <li>
          Please give a correct and complete delivery address and phone number. We are not responsible for failed deliveries
          caused by wrong details.
        </li>
        <li>Shipping, customs and other delivery fees are billed separately when your goods arrive, as explained above.</li>
      </ul>
    ),
  },
  {
    heading: 'Inspection, defects and returns',
    body: (
      <>
        <p>
          Goods are inspected at our China warehouse before shipping. If a defective item or a wrong specification is found at
          that stage, it is returned to the supplier before it ships to Nigeria.
        </p>
        <p>
          Please check your goods when they arrive. If something is damaged, defective or not what you ordered, tell us on
          WhatsApp as soon as possible with your order number and clear photos, and keep the packaging. We will tell you what
          can be done, which can depend on the supplier’s own terms.
        </p>
      </>
    ),
  },
  {
    heading: 'Cancelling an order',
    body: (
      <p>
        You can cancel before we confirm your payment. After we have placed your order with the supplier it may no longer be
        possible to cancel it. Please contact us on WhatsApp as early as you can and we will tell you what can be done.
      </p>
    ),
  },
  {
    heading: 'Items we can source',
    body: (
      <p>
        You are responsible for making sure the items you order can legally be imported into and used in Nigeria. We may
        refuse to source items that are prohibited, restricted or unsafe.
      </p>
    ),
  },
  {
    heading: 'Tracking your order',
    body: (
      <p>
        When you place an order you receive an order number and a tracking secret. Anyone who has both can see the status of
        that order, so please keep them private.
      </p>
    ),
  },
  {
    heading: 'Using the website',
    body: (
      <p>
        Please use the site only for its intended purpose. Do not try to interfere with it, access areas that are not meant for
        you, or use it to send false orders. The text, logo and design of the site belong to Helen’s Varieties Venture.
      </p>
    ),
  },
  {
    heading: 'Our responsibility',
    body: (
      <p>
        We take care to describe products accurately and to deliver what you order. To the extent the law allows, we are not
        responsible for indirect or consequential losses, or for delays caused by events outside our control. Nothing in these
        terms limits any right you have under Nigerian consumer protection law that cannot be limited.
      </p>
    ),
  },
  {
    heading: 'Governing law and disputes',
    body: (
      <p>
        These terms are governed by the laws of the Federal Republic of Nigeria. If there is a problem, please contact us first
        on WhatsApp so we can try to solve it quickly. If we cannot, the Nigerian courts have jurisdiction.
      </p>
    ),
  },
  {
    heading: 'Changes to these terms',
    body: (
      <p>
        We may update these terms from time to time. The version on this page when you place your order is the one that
        applies to it.
      </p>
    ),
  },
];

export const PrivacyPage: React.FC = () => (
  <LegalLayout
    title="Privacy Policy"
    intro="This policy explains what personal information Helen’s Varieties Venture collects when you use our website and place a pre-order, why we use it, and the choices you have."
    sections={privacySections}
    other={{ to: '/terms', label: 'Read the Terms of Service →' }}
  />
);

export const TermsPage: React.FC = () => (
  <LegalLayout
    title="Terms of Service"
    intro="These terms explain how pre-ordering works with Helen’s Varieties Venture: what you can expect from us and what we ask of you."
    sections={termsSections}
    other={{ to: '/privacy', label: 'Read the Privacy Policy →' }}
  />
);
