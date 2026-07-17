/**
 * Trade preset: plumber. Set copy-gate --trade plumbing when forking.
 */
import type { Service } from '../../src/data/services.ts';

export const trade = 'plumbing';
export const headTerm = 'plumber';
export const wedgeTerm = 'gas fitting';

export const services: Service[] = [
  { slug: 'blockages', name: 'Blocked drains', blurb: 'Cleared fast with drain camera and jetter — and told what caused it.' },
  { slug: 'hotwater', name: 'Hot water systems', blurb: 'Repair and replacement of gas, electric and heat-pump hot water.' },
  { slug: 'gas', name: 'Gas fitting', blurb: 'Licensed gas fitting — cooktops, heaters, and leak repairs.' },
  { slug: 'bathrooms', name: 'Bathroom & renos', blurb: 'Rough-in and fit-off for bathroom and kitchen renovations.' },
];
