export interface FaqItem { q: string; a: string }
import { SITE } from '../site';

const strip = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export const faqSchema = (items: FaqItem[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: strip(i.a) } })),
});

export const appSchema = (name: string, path: string, description: string) => ({
  '@type': 'SoftwareApplication',
  name,
  url: new URL(path, SITE.url).href,
  description,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (web browser)',
  softwareVersion: SITE.version,
  license: 'https://opensource.org/licenses/MIT',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
});
