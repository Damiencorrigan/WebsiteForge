/**
 * Per-offering content. Drives the Services grid AND one Service JSON-LD node
 * each (via lib/jsonld.ts). Order = display order. Keep the differentiator
 * (formwork) first — it's the low-competition Perth head term (showcase plan).
 *
 * CONFIRM the final list + wording with Damien before launch.
 */

export interface Service {
  /** Stable slug (used for anchor ids / future per-service pages). */
  slug: string;
  /** Card heading. */
  name: string;
  /** One-line, benefit-led. No guarantees, no pricing (copy gate enforces). */
  blurb: string;
  /** Optional longer paragraph for the wedge service (formwork gets one). */
  detail?: string;
}

export const services: Service[] = [
  {
    slug: 'formwork',
    name: 'Formwork',
    blurb: 'Suspended slabs, columns, walls and stairs — set true, stripped clean, on program.',
    detail:
      'Formwork is where a pour is won or lost. Straight, plumb, properly braced formwork means a clean strip and no rework — and it is the part most Perth chippie outfits do not offer. If you need a subbie who can set and strip formwork to line and level and keep your pour on schedule, that is the core of what Corrigan Carpentry does.',
  },
  {
    slug: 'framing',
    name: 'Framing & structural carpentry',
    blurb: 'Wall and roof framing, subfloors, structural fit-outs — built square and to plan.',
  },
  {
    slug: 'fitouts',
    name: 'Fit-outs & fixing',
    blurb: 'Doors, skirting, architraves, cabinetry hang and second-fix carpentry with a clean finish.',
  },
  {
    slug: 'outdoor',
    name: 'Decks, pergolas & outdoor',
    blurb: 'Decking, pergolas, patios and outdoor structures built to last the Perth weather.',
  },
];
