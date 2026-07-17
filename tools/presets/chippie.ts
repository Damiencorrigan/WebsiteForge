/**
 * Trade preset: carpenter / "chippie". Copy into src/data/services.ts (and set
 * the copy-gate --trade) when forking for a carpentry client. The "niche
 * playbook" idea from 35-JobCatch/ideas.md made real.
 */
import type { Service } from '../../src/data/services.ts';

export const trade = 'carpentry';
export const headTerm = 'carpenter'; // homepage head keyword
export const wedgeTerm = 'formwork'; // low-competition differentiator

export const services: Service[] = [
  { slug: 'formwork', name: 'Formwork', blurb: 'Suspended slabs, columns, walls — set true, stripped clean, on program.' },
  { slug: 'framing', name: 'Framing & structural', blurb: 'Wall and roof framing, subfloors, structural fit-outs — square and to plan.' },
  { slug: 'fitouts', name: 'Fit-outs & fixing', blurb: 'Doors, skirting, architraves, second-fix carpentry with a clean finish.' },
  { slug: 'outdoor', name: 'Decks & pergolas', blurb: 'Decking, pergolas, patios built to last the local weather.' },
];
