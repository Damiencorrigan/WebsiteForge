/**
 * Trade preset: electrician / "sparky". NOTE the copy gate has an 'electrical'
 * banned list — electrical advertising is regulated; keep claims specific and
 * carry the licence number in business-info.licences.
 */
import type { Service } from '../../src/data/services.ts';

export const trade = 'electrical';
export const headTerm = 'electrician';
export const wedgeTerm = 'switchboard upgrade';

export const services: Service[] = [
  { slug: 'switchboards', name: 'Switchboard upgrades', blurb: 'Safe, compliant switchboard and RCD upgrades for older homes.' },
  { slug: 'lighting', name: 'Lighting & power', blurb: 'Downlights, power points, outdoor and sensor lighting.' },
  { slug: 'faults', name: 'Fault-finding & repairs', blurb: 'Tracing and fixing electrical faults — no guesswork.' },
  { slug: 'ev', name: 'EV chargers', blurb: 'Home EV charger supply and installation.' },
];
