// Maps guide categorySlug/subcategorySlug values, and legacy /categories/<slug>
// pages, to their new topic-first silo route once that silo's content has been
// migrated. Only entries here get a 301/308 redirect from the old URL — every
// other /guide, /reviews, /categories URL is left untouched (KEEP) until it is
// explicitly migrated, merged, or retired. Never treat this as a blanket map;
// add to it only when the new destination covers the same search intent.
//
// The old category taxonomy (data/categories.ts) does not map 1:1 onto the
// six new silos (data/silos.ts) — most old categorySlug/subcategorySlug values
// (audio-gear, projectors, 3d-printers, networking, home-comfort, filing-
// cabinets, safes, etc.) have no equivalent silo yet and must stay KEEP.

// guide categorySlug OR subcategorySlug -> new silo slug
export const MIGRATED_GUIDE_SLUGS_TO_SILO: Record<string, string> = {
  // Chairs
  "task-chairs": "chairs",
  "office-seating": "chairs",
  "kneeling-chairs": "chairs",
  "drafting-chairs": "chairs",
  "chair-mats": "chairs",
  "office-chairs": "chairs",

  // Desks — actual desk furniture only (accessories like modesty panels stay KEEP)
  "desks": "desks",
  "standing-desks": "desks",
  "corner-desks": "desks",
  "desk-converters": "desks",

  // Lighting — same scope as the old "lighting" category
  "ring-lights": "lighting",
  "video-lighting": "lighting",
  "desk-lamps": "lighting",

  // Desk Setup — monitors, arms, keyboards, cable management, docking
  "monitor-stands": "desk-setup",
  "monitor-arms": "desk-setup",
  "4k-monitors": "desk-setup",
  "gaming-monitors": "desk-setup",
  "usb-c-monitors": "desk-setup",
  "portable-monitors": "desk-setup",
  "displays": "desk-setup",
  "monitor-privacy-screens": "desk-setup",
  "under-monitor-storage-shelves": "desk-setup",
  "laptop-stands": "desk-setup",
  "laptop-screen-extenders": "desk-setup",
  "mechanical-keyboards": "desk-setup",
  "ergonomic-keyboards": "desk-setup",
  "keyboards": "desk-setup",
  "mouse-pads": "desk-setup",
  "mouse-bungees": "desk-setup",
  "vertical-mice": "desk-setup",
  "desk-pads": "desk-setup",
  "cable-management": "desk-setup",
  "cord-organizers": "desk-setup",
  "cable-sleeves": "desk-setup",
  "docking-stations": "desk-setup",
  "kvm-switches": "desk-setup",
  "usb4-docks": "desk-setup",
  "thunderbolt-docks": "desk-setup",
  "usb-c-ethernet-adapters": "desk-setup",
  "webcams": "desk-setup",
  "microphones": "desk-setup",
  "cpu-stands": "desk-setup",
  "tablet-stands": "desk-setup",
  "power-strips": "desk-setup",
  "surge-protectors": "desk-setup",

  // Work Better — ergonomics/habits, non-commercial-leaning buying guides
  "ergonomics": "work-better",
  "blue-light-glasses": "work-better",
  "anti-fatigue-mats": "work-better",
  "under-desk-fitness": "work-better",
  "walking-pads": "work-better",
};

// legacy /categories/<slug> -> new silo slug (same audience, same intent, 1:1 only)
export const MIGRATED_CATEGORY_TO_SILO: Record<string, string> = {
  chairs: "chairs",
  lighting: "lighting",
  // Same slug string on both sides by coincidence — old /categories/desk-setup
  // and the new /desk-setup silo cover materially the same content (monitor
  // arms, keyboards, cable management, docking); genuinely 1:1.
  "desk-setup": "desk-setup",
  // NOTE: "small-room-storage" (old: under-bed storage, bed frames, bookshelves,
  // nightstands, shoe racks, closet organizers — bedroom storage) is NOT mapped
  // to "work-better" (new: ergonomics, focus, productivity habits) even though
  // that's the closest new silo by elimination — the two cover different
  // search intent, and redirecting bedroom-storage traffic to an ergonomics
  // page would be a genuine content mismatch, not a real migration. Leave
  // /categories/small-room-storage as KEEP until/unless a real equivalent
  // silo exists for it.
};

export function siloForGuide(categorySlug: string, subcategorySlug: string): string | undefined {
  return MIGRATED_GUIDE_SLUGS_TO_SILO[subcategorySlug] ?? MIGRATED_GUIDE_SLUGS_TO_SILO[categorySlug];
}

// Slugs that have a hand-authored static route at app/(site)/guide/<slug>/page.tsx
// AND are not covered by guideDataLoaders (i.e. their data/guides/<slug>.ts uses a
// legacy custom schema RichGuidePage can't render). For these, the literal route is
// the ONLY place their full content exists — GuideDetail only has thin registry
// stub fields for them. A silo detail page must redirect back to /guide/<slug>
// rather than render GuideDetail, or it silently serves an emptied-out page.
// Computed once at module load; safe because app/(site)/guide/* never changes at
// runtime.
let legacyLiteralRouteSlugs: Set<string> | undefined;

export function hasLegacyLiteralRoute(slug: string): boolean {
  if (!legacyLiteralRouteSlugs) {
    legacyLiteralRouteSlugs = new Set<string>();
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs") as typeof import("fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path") as typeof import("path");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { guideDataLoaders } = require("@/data/guides-index.generated") as {
        guideDataLoaders: Record<string, unknown>;
      };
      const guideDir = path.join(process.cwd(), "app", "(site)", "guide");
      const staticRouteSlugs = fs
        .readdirSync(guideDir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith("[") && !d.name.startsWith("("))
        .map((d) => d.name);
      for (const s of staticRouteSlugs) {
        if (!guideDataLoaders[s]) legacyLiteralRouteSlugs.add(s);
      }
    } catch {
      // If this can't be computed, fail open (empty set) rather than crash rendering.
    }
  }
  return legacyLiteralRouteSlugs.has(slug);
}

// All categorySlug/subcategorySlug values migrated into a given silo — the
// single source of truth for that silo's generateStaticParams/matching guard,
// so it can never drift from the redirect map above.
export function matchSlugsForSilo(siloSlug: string): string[] {
  return Object.entries(MIGRATED_GUIDE_SLUGS_TO_SILO)
    .filter(([, silo]) => silo === siloSlug)
    .map(([slug]) => slug);
}
