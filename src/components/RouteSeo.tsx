import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = 'Helen’s Varieties';
const DEFAULT_TITLE = `${SITE} — Pre-Order Quality Products from 1688 & Global Suppliers, Delivered in Nigeria`;
const DEFAULT_DESCRIPTION =
  'Discover More. Pre-Order with Confidence. Source products directly from 1688, China and worldwide manufacturers, delivered to Nigeria. Order and get updates on WhatsApp.';

interface PageMeta {
  title: string;
  description?: string;
  noindex?: boolean;
}

// Titles for each route. Pages that must not appear in search results are marked noindex.
const META: Array<[RegExp, PageMeta]> = [
  [/^\/$/, { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION }],
  [/^\/shop$/, { title: `Shop Products | ${SITE}`, description: 'Browse products you can pre-order from 1688 and global suppliers, with prices in Naira.' }],
  [/^\/(pre-order|about)$/, { title: `How Pre-Ordering Works | ${SITE}`, description: 'See how we source, inspect, ship and deliver your pre-order from China to Nigeria, and how shipping and customs are billed.' }],
  [/^\/contact$/, { title: `Contact & Sourcing Requests | ${SITE}`, description: 'Ask a question or send us a 1688 product link to source. We reply on WhatsApp.' }],
  [/^\/privacy$/, { title: `Privacy Policy | ${SITE}`, description: 'What personal information we collect when you order, how we use it, and your rights.' }],
  [/^\/terms$/, { title: `Terms of Service | ${SITE}`, description: 'How pre-ordering, payment, delivery and returns work with Helen’s Varieties Venture.' }],
  [/^\/track$/, { title: `Track Your Order | ${SITE}`, noindex: true }],
  [/^\/cart$/, { title: `Your Cart | ${SITE}`, noindex: true }],
  [/^\/checkout$/, { title: `Checkout | ${SITE}`, noindex: true }],
  [/^\/invoice\//, { title: `Receipt | ${SITE}`, noindex: true }],
  [/^\/admin/, { title: `Admin | ${SITE}`, noindex: true }],
];

function setMeta(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Sets the page title, description and robots tag for the current route. Product pages set their own. */
export const RouteSeo: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (/^\/product\//.test(pathname)) return; // ProductDetailPage sets its own title
    const match = META.find(([rx]) => rx.test(pathname));
    const meta: PageMeta = match ? match[1] : { title: `Page not found | ${SITE}`, noindex: true };
    document.title = meta.title;
    setMeta('description', meta.description || DEFAULT_DESCRIPTION);
    setMeta('robots', meta.noindex ? 'noindex, nofollow' : 'index, follow');
  }, [pathname]);

  return null;
};

/** For pages that know their own title (for example a product). */
export function setPageMeta(title: string, description?: string) {
  document.title = `${title} | ${SITE}`;
  if (description) setMeta('description', description.slice(0, 300));
  setMeta('robots', 'index, follow');
}
