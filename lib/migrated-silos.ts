// Maps guide categorySlug/subcategorySlug values, and legacy /categories/<slug>
// pages, to their new topic-first silo route once that silo's content has been
// migrated. Only entries here get a 301/308 redirect from the old URL — every
// other /guide, /reviews, /categories URL is left untouched (KEEP) until it is
// explicitly migrated, merged, or retired. Never treat this as a blanket map;
// add to it only when the new destination covers the same search intent.

// guide categorySlug OR subcategorySlug -> new silo slug
export const MIGRATED_GUIDE_SLUGS_TO_SILO: Record<string, string> = {
  "task-chairs": "chairs",
  "office-seating": "chairs",
  "kneeling-chairs": "chairs",
  "drafting-chairs": "chairs",
  "chair-mats": "chairs",
  "office-chairs": "chairs",
};

// legacy /categories/<slug> -> new silo slug (same audience, same intent, 1:1)
export const MIGRATED_CATEGORY_TO_SILO: Record<string, string> = {
  chairs: "chairs",
};

export function siloForGuide(categorySlug: string, subcategorySlug: string): string | undefined {
  return MIGRATED_GUIDE_SLUGS_TO_SILO[subcategorySlug] ?? MIGRATED_GUIDE_SLUGS_TO_SILO[categorySlug];
}
