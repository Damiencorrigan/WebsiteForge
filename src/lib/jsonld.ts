/**
 * Structured-data builders. Reads the SAME business-info object the header and
 * footer read, so schema NAP can never disagree with visible NAP.
 *
 * Emits:
 *  - LocalBusiness (legalName, ABN as identifier, telephone, areaServed, address)
 *  - one Service node per services.ts entry
 * Both are dropped into a single @graph in <head> by Seo.astro.
 */

import { business } from '../data/business-info.ts';
import { services } from '../data/services.ts';

export function localBusinessNode() {
  return {
    '@type': 'GeneralContractor',
    '@id': `${business.siteUrl}/#business`,
    name: business.displayName,
    legalName: business.legalName,
    identifier: { '@type': 'PropertyValue', propertyID: 'ABN', value: business.abn },
    url: business.siteUrl,
    // Only emit contact points once real (gate:copy blocks TODO_ from shipping).
    ...(business.phone && !business.phone.startsWith('TODO_')
      ? { telephone: business.phone }
      : {}),
    ...(business.email && !business.email.startsWith('TODO_')
      ? { email: business.email }
      : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      addressCountry: business.address.country,
    },
    areaServed: business.serviceAreas.map((a) => ({ '@type': 'City', name: a })),
    ...(business.gbpUrl ? { hasMap: business.gbpUrl } : {}),
    ...(Object.values(business.socials).some(Boolean)
      ? { sameAs: Object.values(business.socials).filter(Boolean) }
      : {}),
  };
}

export function serviceNodes() {
  return services.map((s) => ({
    '@type': 'Service',
    '@id': `${business.siteUrl}/#service-${s.slug}`,
    name: s.name,
    description: s.blurb,
    serviceType: s.name,
    provider: { '@id': `${business.siteUrl}/#business` },
    areaServed: business.serviceAreas.map((a) => ({ '@type': 'City', name: a })),
  }));
}

/** The full @graph string for a <script type="application/ld+json">. */
export function jsonLdGraph() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [localBusinessNode(), ...serviceNodes()],
  });
}
