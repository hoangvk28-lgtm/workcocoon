import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { GuideDetail } from "@/components/guide/GuideDetail";
import { getPublicGuideBySlug, getPublicGuidesByCategory } from "@/lib/public-guides";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { guideDataLoaders } from "@/data/guides-index.generated";
import { matchSlugsForSilo } from "@/lib/migrated-silos";

export const revalidate = 604800;

type Props = { params: Promise<{ slug: string }> };

const SILO = "lighting";
const matchSlugs = matchSlugsForSilo(SILO);

export async function generateStaticParams() {
  const guides = await getPublicGuidesByCategory(SILO, matchSlugs);
  return guides.filter((g) => !guideDataLoaders[g.slug]).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getPublicGuideBySlug(slug);
  if (!guide) return {};

  const heroImage = guide.heroImage?.startsWith("http")
    ? guide.heroImage
    : guide.heroImage?.startsWith("/")
    ? `${SITE_URL}${guide.heroImage}`
    : undefined;

  const base = buildMetadata({
    title: guide.metaTitle ?? guide.title,
    description: guide.metaDescription ?? guide.description,
    path: `/lighting/${slug}`,
    image: heroImage,
    type: "article",
  });

  return {
    ...base,
    keywords: [guide.mainKeyword, ...guide.subKeywords],
    openGraph: {
      ...(base.openGraph as object),
      type: "article",
      publishedTime: guide.lastUpdated,
      modifiedTime: guide.lastUpdated,
      authors: [guide.author],
      section: guide.subcategorySlug.replace(/-/g, " "),
    },
  };
}

export default async function LightingGuidePage({ params }: Props) {
  const { slug } = await params;

  // A guide with a rich data/guides/<slug>.ts file always renders at /guide/<slug>
  // via RichGuidePage (see app/(site)/guide/[slug]/page.tsx) - redirect here so this
  // silo never serves a second, simpler-template copy of the same content.
  if (guideDataLoaders[slug]) {
    permanentRedirect(`/guide/${slug}`);
  }

  const guide = await getPublicGuideBySlug(slug);
  if (!guide) notFound();

  // Guard: a guide only renders under /lighting if it actually belongs to the
  // migrated Lighting category/subcategories — anything else 404s here rather
  // than silently rendering unrelated content at a lighting URL.
  if (!matchSlugs.includes(guide.categorySlug) && !matchSlugs.includes(guide.subcategorySlug)) {
    notFound();
  }

  return <GuideDetail slug={slug} basePath="/lighting" sectionLabel="Lighting" sectionHref="/lighting" />;
}
